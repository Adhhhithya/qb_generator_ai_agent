
from fastapi import APIRouter, HTTPException
from app.api.schemas import GenerateQuestionRequest, GenerateQuestionResponse
from app.models.outcome import CourseOutcome
from app.core.pipeline import QuestionPipeline
from app.core.duplicate_checker import similarity
from app.core.quality_scorer import score_question
from app.core.difficulty_calibrator import expected_difficulty
# from google.genai.errors import ClientError  # Unused import causing module error
from app.db.session import SessionLocal
from app.db.models import CourseOutcome, Question, AuditLogDB

router = APIRouter(prefix="/generate", tags=["Question Generation"])

pipeline = QuestionPipeline()


@router.post("", response_model=None)
async def generate_question(req: GenerateQuestionRequest):
    pipeline = QuestionPipeline()
    llm_response = ""
    
    try:
        # Handle list of bloom levels (e.g. from multi-select)
        bloom_val = req.bloom_level
        if isinstance(bloom_val, list):
            bloom_val = ", ".join(bloom_val)

        co = CourseOutcome(
            code=req.code,
            topic=req.topic,
            bloom_level=bloom_val,
            keywords=req.keywords
        )

        llm_response, question = await pipeline.run(
            course_outcome=co,
            marks=req.marks,
            difficulty=req.difficulty
        )

        # -- LOGIC FOR DUPLICATES, PERSISTENCE, ETC --
        db = SessionLocal()
        
        # Check for duplicates before persisting
        DUPLICATE_THRESHOLD = 0.85
        
        existing_questions = (
            db.query(Question)
            .filter(
                Question.bloom_level == question.bloom_level,
                Question.difficulty == question.difficulty
            )
            .all()
        )

        for existing in existing_questions:
            sim = similarity(existing.question_text, question.question)
            if sim >= DUPLICATE_THRESHOLD:
                db.close()
                return {
                    "status": "REJECTED",
                    "reason": "Duplicate question detected",
                    "similarity": round(sim, 2)
                }

        outcome = CourseOutcome(
            code=req.code,
            topic=req.topic,
            bloom_level=req.bloom_level,
            keywords=req.keywords
        )
        db.add(outcome)

        db.commit()
        db.refresh(outcome)

        # Calculate quality score
        quality = score_question(
            question.question,
            question.bloom_level
        )

        # Append code if present
        q_text = question.question
        if question.code:
            q_text += f"\n\nCode:\n{question.code}"

        db_question = Question(
            outcome_id=outcome.id,
            question_text=q_text,
            bloom_level=question.bloom_level,
            difficulty=question.difficulty,
            marks=question.marks,
            quality_score=quality
        )

        # Drift detection
        expected = expected_difficulty(
            db_question.bloom_level,
            db_question.marks,
            db_question.quality_score,
        )
        if expected != db_question.difficulty:
            drift = {
                "declared": db_question.difficulty,
                "expected": expected,
            }
        else:
            drift = None

        db_question.difficulty_drift = drift

        db.add(db_question)

        db.commit()
        db.refresh(db_question)

        # Audit Log
        audit_payload = {
            "rationale": question.rationale or "Generated successfully.", 
            "final_verdict": "Pass",
            "difficulty_drift": drift
        }

        audit = AuditLogDB(
            question_id=db_question.id,
            verdict="Pass",
            audit_payload=audit_payload
        )
        db.add(audit)

        db.commit()
        db.close()

        # Success Return
        return {
            "status": "success",
            "question": question.dict(),
            "audit": audit_payload # Keeping for frontend compat if needed
        }

    except Exception as e:
        print("🔥 GENERATE PIPELINE ERROR:", repr(e))
        
        raw_resp = ""
        if hasattr(e, 'raw_response'):
            raw_resp = e.raw_response
        elif not raw_resp: 
            # If exception happened before pipeline returned, we might default to empty
            # If we tracked it locally we could use it, but pipeline handles LLM call
            raw_resp = getattr(e, "raw_response", str(e))

        return {
            "status": "error",
            "message": "LLM output could not be processed",
            "raw_response": raw_resp[:500],
            "error": str(e)
        }


