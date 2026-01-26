from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, ARRAY, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy import TIMESTAMP

from app.db.session import Base


class CourseOutcome(Base):
    __tablename__ = "course_outcomes"

    id = Column(Integer, primary_key=True)
    code = Column(String)
    topic = Column(Text)
    bloom_level = Column(String)
    keywords = Column(ARRAY(String))
    created_at = Column(TIMESTAMP, server_default=func.now())


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    outcome_id = Column(Integer, ForeignKey("course_outcomes.id"))

    question_text = Column(Text, nullable=False)

    bloom_level = Column(String(20), nullable=False)
    difficulty = Column(String(20), nullable=False)
    marks = Column(Integer, nullable=False)

    quality_score = Column(Integer, nullable=True)
    difficulty_drift = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Analytics Support
    topics_used = Column(ARRAY(String), default=[])

    outcome = relationship("CourseOutcome")


class AuditLogDB(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    verdict = Column(String)
    audit_payload = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())


class QuestionPaper(Base):
    __tablename__ = "question_papers"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=True)
    total_marks = Column(Integer, nullable=False)

    syllabus = Column(Text, nullable=True)
    
    # Paper Metadata (Institution & Exam details - NOT sent to LLM)
    paper_metadata = Column(JSON, nullable=True)
    
    # Analytics (Coverage & Bloom Distribution)
    analytics = Column(JSON, nullable=True, default={})
    
    # Subject Grounding (LLM-extracted single source of truth)
    subject = Column(String(255), nullable=True)  # e.g., "Discrete Mathematics and Graph Theory"
    domain = Column(String(255), nullable=True)   # e.g., "Computer Science"
    core_topics = Column(ARRAY(String), nullable=True)  # 6-10 topics from syllabus
    forbidden_topics = Column(ARRAY(String), nullable=True)  # Topics to avoid

    status = Column(String(20), default="DRAFT")  
    # DRAFT | FINALIZED

    generation_mode = Column(String(20), default="hackathon")
    # hackathon (flexible) | strict (rigorous auditing)

    created_at = Column(DateTime, default=datetime.utcnow)

    sections = relationship(
        "PaperSection",
        back_populates="paper",
        cascade="all, delete-orphan"
    )


class PaperSection(Base):
    __tablename__ = "paper_sections"

    id = Column(Integer, primary_key=True, index=True)

    paper_id = Column(Integer, ForeignKey("question_papers.id"))

    name = Column(String(50), nullable=False)  
    # Part A / Part B / Part C

    marks_per_question = Column(Integer, nullable=False)
    number_of_questions = Column(Integer, nullable=False)

    total_marks = Column(Integer, nullable=False)

    paper = relationship("QuestionPaper", back_populates="sections")

    questions = relationship(
        "PaperQuestion",
        back_populates="section",
        cascade="all, delete-orphan"
    )


class PaperQuestion(Base):
    __tablename__ = "paper_questions"

    id = Column(Integer, primary_key=True, index=True)

    section_id = Column(Integer, ForeignKey("paper_sections.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))

    question_order = Column(Integer, nullable=False)

    section = relationship("PaperSection", back_populates="questions")
    question = relationship("Question")
