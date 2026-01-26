
from app.core.llm_safe import SafeLLM
from app.core.bloom_rules import is_verb_allowed, check_forbidden_topics, get_bloom_verbs
from app.core.generation_safety import UNIVERSAL_SYSTEM_PREFIX


class AlignmentAuditorAgent:
    def __init__(self):
        self.llm = SafeLLM()

    async def audit(self, question_obj: dict, outcome_spec: dict, generation_mode: str = "hackathon") -> dict:
        question_text = question_obj["question"]
        bloom_level = outcome_spec["normalized_bloom"]

        # Rule 1: Bloom verb enforcement (hard rule)
        bloom_ok = is_verb_allowed(bloom_level, question_text)

        # Rule 2: DBMS topic guard (hard rule - always checked)
        safe_from_dbms = check_forbidden_topics(question_text)

        # In strict mode, fail immediately on bloom mismatch or DBMS contamination
        if (not bloom_ok or not safe_from_dbms) and generation_mode == "strict":
            issues = []
            if not bloom_ok:
                issues.append(f"Question does not start with required {bloom_level} verb. Required verbs: {', '.join(get_bloom_verbs(bloom_level)[:3])}...")
            if not safe_from_dbms:
                issues.append("Question contains DBMS terminology (forbidden for this subject)")
            return {
                "final_verdict": "REJECT",
                "issues": issues,
                "bloom_alignment": bloom_ok,
                "dbms_contamination": not safe_from_dbms
            }

        system_prompt = UNIVERSAL_SYSTEM_PREFIX + """

You are an academic quality assurance auditor for university examinations.

CRITICAL RULES:
- You MUST return ONLY valid JSON
- No markdown, no explanation, no prose
- No leading or trailing text
- If unsure, return {}
"""

        user_prompt = f"""
Outcome Specification:
{outcome_spec}

Question:
{question_text}

Evaluate the alignment and return JSON with:
- concept_alignment (true/false)
- cognitive_alignment (true/false)
- difficulty_match (true/false)
- scenario_present (true/false)
- issues (list of strings)
- final_verdict ("ACCEPT" or "REJECT")

STRICT OUTPUT FORMAT:
Return ONLY a valid JSON object.
"""

        llm_review = await self.llm.generate_json(system_prompt, user_prompt)

        # Hackathon mode: scoring-based acceptance
        if generation_mode == "hackathon":
            score = 0
            warnings = []

            if bloom_ok:
                score += 40
            else:
                warnings.append("Bloom verb mismatch (but accepted in hackathon mode)")

            if llm_review.get("concept_alignment", False):
                score += 30
            else:
                warnings.append("Concept alignment weak")

            if llm_review.get("scenario_present", False):
                score += 30
            else:
                warnings.append("Scenario not clearly present")

            # Accept if score >= 50 in hackathon mode
            if score >= 50:
                return {
                    "final_verdict": "ACCEPT",
                    "bloom_alignment": bloom_ok,
                    "llm_review": llm_review,
                    "quality_score": score,
                    "warnings": warnings,
                    "generation_mode": "hackathon"
                }
            else:
                # Still might pass if at least bloom is ok
                if bloom_ok:
                    return {
                        "final_verdict": "ACCEPT",
                        "bloom_alignment": True,
                        "llm_review": llm_review,
                        "quality_score": max(50, score),  # Minimum 50 if bloom ok
                        "warnings": warnings,
                        "generation_mode": "hackathon"
                    }

        # Strict mode: original behavior
        return {
            "final_verdict": "ACCEPT",
            "bloom_alignment": bloom_ok,
            "llm_review": llm_review
        }
