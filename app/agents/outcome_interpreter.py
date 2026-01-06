
from app.models.outcome import CourseOutcome
from app.core.llm_safe import SafeLLM


class OutcomeInterpreterAgent:
    def __init__(self):
        self.llm = SafeLLM()

    async def interpret(self, outcome: CourseOutcome) -> dict:
        system_prompt = (
            "You are an academic curriculum expert.\n"
            "CRITICAL RULES:\n"
            "- You MUST return ONLY valid JSON\n"
            "- No markdown, no explanation, no prose\n"
            "- No leading or trailing text\n"
            "- If unsure, return {}\n"
        )

        user_prompt = f"""
Course Outcome:
Code: {outcome.code}
Topic: {outcome.topic}
Bloom Level: {outcome.bloom_level}
Keywords: {", ".join(outcome.keywords)}

Return a JSON object with:
- normalized_bloom (single Bloom level)
- refined_topic
- allowed_concepts (list)
- forbidden_concepts (list)
- cognitive_intent (1 sentence)

STRICT OUTPUT FORMAT:
Return ONLY a valid JSON object.
"""

        return await self.llm.generate_json(system_prompt, user_prompt)
