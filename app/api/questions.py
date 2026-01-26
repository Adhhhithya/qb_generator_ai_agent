from fastapi import APIRouter, Query
from typing import Optional
from app.db.session import SessionLocal
from app.db.models import CourseOutcome, Question
from app.api.schemas import QuestionListResponse, QuestionOut

router = APIRouter(prefix="/questions", tags=["Question Bank"])


@router.get("", response_model=QuestionListResponse)
def get_questions(
    code: Optional[str] = Query(None),
    bloom_level: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50)
):
    db = SessionLocal()

    query = (
        db.query(Question, CourseOutcome)
        .join(CourseOutcome, Question.outcome_id == CourseOutcome.id)
    )

    if code:
        query = query.filter(CourseOutcome.code == code)

    if bloom_level:
        query = query.filter(Question.bloom_level == bloom_level)

    if difficulty:
        query = query.filter(Question.difficulty == difficulty)

    results = query.limit(limit).all()
    db.close()

    questions = [
        QuestionOut(
            id=q.id,
            code=o.code,
            question=q.question_text,
            bloom_level=q.bloom_level,
            difficulty=q.difficulty,
            marks=q.marks
        )
        for q, o in results
    ]

    return {
        "count": len(questions),
        "questions": questions
    }
