"""
Subject and topic extraction from syllabus.
Ensures questions stay within the correct domain.

THIS IS THE SINGLE SOURCE OF TRUTH FOR SUBJECT GROUNDING.
"""

from app.core.llm_safe import SafeLLM
from app.core.generation_safety import UNIVERSAL_SYSTEM_PREFIX


class SubjectAnalyzer:
    def __init__(self):
        self.llm = SafeLLM()

    async def ground_subject(self, title: str, syllabus: str) -> dict:
        """
        ONE-TIME SUBJECT GROUNDING (MANDATORY)
        
        This is the single source of truth for "what subject this is about".
        Must be called ONCE per paper before any question generation.
        
        Args:
            title: Course/paper title (e.g., "DBMS Final Exam", "Discrete Math Quiz")
            syllabus: Raw syllabus text (messy, whatever the lecturer pastes)
        
        Returns:
            {
              "subject": "Discrete Mathematics and Graph Theory",
              "domain": "Computer Science",
              "core_topics": [
                "Propositional Logic",
                "Graph Theory",
                "Euler Paths",
                "Hamiltonian Circuits",
                "Trees",
                "Spanning Trees"
              ],
              "forbidden_topics": [
                "Database Systems",
                "Normalization",
                "DBMS"
              ]
            }
        """
        
        system_prompt = UNIVERSAL_SYSTEM_PREFIX + """
You are an expert academic curriculum analyzer.
Your task is to establish the SINGLE SOURCE OF TRUTH for a university course.

CRITICAL RULES:
- You MUST return ONLY valid JSON
- No markdown, no code blocks, no explanation
- No leading or trailing text
- If uncertain, make your best academic judgment
"""

        user_prompt = f"""
You are given a university course title and syllabus.

Title: {title}
Syllabus:
{syllabus}

Your task:
1. Identify the PRIMARY ACADEMIC SUBJECT (e.g., "Database Management Systems", "Discrete Mathematics and Graph Theory", "Data Structures")
2. Identify the ACADEMIC DOMAIN (e.g., "Computer Science", "Mathematics", "Electronics", "Biology")
3. Extract 6–10 CORE TOPICS covered in this specific course
4. Identify any FORBIDDEN/UNRELATED DOMAINS that should NEVER appear in questions (e.g., if this is Discrete Math, forbidden domains might be: "Database Systems", "DBMS", "Normalization")

Ignore:
- Unit numbers, course outcome codes, marks, formatting noise
- Generic administrative text

Return STRICT JSON with keys: subject, domain, core_topics, forbidden_topics

Example 1 (Discrete Math):
{{
  "subject": "Discrete Mathematics and Graph Theory",
  "domain": "Computer Science - Mathematics",
  "core_topics": [
    "Propositional Logic",
    "Graph Theory",
    "Euler Paths and Circuits",
    "Hamiltonian Paths and Circuits",
    "Trees",
    "Spanning Trees",
    "Minimum Spanning Trees"
  ],
  "forbidden_topics": [
    "Database Systems",
    "DBMS",
    "Normalization",
    "SQL",
    "Relational Algebra",
    "Functional Dependencies"
  ]
}}

Example 2 (DBMS):
{{
  "subject": "Database Management Systems",
  "domain": "Computer Science",
  "core_topics": [
    "Relational Model",
    "Normalization",
    "Functional Dependencies",
    "SQL",
    "Transaction Management",
    "Indexing"
  ],
  "forbidden_topics": [
    "Graph Theory",
    "Discrete Mathematics",
    "Euler Paths",
    "Trees"
  ]
}}

Now analyze the given course.
"""

        try:
            result = await self.llm.generate_json(system_prompt, user_prompt)
        except Exception:
            # Fall back to safe defaults when JSON parsing fails so the pipeline can continue.
            result = {
                "subject": title or "General",
                "domain": "General",
                "core_topics": [],
                "forbidden_topics": []
            }
        
        # Ensure result has the expected structure with safe defaults
        if not result or "subject" not in result:
            result = {
                "subject": title or "General",
                "domain": "General",
                "core_topics": [],
                "forbidden_topics": []
            }
        
        # Fill missing fields
        if "domain" not in result:
            result["domain"] = "General"
        if "core_topics" not in result:
            result["core_topics"] = []
        if "forbidden_topics" not in result:
            result["forbidden_topics"] = []
        
        return result

    async def extract_subject_and_topics(self, syllabus: str) -> dict:
        """
        DEPRECATED: Use ground_subject() instead for new implementations.
        
        Kept for backward compatibility with existing code.
        This method only extracts subject and topics, not the full grounding.
        """
        
        # For backward compatibility, call ground_subject with minimal context
        grounding = await self.ground_subject(
            title="General Course",
            syllabus=syllabus
        )
        
        return {
            "subject": grounding["subject"],
            "topics": grounding["core_topics"]
        }

    async def normalize_syllabus_to_topics(self, syllabus: str) -> list[str]:
        """
        SYLLABUS NORMALIZATION (PREPROCESSING)
        
        Convert raw, messy syllabus text into clean, normalized topic list.
        This preprocesses the syllabus BEFORE question generation.
        
        Input: Raw syllabus with units, codes, marks, formatting noise
        Output: Clean list of 10-25 topic names (no formatting, no units)
        
        Example:
        Input:  "UNIT I MATRICES 12 Eigenvalues and Eigenvectors of a real matrix – 
                Cayley-Hamilton Theorem – Diagonalization"
        Output: ["Eigenvalues and Eigenvectors", "Cayley-Hamilton Theorem", 
                 "Diagonalization of Matrices"]
        
        This is called ONCE per paper and result is stored in core_topics.
        Question generation then uses these normalized topics (not raw syllabus).
        """
        
        system_prompt = UNIVERSAL_SYSTEM_PREFIX + """
You are a backend data-normalization service.

You MUST return valid JSON.
You MUST return a JSON OBJECT, not a list.
You MUST follow the schema exactly.
Do not include explanations, markdown, or extra text.
Do not include trailing commas.
Output must be parsable by json.loads().
"""

        user_prompt = f"""
Given the following syllabus content, extract and normalize the core academic topics.

Rules:
- Merge semantically similar topics
- Remove duplicates
- Use standard textbook terminology
- Do NOT include examples or descriptions
- Do NOT include unrelated topics
- Do NOT include mathematics topics unless explicitly present
- Return ONLY the JSON object below

Required JSON schema:
{{
  "topics": [
    "string"
  ]
}}

Syllabus content:
<<<{syllabus}>>>

✅ EXPECTED OUTPUT (EXAMPLE)
{{
  "topics": [
    "Normalization",
    "Functional Dependency",
    "First Normal Form",
    "Second Normal Form",
    "Third Normal Form",
    "Transitive Dependency",
    "Partial Dependency",
    "Decomposition",
    "Anomalies"
  ]
}}
"""

        try:
            # FIX 1: Use isolated config
            from app.core.pipeline_config import TOPIC_EXTRACTION_CONFIG
            
            # FIX 4: Add fail-fast check for task drift
            def no_questions(parsed):
                if isinstance(parsed, dict) and "question" in parsed:
                    return False # Drifted into question generation
                return True

            TOPIC_EXTRACTION_CONFIG.fail_fast_checks = [no_questions]

            # FIX 5: Use configured LLM call
            result = await self.llm.generate_json(
                system_prompt, 
                user_prompt,
                config=TOPIC_EXTRACTION_CONFIG
            )
            
            # Note: The result is already safely wrapped/parsed by SafeLLM + PipelineConfig
            
        except Exception:
            # Fall back to empty list when JSON parsing fails
            return []
        
        # Handle different response formats
        if isinstance(result, dict):
            if "topics" in result:
                topics = result["topics"]
            elif "normalized_topics" in result:
                topics = result["normalized_topics"]
            else:
                topics = []
        else:
            topics = []
        
        # Ensure all items are strings and non-empty
        topics = [str(t).strip() for t in topics if t and str(t).strip()]
        
        # Remove duplicates while preserving order
        seen = set()
        unique_topics = []
        for topic in topics:
            topic_lower = topic.lower()
            if topic_lower not in seen:
                seen.add(topic_lower)
                unique_topics.append(topic)
        
        return unique_topics or []
