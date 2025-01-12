from typing import List
from fastapi import APIRouter
from .models import CandidateOut, CreateCandidateDto
from .api import create_candidate, get_all_candidates

router = APIRouter()


@router.post("/", response_model=CandidateOut)
async def create_candidate_api(create_candidate_dto: CreateCandidateDto):
    return await create_candidate(create_candidate_dto)


@router.get("/", response_model=List[CandidateOut])
async def get_all_candidates_api():
    return await get_all_candidates()
