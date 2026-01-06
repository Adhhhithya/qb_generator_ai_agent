from app.core.llm_client import LLMClient
from app.core.json_utils import safe_json_parse

class SafeLLM:
    def __init__(self, max_retries=2):
        self.llm = LLMClient()
        self.max_retries = max_retries

    async def generate_json(self, system_prompt, user_prompt):
        last_error = None

        for attempt in range(self.max_retries + 1):
            response = await self.llm.generate(system_prompt, user_prompt)

            try:
                return safe_json_parse(response)
            except Exception as e:
                last_error = e
                user_prompt += (
                    "\n\nERROR: Your previous response was invalid JSON.\n"
                    "You MUST return ONLY valid JSON.\n"
                    "Return {} if unsure."
                )

        raise ValueError(f"LLM failed to return valid JSON after retries: {last_error}")
