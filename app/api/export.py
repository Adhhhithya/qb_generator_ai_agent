from fastapi import APIRouter, Depends, Response, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Question

import csv
import io

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/questions/csv")
def export_questions_csv(
    bloom: str | None = Query(default=None),
    difficulty: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Question)

    if bloom:
        query = query.filter(Question.bloom_level == bloom)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)

    questions = query.all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Question",
        "Bloom Level",
        "Difficulty",
        "Marks"
    ])

    for q in questions:
        writer.writerow([
            q.question_text,
            q.bloom_level,
            q.difficulty,
            q.marks
        ])

    response = Response(
        content=output.getvalue(),
        media_type="text/csv"
    )
    response.headers["Content-Disposition"] = (
        "attachment; filename=question_bank_filtered.csv"
    )

    return response
