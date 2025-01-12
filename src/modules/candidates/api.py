
from ...core.database import db
from .models import CreateCandidateDto


async def create_candidate(create_candidate_dto: CreateCandidateDto):
    # Check if candidate already exists
    candidate = await db.candidate.find_unique(where={"email": create_candidate_dto.email})
    if candidate:
        return candidate  # Return existing candidate

    # Create new candidate
    new_candidate = await db.candidate.create(data=create_candidate_dto.dict())
    return new_candidate


async def get_all_candidates():
    return await db.candidate.find_many()
