from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.db.session import get_db
from app.db.models import QuestionPaper, Question, PaperQuestion, PaperSection

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get overall dashboard statistics"""
    
    # Total papers
    total_papers = db.query(QuestionPaper).count()
    
    # Finalized papers
    finalized_papers = db.query(QuestionPaper).filter(
        QuestionPaper.status == "FINALIZED"
    ).count()
    
    # Average quality score across all questions
    avg_quality = db.query(func.avg(Question.quality_score)).scalar() or 0
    
    # Count rejected attempts (questions with quality_score < 60)
    rejected_attempts = db.query(Question).filter(
        Question.quality_score < 60
    ).count()
    
    # Bloom distribution
    bloom_distribution = {}
    bloom_counts = (
        db.query(Question.bloom_level, func.count(Question.id))
        .group_by(Question.bloom_level)
        .all()
    )
    for bloom, count in bloom_counts:
        if bloom:
            bloom_distribution[bloom] = count
    
    # Difficulty distribution
    difficulty_distribution = {}
    difficulty_counts = (
        db.query(Question.difficulty, func.count(Question.id))
        .group_by(Question.difficulty)
        .all()
    )
    for difficulty, count in difficulty_counts:
        if difficulty:
            difficulty_distribution[difficulty] = count
    
    return {
        "total_papers": total_papers,
        "finalized_papers": finalized_papers,
        "avg_quality_score": round(avg_quality, 1),
        "rejected_attempts": rejected_attempts,
        "bloom_distribution": bloom_distribution,
        "difficulty_distribution": difficulty_distribution,
    }


@router.get("/recent-papers")
def get_recent_papers(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get recently created papers"""
    
    # Guard: Explicitly select only known columns to prevent crashes if DB schema update is delayed
    papers = (
        db.query(
            QuestionPaper.id,
            QuestionPaper.title,
            QuestionPaper.total_marks,
            QuestionPaper.status,
            QuestionPaper.created_at
        )
        .order_by(QuestionPaper.id.desc())
        .limit(limit)
        .all()
    )
    
    return [
        {
            "id": paper.id,
            "title": paper.title,
            "total_marks": paper.total_marks,
            "status": paper.status,
            "created_at": paper.created_at or paper.id,  # Using created_at if available
        }
        for paper in papers
    ]
