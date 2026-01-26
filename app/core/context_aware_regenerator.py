"""
Context-aware question regeneration with subject guards.
FIX 1-3: Regenerate questions while preserving subject, syllabus, and part context.
"""

import logging
from typing import Optional
from app.agents.question_generator import QuestionGeneratorAgent

logger = logging.getLogger(__name__)


# FIX 3: Subject-specific forbidden keywords (HARD BLOCK)
SUBJECT_FORBIDDEN = {
    "python": ["dbms", "sql", "normalization", "relativity", "economics", "supply and demand"],
    "iot": ["dbms", "supply and demand", "general management", "operating system", "quantum"],
    "physics": ["dbms", "python", "sql", "supply and demand"],
    "mathematics": ["dbms", "sql", "operating system"],
    "database": ["python basics", "iot applications", "quantum physics"],
    "operating systems": ["dbms", "sql", "supply and demand"],
    "networks": ["dbms", "python basics", "economics"],
}


def subject_guard(text: str, subject: Optional[str]) -> bool:
    """
    FIX 3: Local subject guard - fail fast on obvious cross-subject drift.
    
    Returns False if question text contains forbidden keywords for the subject.
    """
    if not subject:
        return True
    
    subject_lower = subject.lower()
    forbidden_list = SUBJECT_FORBIDDEN.get(subject_lower, [])
    
    if not forbidden_list:
        return True
    
    text_lower = text.lower()
    has_forbidden = any(keyword in text_lower for keyword in forbidden_list)
    
    return not has_forbidden


class ContextAwareRegenerator:
    """
    FIX 1-2: Regenerate questions with preserved subject/syllabus/part context.
    
    Key differences from generic generation:
    - Reuses original subject, domain, core_topics, forbidden_topics
    - Uses specific "replacement" prompt template (FIX 2)
    - Hard blocks generic fallbacks (FIX 3)
    - Applies local subject guard before returning (FIX 3)
    """
    
    def __init__(self):
        self.agent = QuestionGeneratorAgent()
    
    def create_replacement_prompt(
        self,
        subject: str,
        domain: Optional[str],
        core_topics: list[str],
        part: str,
        bloom_level: str,
        difficulty: str,
        marks: int,
        original_question: str,
    ) -> tuple[str, str]:
        """
        FIX 2: Create replacement prompt with subject block + whitelist.
        
        Returns (system_prompt, user_prompt)
        """
        
        # Build topics whitelist
        topics_list = "\n".join([f"- {t}" for t in core_topics]) if core_topics else "No specific topics"
        
        # Build subject block (non-negotiable)
        subject_block = f"""
IMPORTANT CONSTRAINT (NON-NEGOTIABLE):

Subject: {subject}

You are STRICTLY FORBIDDEN from generating questions
from any subject other than "{subject}".

If a concept does not belong to "{subject}",
DO NOT include it under any circumstance.

Examples of forbidden subjects:
- DBMS
- Operating Systems
- Computer Networks
- Physics
- Mathematics
- Any unrelated domain
"""
        
        # System prompt
        system_prompt = """You are an expert university examiner.

CRITICAL:
- You MUST return ONLY valid JSON
- No markdown, no explanation, no prose
- If unsure, return {}
"""
        
        # User prompt (replacement-specific)
        user_prompt = f"""
You are replacing an exam question.

{subject_block}

Domain: {domain or "General"}

Syllabus topics (ONLY allowed concepts):
{topics_list}

You MUST:
- Use ONLY the above topics
- NOT introduce new concepts
- NOT rename topics into other domains

If a question cannot be formed using ONLY these topics,
do not invent a new topic.

Target:
- Part: {part}
- Bloom level: {bloom_level}
- Difficulty: {difficulty}
- Marks: {marks}

Original question (DO NOT repeat this):
"{original_question}"

Task:
Generate ONE alternative question that:
- Is from the SAME subject ("{subject}")
- Uses ONLY the syllabus topics listed
- Does NOT involve any other domain
- Is different in wording and approach from the original question
- Maintains the same academic rigor and complexity

Output JSON ONLY (no markdown, no explanation):
{{
  "question": "Full question text here"
}}
"""
        
        return system_prompt, user_prompt
    
    async def regenerate_with_context(
        self,
        original_question: str,
        subject: str,
        domain: Optional[str],
        core_topics: list[str],
        forbidden_topics: list[str],
        section_name: str,
        bloom_level: str,
        difficulty: str,
        marks: int,
    ) -> dict:
        """
        FIX 1: Regenerate question while preserving original context.
        
        Returns:
        {
            "success": bool,
            "question": str (if success),
            "error": str (if failed)
        }
        """
        logger.info(f"Regenerating question for {subject} | Part {section_name}")
        
        # Create replacement prompt (FIX 2)
        system_prompt, user_prompt = self.create_replacement_prompt(
            subject=subject,
            domain=domain,
            core_topics=core_topics,
            part=section_name,
            bloom_level=bloom_level,
            difficulty=difficulty,
            marks=marks,
            original_question=original_question,
        )
        
        try:
            # Generate using LLM
            result = await self.agent.llm.generate_json(system_prompt, user_prompt)
            
            if not result or "question" not in result:
                logger.warning("LLM returned invalid JSON for regeneration")
                return {
                    "success": False,
                    "error": "No valid alternative found for this syllabus"
                }
            
            new_question = result["question"]
            
            # FIX 3: Apply local subject guard BEFORE returning
            if not subject_guard(new_question, subject):
                logger.warning(f"Subject guard rejected: {subject}")
                return {
                    "success": False,
                    "error": "No valid alternative found for this syllabus"
                }
            
            # Check for forbidden topics
            for topic in forbidden_topics:
                if topic.lower() in new_question.lower():
                    logger.warning(f"Contains forbidden topic: {topic}")
                    return {
                        "success": False,
                        "error": "No valid alternative found for this syllabus"
                    }
            
            logger.info(f"Successfully regenerated question for {subject}")
            
            return {
                "success": True,
                "question": new_question,
            }
            
        except Exception as e:
            logger.error(f"Error during regeneration: {str(e)}")
            return {
                "success": False,
                "error": "No valid alternative found for this syllabus"
            }
