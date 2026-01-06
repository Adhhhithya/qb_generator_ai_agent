
from app.core.llm_safe import SafeLLM
from app.core.bloom_rules import is_verb_allowed


class QuestionGeneratorAgent:
    def __init__(self):
        self.llm = SafeLLM()

    async def generate(
        self,
        outcome_spec: dict,
        marks: int,
        difficulty: str,
        question_type: str = "long"
    ) -> dict:

        system_prompt = (
            "You are an expert university question paper setter.\n"
            "CRITICAL RULES:\n"
            "- You MUST return ONLY valid JSON\n"
            "- No markdown, no explanation, no prose\n"
            "- No leading or trailing text\n"
            "- If unsure, return {}\n"
        )

        user_prompt = f"""
Outcome Specification:
{outcome_spec}

Constraints:
- Marks: {marks}
- Difficulty: {difficulty}
- Question type: {question_type}

Rules:
- Use Bloom verb matching: {outcome_spec['normalized_bloom']}
- DO NOT use forbidden concepts
- Frame question clearly for written examination
- Return JSON with keys: question, bloom_level, difficulty, marks

STRICT OUTPUT FORMAT:
Return ONLY a valid JSON object.
"""

        return await self.llm.generate_json(system_prompt, user_prompt)
