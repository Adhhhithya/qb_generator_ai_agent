import time
from app.core.llm_client import LLMClient
from app.core.json_utils import safe_llm_json_parse
from app.api.schemas import QuestionSchema

class PipelineError(Exception):
    def __init__(self, message, raw_response, original_error=None):
        super().__init__(message)
        self.raw_response = raw_response
        self.original_error = original_error

# Response cache (subject, bloom, difficulty, paper_id) -> response
CACHE = {}


class QuestionPipeline:
    def __init__(self, max_retries: int = 2):
        self.llm = LLMClient()
        self.max_retries = max_retries

    async def _generate_and_parse(self, system_prompt: str, user_prompt: str):
        """Run the LLM with basic self-healing retries for JSON formatting."""

        prompt = user_prompt
        last_error = None
        last_raw_response = ""

        for attempt in range(self.max_retries + 1):
            try:
                raw_response = await self.llm.generate(system_prompt, prompt)
                parsed = safe_llm_json_parse(raw_response)
                return raw_response, parsed, attempt + 1
            except Exception as exc:
                last_error = exc
                last_raw_response = locals().get("raw_response", "")
                prompt += (
                    "\n\nERROR: Your previous response was invalid JSON. "
                    "Respond with ONLY valid JSON that matches the schema. If unsure, return {}."
                )

        # If we reach here, parsing failed after retries
        raise PipelineError("Parsing or validation failed", last_raw_response, last_error)

    async def run(
        self, 
        course_outcome, 
        marks: int, 
        difficulty: str, 
        # Optional params kept for compatibility formatted...
        section_name: str | None = None, 
        force_question_type: str | None = None, 
        avoid_questions: list[str] | None = None,
        subject: str | None = None,
        domain: str | None = None,
        core_topics: list[str] | None = None,
        forbidden_topics: list[str] | None = None,
        paper_id: int | None = None,
    ):
        start_time = time.time()
        
        # System Prompt - ULTRA CONCISE
        system_prompt = "Return ONLY valid JSON. No markdown. Escape \\n as \\\\n."

        # User Prompt - CONCISE (crucial for speed - ~30 tokens instead of 100+)
        user_prompt = (
            f"Generate a {difficulty} exam question ({marks} marks).\\n"
            f"Topic: {course_outcome.topic}\\n"
            f"Bloom: {course_outcome.bloom_level}\\n"
            f"Return JSON: {{\"question\": str, \"bloom_level\": str, \"difficulty\": str, \"marks\": int}}"
        )

        try:
            raw_response, parsed, attempts_used = await self._generate_and_parse(
                system_prompt, user_prompt
            )
        except PipelineError as err:
            return {
                "status": "REJECTED",
                "reason": "invalid_json",
                "error": str(err.original_error or err),
                "raw_response": err.raw_response,
                "attempts": self.max_retries + 1,
            }

        try:
            question = QuestionSchema(**parsed)
        except Exception as exc:
            return {
                "status": "REJECTED",
                "reason": "schema_validation_failed",
                "error": str(exc),
                "raw_response": raw_response,
                "attempts": attempts_used,
            }

        return {
            "status": "ACCEPTED",
            "question": question.dict(),
            "raw_response": raw_response,
            "attempts": attempts_used,
        }
