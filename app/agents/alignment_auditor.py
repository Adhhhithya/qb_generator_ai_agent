
from app.core.llm_safe import SafeLLM
from app.core.bloom_rules import is_verb_allowed


class AlignmentAuditorAgent:
    def __init__(self):
        self.llm = SafeLLM()

    async def audit(self, question_obj: dict, outcome_spec: dict) -> dict:
        question_text = question_obj["question"]
        bloom_level = outcome_spec["normalized_bloom"]

        # Rule 1: Bloom verb enforcement (hard rule)
        bloom_ok = is_verb_allowed(bloom_level, question_text)

        # If Bloom rule fails → DO NOT call LLM
        if not bloom_ok:
            return {
                "final_verdict": "REJECT",
                "issues": ["Bloom verb does not match required cognitive level"],
                "bloom_alignment": False
            }

        system_prompt = (
            "You are an academic quality assurance auditor for university examinations.\n"
            "CRITICAL RULES:\n"
            "- You MUST return ONLY valid JSON\n"
            "- No markdown, no explanation, no prose\n"
            "- No leading or trailing text\n"
            "- If unsure, return {}\n"
        )

        user_prompt = f"""
Outcome Specification:
{outcome_spec}

Question:
{question_text}

Evaluate the alignment and return JSON with:
- concept_alignment (true/false)
- cognitive_alignment (true/false)
- difficulty_match (true/false)
- issues (list of strings)
- final_verdict ("ACCEPT" or "REJECT")

STRICT OUTPUT FORMAT:
Return ONLY a valid JSON object.
"""

        llm_review = await self.llm.generate_json(system_prompt, user_prompt)

        return {
            "final_verdict": "ACCEPT",
            "bloom_alignment": True,
            "llm_review": llm_review
        }
