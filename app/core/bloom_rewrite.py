from app.core.llm_safe import SafeLLM

class BloomRewriteAgent:
    def __init__(self):
        self.llm = SafeLLM()

    async def rewrite(self, question_text: str, bloom_level: str) -> dict:
        system_prompt = (
            "You are an academic question refinement assistant.\\n"
            "CRITICAL RULES:\\n"
            "- You MUST return ONLY valid JSON\\n"
            "- No markdown, no explanation, no prose\\n"
            "- No leading or trailing text\\n"
            "- If unsure, return {}\\n"
        )

        user_prompt = f"""
Original Question:
{question_text}

Required Bloom Level: {bloom_level}

Instructions:
- Rewrite the question so that ALL leading verbs strictly match the Bloom level
- Use verbs appropriate for '{bloom_level}'
- Preserve difficulty, marks, and concepts
- Do NOT add or remove syllabus content
- Return JSON with keys: question, bloom_level

STRICT OUTPUT FORMAT:
Return ONLY a valid JSON object.
"""

        return await self.llm.generate_json(system_prompt, user_prompt)
