
from pydantic import BaseModel, Field
from typing import List


class CourseOutcome(BaseModel):
    code: str = Field(..., example="CO2")
    topic: str = Field(..., example="Normalization")
    bloom_level: str = Field(..., example="Apply")
    keywords: List[str] = Field(
        ...,
        example=["1NF", "2NF", "3NF", "Functional Dependency"]
    )
