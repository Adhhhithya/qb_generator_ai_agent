import hashlib
import re
from app.core.llm_safe import SafeLLM
from app.core.bloom_rules import is_verb_allowed, check_forbidden_topics, get_bloom_verbs
from app.core.generation_safety import UNIVERSAL_SYSTEM_PREFIX, BLOOM_ALLOWED_VERBS, FORBIDDEN_TOPICS

# Local subject guard to block obvious cross-subject drift before returning results
FORBIDDEN_KEYWORDS = [
    "dbms", "sql", "normalization",
    "operating system", "process scheduling",
    "computer networks", "tcp", "ip",
    "physics", "quantum", "semiconductor",
]


def subject_guard(question_text: str) -> bool:
    """Return False if question text leaks into forbidden subjects."""
    text = question_text.lower()
    return not any(word in text for word in FORBIDDEN_KEYWORDS)


class QuestionGeneratorAgent:
    def __init__(self):
        self.llm = SafeLLM()
        self.max_retries = 2
        self.max_tokens = 300
        # STEP 4: Simple in-memory cache for batch generation
        self._cache = {}
    
    def extract_clean_topics(self, topics: list, max_topics: int = 8) -> list:
        """
        STEP 2: Extract clean topics from messy list.
        
        - Remove UNIT/CO codes
        - Remove duplicates
        - Limit to max_topics
        - Return clean topic list
        """
        if not topics:
            return []
        
        # Filter out noise (UNIT, CO codes, empty strings)
        clean = []
        for topic in topics:
            topic_str = str(topic).strip()
            if not topic_str:
                continue
            # Skip if it's just a code or unit marker
            if topic_str.upper().startswith(("UNIT", "CO", "MODULE", "CHAPTER")):
                continue
            if any(x in topic_str.upper() for x in ["[", "]", "MARKS", "HOURS"]):
                continue
            clean.append(topic_str)
        
        # Remove duplicates while preserving order
        seen = set()
        unique = []
        for t in clean:
            t_lower = t.lower()
            if t_lower not in seen:
                seen.add(t_lower)
                unique.append(t)
        
        # Limit to max_topics (STEP 2: No raw dumps, clean list only)
        return unique[:max_topics]
    
    def _compute_bloom_score(self, question_text: str, bloom_level: str) -> float:
        """
        STEP 2: Score-based validation instead of hard rejection.
        Returns score 0.0-1.0 indicating Bloom level compliance.
        """
        text = question_text.lower()
        
        apply_verbs = ["apply", "solve", "demonstrate", "illustrate", "use", "compute", "determine", "evaluate"]
        safe_prefixes = ["using", "given", "consider", "with reference", "based on", "for the following"]
        
        if bloom_level == "Apply":
            has_verb = any(verb in text for verb in apply_verbs)
            has_prefix = any(text.startswith(prefix) for prefix in safe_prefixes)
            if has_verb or has_prefix:
                return 0.9
            return 0.3
        
        elif bloom_level == "Remember":
            remember_starters = ["define", "what is", "state", "list", "identify"]
            if any(text.startswith(starter) for starter in remember_starters):
                return 0.9
            return 0.5
        
        # Default: accept with medium score
        return 0.7
    
    def _build_forbidden_section(self, subject: str, forbidden_topics: list = None) -> str:
        """
        STEP 3: Dynamically generate forbidden topics based on subject.
        Prevents cross-domain contamination.
        """
        base_forbidden = list(FORBIDDEN_TOPICS)
        
        # Add custom forbidden topics if provided
        if forbidden_topics:
            base_forbidden.extend(forbidden_topics)
        
        # If not a DBMS subject, explicitly forbid DBMS terms
        if subject and "database" not in subject.lower() and "dbms" not in subject.lower():
            dbms_terms = ["DBMS", "normalization", "relations", "tables", "SQL", "schemas", "database"]
            for term in dbms_terms:
                if term.lower() not in [f.lower() for f in base_forbidden]:
                    base_forbidden.append(term)
        
        if base_forbidden:
            forbidden_list = "\n".join([f"- {term}" for term in base_forbidden[:15]])
            return f"""
⛔ FORBIDDEN TOPICS (NEVER MENTION):
{forbidden_list}

Questions containing these terms will be marked as INVALID.
"""
        return ""

    async def generate_section_batch(
        self,
        outcome_spec: dict,
        marks: int,
        difficulty: str,
        section_name: str,
        count: int,
        subject: str | None = None,
        topics: list | None = None,
        avoid_questions: list[str] | None = None,
    ) -> dict:
        """
        STEP 1: Generate multiple questions in ONE LLM call.
        Much faster and more consistent than single-question generation.
        
        Returns:
        {
            "questions": [{"question": str, "bloom_level": str, ...}, ...],
            "status": "success" | "partial" | "failed",
            "count": int,
            "cache_hit": bool
        }
        """
        grounded_subject = outcome_spec.get("subject") or subject
        grounded_domain = outcome_spec.get("domain")
        bloom_level = outcome_spec.get("normalized_bloom") or outcome_spec.get("bloom_level") or "Apply"
        
        grounded_topics = self.extract_clean_topics(
            outcome_spec.get("core_topics") or topics or [],
            max_topics=8
        )
        forbidden_topics = outcome_spec.get("forbidden_topics") or []
        
        # STEP 4: Check cache first
        cache_key = hashlib.md5(
            f"{grounded_subject}_{section_name}_{marks}_{bloom_level}_{difficulty}_{count}".encode()
        ).hexdigest()
        
        if cache_key in self._cache:
            cached = self._cache[cache_key]
            return {**cached, "cache_hit": True}
        
        # Build forbidden section
        forbidden_section = self._build_forbidden_section(grounded_subject, forbidden_topics)
        
        # Build topics section (hard allow-list)
        topics_section = ""
        if grounded_topics:
            topics_list = "\n".join([f"- {t}" for t in grounded_topics])
            topics_section = f"""
Syllabus topics (ONLY allowed concepts):
{topics_list}

You MUST:
- Use ONLY the above topics
- NOT introduce new concepts
- NOT rename topics into other domains

If a question cannot be formed using ONLY these topics,
do not invent a new topic.
"""
        
        # Build avoid section
        avoid_section = ""
        if avoid_questions:
            avoid_list = "\n".join([f"- {q[:80]}..." for q in avoid_questions[-3:]])
            avoid_section = f"""
AVOID (already used):
{avoid_list}
"""
        
        # Part-specific instructions
        if marks <= 2:
            part_instruction = """Generate SHORT-ANSWER questions (2 marks each).
- Simple definitions or brief explanations
- Answer in 2-3 sentences
- Focus on recall and understanding"""
        elif 10 <= marks <= 15:
            part_instruction = f"""Generate APPLICATION questions ({marks} marks each).
- Must involve problem-solving or step-by-step application
- Include realistic scenarios or problems
- Require 2-3 pages of detailed working
- DO NOT generate simple definition questions"""
        else:
            part_instruction = f"""Generate ANALYTICAL questions ({marks} marks each).
- Require deep analysis or multi-step reasoning
- Include multiple interconnected parts
- Answer requires 4-5 pages"""
        
        system_prompt = UNIVERSAL_SYSTEM_PREFIX + """
You are an expert university examiner.

CRITICAL:
- Return ONLY valid JSON
- No markdown, no explanations
- Generate EXACTLY the requested number of questions
"""
        
        subject_label = grounded_subject or "UNSPECIFIED_SUBJECT"

        subject_block = f"""
IMPORTANT CONSTRAINT (NON-NEGOTIABLE):

Subject: {subject_label}

You are STRICTLY FORBIDDEN from generating questions
from any subject other than "{subject_label}".

If a concept does not belong to "{subject_label}",
DO NOT include it under any circumstance.

Examples of forbidden subjects:
- DBMS
- Operating Systems
- Computer Networks
- Physics
- Mathematics
- Any unrelated domain
"""

        user_prompt = f"""
{subject_block}

Domain: {grounded_domain or "General"}

{topics_section}
{forbidden_section}
{avoid_section}

Generate EXACTLY {count} questions for:

Section: {section_name}
Marks per question: {marks}
Bloom level: {bloom_level}
Difficulty: {difficulty}

{part_instruction}

RULES:
1. Questions must be subject-specific and relevant to the syllabus topics ONLY
2. Each question must be unique and distinct
3. Match the marks allocation and difficulty level
4. Use appropriate academic language
5. DO NOT include answers or solutions

Return JSON with this EXACT structure:
{{
    "questions": [
        {{
            "question": "Full question text here",
            "bloom_level": "{bloom_level}",
            "difficulty": "{difficulty}",
            "marks": {marks}
        }}
    ]
}}
"""
        
        try:
            # STEP 5: Generate with timeout handling
            result = await self.llm.generate_json(system_prompt, user_prompt)
            
            if not result or "questions" not in result:
                return {
                    "questions": [],
                    "status": "failed",
                    "count": 0,
                    "cache_hit": False,
                    "error": "Invalid response format"
                }
            
            questions = result["questions"]
            
            # STEP 2: Score and filter questions (don't hard reject)
            scored_questions = []
            for q in questions:
                if "question" not in q:
                    continue
                
                q_text = q["question"]

                # Local guard: drop questions that leak forbidden subjects
                if not subject_guard(q_text):
                    continue
                
                # Check forbidden terms
                has_forbidden = any(
                    term.lower() in q_text.lower() 
                    for term in (forbidden_topics + list(FORBIDDEN_TOPICS))[:20]
                )
                
                if has_forbidden:
                    q["quality_score"] = 20.0
                    q["quality_note"] = "Contains forbidden terms"
                else:
                    # Score based on Bloom compliance
                    bloom_score = self._compute_bloom_score(q_text, bloom_level)
                    q["quality_score"] = bloom_score * 100
                    q["quality_note"] = "Good" if bloom_score >= 0.7 else "Low Bloom compliance"
                
                # Accept all questions (score them, don't reject)
                scored_questions.append(q)
            
            # Cache the result
            cache_result = {
                "questions": scored_questions,
                "status": "success" if len(scored_questions) >= count else "partial",
                "count": len(scored_questions),
                "cache_hit": False
            }
            self._cache[cache_key] = cache_result
            
            return cache_result
            
        except Exception as e:
            # STEP 5: Timeout or error - return graceful failure
            return {
                "questions": [],
                "status": "failed",
                "count": 0,
                "cache_hit": False,
                "error": str(e),
                "fallback_needed": True
            }

    async def generate(
        self,
        outcome_spec: dict,
        marks: int,
        difficulty: str,
        section_name: str | None = None,
        force_question_type: str | None = None,
        question_type: str = "long",
        avoid_questions: list[str] | None = None,
        subject: str | None = None,
        topics: list | None = None,
    ) -> dict:

        # ========================================================================
        # SYSTEM PROMPT: SUBJECT LOCK (ALWAYS FIRST, NON-NEGOTIABLE)
        # ========================================================================
        system_prompt = UNIVERSAL_SYSTEM_PREFIX + """
You are an expert university examiner generating exam questions.

CRITICAL RULES:
- You MUST return ONLY valid JSON
- No markdown, no explanation, no prose
- No leading or trailing text
- If unsure, return {}
"""

        # ========================================================================
        # PART-SPECIFIC PROMPT CONSTRUCTION
        # ========================================================================
        # STEP 3: Different prompts for Part A, Part B, and Part C
        # This prevents LLM from collapsing to definitions
        
        if marks <= 2:
            # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            # PART A: SHORT-ANSWER (2 marks)
            # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            question_style = """
