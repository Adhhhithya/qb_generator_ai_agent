from pydantic import BaseModel
from typing import List, Optional


class GenerateQuestionRequest(BaseModel):
    code: str
    topic: str
    bloom_level: str
    keywords: List[str]
    marks: int
    difficulty: str


class GenerateQuestionResponse(BaseModel):
    status: str
    attempts: int
    question: dict
    audit: dict

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
