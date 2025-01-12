from pydantic import BaseModel
from prisma.enums import ApplicationStatus


class UpdateApplicationDto(BaseModel):
    status: ApplicationStatus


class CreateApplicationDto(BaseModel):
    candidate_id: int
    job_posting_id: int