PART A - SHORT-ANSWER QUESTION (2 marks)

Requirements:
- Definition, short answer, or brief concept question
- Bloom level: Remember (basic recall and simple explanation)
- Answer must fit in 2-3 sentences
- CRITICAL: Must NOT reference DBMS, databases, or data structures
- Topic relevance is the priority

Allowed question types:
- Define {concept}
- State the property/condition of {concept}
- Explain {concept} briefly with one example
- List key characteristics of {concept}
- How is {concept} used in [subject]?

Subject-appropriate verbs for Part A:
- Mathematics: Define, State, Prove, Calculate, Identify
- Science: Define, Explain, Identify, List, State
- Engineering: Define, Describe, Identify, State, Calculate
- Any subject: Do NOT use: apply, solve, analyze, design

Keep the scope narrow and focused.
Do NOT include multiple parts (a, b, c...) - single straightforward question.
"""
        
        elif marks <= 5:
            # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            # PART A+: SHORT-FORM WITH EXPLANATION (3-5 marks)
            # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            question_style = """
SHORT-FORM QUESTION (3-5 marks)

Requirements:
- Can ask for explanation or brief worked example
- Bloom level: Understand (classify, explain, summarize)
- Answer should fit in 1-2 paragraphs (300-400 words max)
- May include one simple example or comparison

