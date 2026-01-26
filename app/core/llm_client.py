import json
import os
import time
from app.core.config import settings


class LLMClient:
    def __init__(self):
        self.mock_mode = os.getenv("LLM_MOCK", "false").lower() in ("1", "true", "yes")
        # If no API key is provided, fall back to mock mode for local testing
        if not settings.LLM_API_KEY:
            self.mock_mode = True

        if not self.mock_mode:
            try:
                from groq import Groq
            except ImportError as exc:
                raise ImportError(
                    "groq package is required for real LLM calls. Install via pip or enable LLM_MOCK=1 for offline tests."
                ) from exc

            self.client = Groq(api_key=settings.LLM_API_KEY)
            self.model = settings.LLM_MODEL

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        if self.mock_mode:
            # Deterministic mock payload for offline tests and CI
            mock_question = {
                "question": "Mock question based on provided syllabus and constraints.",
                "code": "MOCK-001",
                "bloom_level": "Apply",
                "difficulty": "Medium",
                "marks": 10,
                "rationale": "This is a mock response used when LLM access is disabled.",
            }
            return json.dumps(mock_question)

        print("LLM CALL STARTED")
        start = time.time()
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3
        )
        
        end = time.time()
        result = response.choices[0].message.content
        print("LLM CALL FINISHED in", round(end - start, 2), "seconds")
        print("RAW RESPONSE:", result[:500])

        return result
