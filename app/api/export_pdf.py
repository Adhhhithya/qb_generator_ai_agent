from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from io import BytesIO
import textwrap

from app.db.session import get_db
from app.db.models import Question

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/questions/pdf")
def export_questions_pdf(db: Session = Depends(get_db)):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    width, height = A4
    margin_x = 40
    margin_y = 40
    y = height - margin_y

    # Title
    c.setFont("Helvetica-Bold", 14)
    c.drawString(margin_x, y, "Outcome-Aligned Question Bank")
    y -= 30

    c.setFont("Helvetica", 10)

    questions = db.query(Question).all()

    for idx, q in enumerate(questions, start=1):
        # Wrap question text properly
        wrapped_lines = textwrap.wrap(q.question_text, 90)

        for line in wrapped_lines:
            if y < margin_y:
                c.showPage()
                c.setFont("Helvetica", 10)
                y = height - margin_y

            c.drawString(margin_x, y, line)
            y -= 14

        # Metadata line
        meta = (
            f"Bloom: {q.bloom_level} | "
            f"Difficulty: {q.difficulty} | "
            f"Marks: {q.marks}"
        )

        if y < margin_y:
            c.showPage()
            c.setFont("Helvetica", 10)
            y = height - margin_y

        c.setFont("Helvetica-Oblique", 8)
        c.drawString(margin_x + 10, y, meta)
        c.setFont("Helvetica", 10)
        y -= 24  # space between questions

    c.save()
    buffer.seek(0)

    return Response(
        content=buffer.read(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=question_bank.pdf"
        },
    )

