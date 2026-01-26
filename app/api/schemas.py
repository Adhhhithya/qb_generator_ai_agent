from pydantic import BaseModel
from typing import List, Optional, Dict, Union


class PaperMetadata(BaseModel):
    institution_name: str
    department: str
    course_title: str
    exam_duration: str
    max_marks: int


class GenerationConfig(BaseModel):
    subject: Optional[str] = None
    bloom: Optional[str] = None
    difficulty: Optional[str] = None


class GenerateQuestionRequest(BaseModel):
    code: str
    topic: str
    bloom_level: Union[str, List[str]]
    keywords: List[str]
    marks: int
    difficulty: str


class QuestionSchema(BaseModel):
    question: str
    code: Optional[str] = ""
    bloom_level: Optional[str] = "Understand"
    difficulty: Optional[str] = "Medium"
    marks: Optional[int] = 0
    rationale: Optional[str] = ""


class GenerateQuestionResponse(BaseModel):
    status: str
    attempts: int = 1
    question: Optional[QuestionSchema] = None
    audit: Optional[dict] = None

from typing import List
from pydantic import BaseModel


class QuestionOut(BaseModel):
    id: int
    code: str
    question: str
    bloom_level: str
    difficulty: str
    marks: int

    class Config:
        orm_mode = True


class QuestionListResponse(BaseModel):
    count: int
    questions: List[QuestionOut]
