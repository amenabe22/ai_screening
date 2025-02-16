from fastapi import APIRouter, HTTPException
from .models import JobCreate, JobResponse
from .api import (create_job, get_all_jobs, get_candidate_questions,
                  get_jobs_by_recruiter, get_single_job,
                  generate_job_questions, generate_applicant_job_questions)
from .services import JobDetailData, JobQuestionData, generate_presigned_url

router = APIRouter()


@router.post("/")
async def create_job_endpoint(job: JobCreate):
    return await create_job(job)


@router.post("/s3-presigned/")
async def generate_questions_api(filename: str):
    return await generate_presigned_url(filename)


@router.post("/gen-q-new/")
async def generate_applicant_job_questions_api(data: JobQuestionData):
    return await generate_applicant_job_questions(data)


@router.post("/gen-q/")
async def generate_questions_api(data: JobDetailData):
    return await generate_job_questions(data)


@router.get("/")
async def get_jobs():
    return await get_all_jobs()


@router.get("/questions/{cid}/{jid}")
async def get_questions(cid: int, jid:int):
    return await get_candidate_questions(cid, jid)


@router.get("/{rid}")
async def get_job_api(rid: int):
    return await get_single_job(rid)


@router.get("/{rid}")
async def get_jobs_by_recruiter_api(rid: int):
    return await get_jobs_by_recruiter(rid)
