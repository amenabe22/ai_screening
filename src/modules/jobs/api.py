from .models import JobCreate
from core.database import db
from .services import generate_job_questions
from prisma.models import Job
from fastapi.exceptions import HTTPException


async def generate_questions(job: Job):
    """
    Generate questions dynamically for a given job using OpenAI.
    """
    try:
        questions = await generate_job_questions(job)
        return questions
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating questions: {str(e)}")


async def create_job(job: JobCreate):
    new_job = await db.job.create(
        data={"title": job.title, "description": job.description,
              "recruiterId": job.recruiter_id}
    )
    return new_job


async def get_all_jobs():
    jobs = await db.job.find_many(
        include={
            "questions": True
        }
    )
    return jobs


async def get_single_job(rid: int):
    jobs = await db.job.find_first(
        include={
            "questions": True
        },
        where={
            "id": {"equals": rid}
        }
    )

    return jobs


async def get_jobs_by_recruiter(rid: int):
    jobs = await db.job.find_many(
        include={
            "questions": True
        },
        where={
            "recruiterId": {"equals": rid}
        }
    )

    return jobs
