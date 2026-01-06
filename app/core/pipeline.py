from app.agents.outcome_interpreter import OutcomeInterpreterAgent
from app.agents.question_generator import QuestionGeneratorAgent
from app.agents.alignment_auditor import AlignmentAuditorAgent
from app.core.bloom_rewrite import BloomRewriteAgent


class QuestionPipeline:
    def __init__(self, max_retries: int = 2):
        self.interpreter = OutcomeInterpreterAgent()
        self.generator = QuestionGeneratorAgent()
        self.auditor = AlignmentAuditorAgent()
        self.rewriter = BloomRewriteAgent()
        self.max_retries = max_retries

    async def run(self, course_outcome, marks, difficulty):
        # Agents now return dicts directly (via SafeLLM.generate_json)
        outcome_spec = await self.interpreter.interpret(course_outcome)

        question_obj = await self.generator.generate(
            outcome_spec=outcome_spec,
            marks=marks,
            difficulty=difficulty
        )

        for attempt in range(self.max_retries + 1):
            audit = await self.auditor.audit(question_obj, outcome_spec)

            if audit["final_verdict"] == "ACCEPT":
                return {
                    "status": "ACCEPTED",
                    "attempts": attempt + 1,
                    "question": question_obj,
                    "audit": audit
                }

            # Only auto-fix Bloom mismatch
            if not audit.get("bloom_alignment", True):
                rewritten_question = await self.rewriter.rewrite(
                    question_text=question_obj["question"],
                    bloom_level=outcome_spec["normalized_bloom"]
                )

                question_obj["question"] = rewritten_question
            else:
                break

        return {
            "status": "REJECTED",
            "attempts": self.max_retries + 1,
            "question": question_obj,
            "audit": audit
        }
