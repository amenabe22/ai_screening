from typing import List
from fastapi import APIRouter
from .models import CandidateOut, CreateCandidateDto
from .api import create_candidate, get_all_candidates, get_single_candidate

router = APIRouter()


@router.post("/", response_model=CandidateOut)
async def create_candidate_api(create_candidate_dto: CreateCandidateDto):
    return await create_candidate(create_candidate_dto)


@router.get("/", response_model=List[CandidateOut])
async def get_all_candidates_api():
    return await get_all_candidates()


@router.patch("/", response_model=List[CandidateOut])
async def get_single_candidate_api(data):
    return await get_single_candidate(data)
