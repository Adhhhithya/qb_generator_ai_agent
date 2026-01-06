from sqlalchemy import Column, Integer, String, Text, ARRAY, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy import TIMESTAMP

Base = declarative_base()


class CourseOutcomeDB(Base):
    __tablename__ = "course_outcomes"

    id = Column(Integer, primary_key=True)
    code = Column(String)
    topic = Column(Text)
    bloom_level = Column(String)
    keywords = Column(ARRAY(String))
    created_at = Column(TIMESTAMP, server_default=func.now())


class QuestionDB(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    outcome_id = Column(Integer, ForeignKey("course_outcomes.id"))
    question_text = Column(Text)
    bloom_level = Column(String)
    difficulty = Column(String)
    marks = Column(Integer)
    created_at = Column(TIMESTAMP, server_default=func.now())


class AuditLogDB(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    verdict = Column(String)
    audit_payload = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())
