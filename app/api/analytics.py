from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.db.models import Question

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def analytics_summary(db: Session = Depends(get_db)):
    total_questions = db.query(Question).count()

    bloom_dist = (
        db.query(Question.bloom_level, func.count())
        .group_by(Question.bloom_level)
        .all()
    )

    difficulty_dist = (
        db.query(Question.difficulty, func.count())
        .group_by(Question.difficulty)
        .all()
    )

    return {
        "total_questions": total_questions,
        "bloom_distribution": {
            bloom: count for bloom, count in bloom_dist
        },
        "difficulty_distribution": {
            diff: count for diff, count in difficulty_dist
        }
    }