Allowed question types:
- Explain {concept} with an example
- Compare {concept1} and {concept2}
- Describe the process of {concept}
- Why is {concept} important in [subject]?
- Illustrate {concept} with a simple scenario

Subject-appropriate verbs:
- Mathematics: Explain, Prove, Derive, Compare, Calculate
- Science: Explain, Describe, Compare, Identify, Analyze
- Engineering: Explain, Describe, Design, Compare, Analyze

Do NOT ask only for definitions - must include explanation or reasoning.
Do NOT include database or DBMS terminology.
"""
        
        elif 10 <= marks <= 15:
            # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            # PART B: APPLICATION-BASED ({marks} marks)
            # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            question_style = f"""
PART B - APPLICATION QUESTION ({marks} marks)

CRITICAL: This is Part B. You MUST follow these rules STRICTLY.

Requirements:
- Bloom level: Apply (solve problems, demonstrate, illustrate, practice)
- MANDATORY: Question MUST start with an Apply-level verb
- Allowed starting verbs: apply, solve, demonstrate, illustrate, use, 
  practice, construct, implement, modify, develop, show, calculate
- FORBIDDEN starting verbs: define, explain, what is, state (these are Part A)
- Answer requires: 2-3 pages with step-by-step reasoning
- Realistic scenario or problem-based context

