from .models import JobCreate
from ...core.database import db


async def create_job(job: JobCreate):
    new_job = await db.job.create(
        data={"title": job.title, "description": job.description}
    )
    return new_job


async def get_all_jobs():
    jobs = await db.job.find_many(
        include={
            "questions": True
        }
    )
    print("jobs++++>", jobs)
    return jobs
