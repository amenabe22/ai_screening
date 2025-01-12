from pydantic import BaseModel
from datetime import datetime

class JobCreate(BaseModel):
    title: str
    description: str | None = None


class JobResponse(BaseModel):
    id: int
    job_title: str
    candidate_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True  # Enable compatibility with ORM models (like Prisma)
