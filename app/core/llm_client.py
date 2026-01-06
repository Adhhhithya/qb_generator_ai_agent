from groq import Groq
from app.core.config import settings


class LLMClient:
    def __init__(self):
        self.client = Groq(api_key=settings.LLM_API_KEY)
        self.model = settings.LLM_MODEL

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3
        )

        return response.choices[0].message.content