Question structure (must include problem scenario):
"[Scenario/Problem statement with context]:
a) [Analysis or identification task]
b) [Application or solution task]
c) [Justification or verification task]"

Example (Mathematics):
"Apply the Gauss Jordan method to solve the following system of three 
linear equations [equations given]:
a) Identify the augmented matrix
b) Perform row operations to achieve row echelon form (show each step)
c) Back-substitute to find the solution and verify"

Subject-specific guidance:
- Mathematics: Numerical/symbolic problems with step-by-step solutions
- Science: Problem-solving with experimental or observational data
- Engineering: Design decisions, calculations, practical applications
- Humanities: Application of concepts to texts, cases, or scenarios

CRITICAL VALIDATION:
Your question will be REJECTED if it:
1) Starts with "Define", "What is", "Explain briefly", or other Remember verbs
2) Contains DBMS, database, schema, normalization, or SQL terminology
3) Is purely theoretical without practical application
4) Lacks a clear problem or scenario
5) Doesn't require step-by-step reasoning

This is non-negotiable. Part B MUST be application-based.
"""
        
        elif marks >= 15:
            # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            # PART C: ADVANCED ANALYSIS ({marks} marks)
            # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            question_style = f"""
PART C - ADVANCED APPLICATION QUESTION ({marks} marks)

CRITICAL: This is Part C. Advanced analysis and synthesis required.

Requirements:
- Bloom level: Apply or Analyze (compare, distinguish, examine, investigate)
- MANDATORY: Question MUST start with Apply/Analyze-level verb
- Allowed starting verbs: analyze, evaluate, compare, design, justify, 
  synthesize, examine, investigate, assess, distinguish, solve
- FORBIDDEN starting verbs: define, what is, explain briefly
- Answer requires: 4-5 pages with deep reasoning and multiple interconnected subtasks
- Complex scenario requiring multi-step problem-solving

Question structure (must have multiple integrated parts):
"[Complex scenario or real-world problem]:
a) [Initial analysis or identification of components]
b) [Application of multiple concepts or approaches]
c) [Comparative or evaluative analysis]
d) [Synthesis and justification of solution]"

Example (Mathematics - Advanced):
"Analyze the eigenvalues and eigenvectors of the given 3×3 matrix [matrix]. 
Then apply this analysis to:
a) Find the characteristic polynomial and verify eigenvalues
b) Determine eigenvectors for each eigenvalue
c) Analyze the geometric and algebraic multiplicity
d) Discuss applications of this matrix in [specific domain]"

