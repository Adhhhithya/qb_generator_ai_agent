
from fastapi import APIRouter, HTTPException
from app.api.schemas import GenerateQuestionRequest, GenerateQuestionResponse
from app.models.outcome import CourseOutcome
from app.core.pipeline import QuestionPipeline
from google.genai.errors import ClientError
from app.db.session import SessionLocal
from app.db.models import CourseOutcomeDB, QuestionDB, AuditLogDB

router = APIRouter(prefix="/generate", tags=["Question Generation"])

pipeline = QuestionPipeline()


@router.post("", response_model=GenerateQuestionResponse)
async def generate_question(req: GenerateQuestionRequest):
    try:
        co = CourseOutcome(
            code=req.code,
            topic=req.topic,
            bloom_level=req.bloom_level,
            keywords=req.keywords
        )

        result = await pipeline.run(
            course_outcome=co,
            marks=req.marks,
            difficulty=req.difficulty
        )
        db = SessionLocal()

        if result["status"] == "ACCEPTED":
            outcome = CourseOutcomeDB(
                code=req.code,
                topic=req.topic,
                bloom_level=req.bloom_level,
                keywords=req.keywords
            )
            db.add(outcome)

            db.commit()
            db.refresh(outcome)

            question = QuestionDB(
                outcome_id=outcome.id,
                question_text=result["question"]["question"],
                bloom_level=result["question"]["bloom_level"],
                difficulty=result["question"]["difficulty"],
                marks=result["question"]["marks"]
            )
            db.add(question)

            db.commit()
            db.refresh(question)

            audit = AuditLogDB(
                question_id=question.id,
                verdict=result["audit"]["final_verdict"],
                audit_payload=result["audit"]
            )
            db.add(audit)

            db.commit()

        db.close()

        return result

    except ClientError as e:
        if "RESOURCE_EXHAUSTED" in str(e):
            raise HTTPException(
                status_code=429,
                detail="LLM quota exceeded. Please retry after some time."
            )

        raise HTTPException(status_code=500, detail=str(e))

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail="LLM failed to generate valid structured output. Please retry."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
