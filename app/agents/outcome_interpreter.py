
from app.models.outcome import CourseOutcome
from app.core.llm_safe import SafeLLM
from app.core.generation_safety import UNIVERSAL_SYSTEM_PREFIX


class OutcomeInterpreterAgent:
    def __init__(self):
        self.llm = SafeLLM()

    async def interpret(self, outcome: CourseOutcome) -> dict:
        system_prompt = UNIVERSAL_SYSTEM_PREFIX + """
You are an academic curriculum expert.
CRITICAL RULES:
- You MUST return ONLY valid JSON
- No markdown, no explanation, no prose
- No leading or trailing text
- If unsure, return {}
"""

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