Subject-specific guidance:
- Mathematics: Complex proofs, multi-concept integration, theoretical analysis
- Science: Experimental design, data analysis, hypothesis evaluation
- Engineering: System design, trade-off analysis, optimization
- Humanities: Textual analysis, comparative frameworks, critical evaluation

CRITICAL VALIDATION:
Your question will be REJECTED if it:
1) Starts with "Define" or lower-level verbs (part A/B verbs)
2) Contains DBMS, database, schema, or SQL terminology
3) Is answerable in less than 3 pages
4) Lacks multiple interconnected subtasks
5) Doesn't require synthesis or comparison

This is non-negotiable. Part C demands rigorous analysis.
"""
        
        else:
            question_style = """
Generate a comprehensive analytical exam question.
Require explanation, application, justification, or analysis.
Answer should demonstrate deep subject understanding.
"""

        section = section_name or outcome_spec.get("section_name") or "Section"
        bloom_level = outcome_spec.get("normalized_bloom") or outcome_spec.get("bloom_level") or "Apply"
        
        # FIX 2: BLOOM VERB ENFORCEMENT (NON-NEGOTIABLE)
        allowed_verbs = BLOOM_ALLOWED_VERBS.get(bloom_level, [])
        if allowed_verbs:
            verbs_display = ", ".join(allowed_verbs[:8])  # Show first 8 verbs
            bloom_verb_rule = f"""
🎯 BLOOM VERB ENFORCEMENT (MANDATORY):
Your question MUST start with one of these {bloom_level}-level verbs:
{verbs_display}

