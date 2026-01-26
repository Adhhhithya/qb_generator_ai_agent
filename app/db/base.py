from app.db.session import Base

# Import ALL models here so SQLAlchemy registers them
from app.db.models import (
    CourseOutcome,
    Question,
    AuditLogDB,
    QuestionPaper,
    PaperSection,
    PaperQuestion,
)
