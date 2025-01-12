from typing import Optional
from pydantic import BaseModel


class CreateCandidateDto(BaseModel):
    name: str
    email: str
    resume: Optional[str] = None


class UpdateCandidateDto(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    resume: Optional[str] = None


class CandidateOut(BaseModel):
    id: int
    name: str
    email: str
    resume: Optional[str]

    class Config:
        orm_mode = True