Examples:
- "Explain the process..." [VALID]
- "Apply the method to..." [VALID]
- "What is..." (if bloom_level is Remember) [VALID]
- "The process is..." [INVALID - doesn't start with verb]

This is NON-NEGOTIABLE. Questions without proper verbs will be REJECTED.
"""
        else:
            bloom_verb_rule = ""
        
        # Extract subject grounding context (SINGLE SOURCE OF TRUTH)
        grounded_subject = outcome_spec.get("subject") or subject
        grounded_domain = outcome_spec.get("domain")
        
        # STEP 5: Extract clean topics (5-8 max) - no raw syllabus dumps
        grounded_topics = self.extract_clean_topics(
            outcome_spec.get("core_topics") or topics or [],
            max_topics=8
        )
        forbidden_topics = outcome_spec.get("forbidden_topics") or []

        # Build allowed topics section (hard allow-list)
        allowed_topics_section = ""
        if grounded_topics and len(grounded_topics) > 0:
            topics_list = "\n".join([f"- {t}" for t in grounded_topics])
            allowed_topics_section = f"""
Syllabus topics (ONLY allowed concepts):
{topics_list}

You MUST:
- Use ONLY the above topics
- NOT introduce new concepts
- NOT rename topics into other domains

If a question cannot be formed using ONLY these topics,
do not invent a new topic.
"""

        # Build subject context section (CRITICAL for preventing cross-subject contamination)
        subject_label = grounded_subject or "UNSPECIFIED_SUBJECT"

        subject_block = f"""
IMPORTANT CONSTRAINT (NON-NEGOTIABLE):

Subject: {subject_label}

You are STRICTLY FORBIDDEN from generating questions
from any subject other than "{subject_label}".

If a concept does not belong to "{subject_label}",
DO NOT include it under any circumstance.

Examples of forbidden subjects:
- DBMS
- Operating Systems
- Computer Networks
- Physics
- Mathematics
- Any unrelated domain
"""

        subject_context = f"""
{subject_block}

Domain: {grounded_domain or "General"}

{allowed_topics_section}

CRITICAL RULES:
1. Questions MUST ONLY be about the subject "{subject_label}"
2. Questions MUST draw from the allowed topics listed above
3. Use subject-appropriate academic language
4. Do NOT include content from unrelated domains
"""
        
        if forbidden_topics and len(forbidden_topics) > 0:
            forbidden_list = "\n".join([f"- {t}" for t in forbidden_topics])
            subject_context += f"""
🚫 FORBIDDEN TOPICS (NEVER include):
{forbidden_list}

Questions about these topics will be REJECTED.
"""
        
        subject_context += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

        # Build avoid_questions section if provided
        avoid_section = ""
        if avoid_questions and len(avoid_questions) > 0:
            avoid_list = "\n".join([f"- {q}" for q in avoid_questions[-5:]])  # Last 5 to keep prompt manageable
            avoid_section = f"""
AVOID (already used):
{avoid_list}

Generate a DIFFERENT question on a different aspect.
"""

        user_prompt = f"""
{subject_context}

Section: {section}
Marks: {marks}
Bloom Level: {bloom_level}

{bloom_verb_rule}

{avoid_section}

{question_style}

Rules (CRITICAL):
- Generate ONE exam question strictly from the allowed topics
- Use ONLY the normalized topics provided (not raw syllabus)
- The question MUST start with an allowed verb for {bloom_level} level
- Do NOT include UNIT numbers, CO codes, or formatting
- Do NOT assume any specific subject unless explicitly stated
- Questions must be academically correct and exam-appropriate
- Match the marks allocation strictly
- Do NOT include answers or solutions
- Be concise and clear
- Ensure conceptual diversity (don't repeat similar questions)

Return ONLY valid JSON with keys: question, bloom_level, difficulty, marks
Set bloom_level={bloom_level} and difficulty={difficulty}.
"""

        result = await self.llm.generate_json(system_prompt, user_prompt)
        
        # FIX 4: POST-GENERATION VALIDATION (MANDATORY - BLOOM VERB GATE)
        print("VALIDATION STARTED")
        if result and "question" in result:
            question_text = result["question"].lower()

            # VALIDATION 0: Local subject guard (drop obvious cross-subject drift)
            if not subject_guard(question_text):
                result["validation_error"] = "Subject guard rejected: forbidden keywords"
                result["is_valid"] = False
                print("VALIDATION RESULT:", False)
                return result

            # VALIDATION 1: Check forbidden terms (DBMS filter)
            for term in FORBIDDEN_TOPICS:
                if term.lower() in question_text:
                    result["validation_error"] = f"Contains forbidden term: {term}"
                    result["is_valid"] = False
                    print("VALIDATION RESULT:", False)
                    return result

            # VALIDATION 2: Bloom verb enforcement (Apply uses semantic contains + safe prefixes)
            invalid_starters_by_bloom = {
                "Apply": ["what is", "define", "state", "list", "explain briefly"],
                "Analyze": ["what is", "define", "explain briefly"],
                "Evaluate": ["what is", "define"],
            }

            if bloom_level in invalid_starters_by_bloom:
                invalid_starters = invalid_starters_by_bloom[bloom_level]
                for starter in invalid_starters:
                    if question_text.startswith(starter):
                        result["validation_error"] = f"Invalid starter '{starter}' for {bloom_level} level"
                        result["is_valid"] = False
                        print("VALIDATION RESULT:", False)
                        return result

            apply_verbs = [
                "apply", "solve", "demonstrate", "illustrate",
                "analyze", "use", "compute", "determine", "evaluate",
            ]
            safe_prefixes = [
                "using", "given", "consider", "with reference",
                "based on", "for the following",
            ]

            if bloom_level == "Apply":
                has_apply_verb = any(verb in question_text for verb in apply_verbs)
                has_safe_prefix = any(question_text.startswith(prefix) for prefix in safe_prefixes)
                if not (has_apply_verb or has_safe_prefix):
                    result["validation_error"] = (
                        "Apply-level question must include an apply verb or a safe academic lead-in"
                    )
                    result["is_valid"] = False
                    print("VALIDATION RESULT:", False)
                    return result

            if allowed_verbs and bloom_level != "Apply":
                starts_with_allowed_verb = any(
                    question_text.startswith(verb.lower())
                    for verb in allowed_verbs
                )

                if not starts_with_allowed_verb:
                    result["validation_error"] = f"Must start with {bloom_level} verb: {', '.join(allowed_verbs[:5])}"
                    result["is_valid"] = False
                    print("VALIDATION RESULT:", False)
                    return result

            result["is_valid"] = True
            print("VALIDATION RESULT:", True)
        
        return result
