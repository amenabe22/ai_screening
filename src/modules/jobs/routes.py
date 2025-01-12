from fastapi import APIRouter, HTTPException
from .api import create_job, get_all_jobs
from .models import JobCreate, JobResponse

router = APIRouter()


@router.post("/")
async def create_job_endpoint(job: JobCreate):
    return await create_job(job)


@router.get("/")
async def get_jobs():
    return await get_all_jobs()
