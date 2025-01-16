from core.database import db
from fastapi import HTTPException
from prisma.models import Application
from prisma.enums import ApplicationStatus
from .models import CreateApplicationDto, UpdateApplicationDto

# Applicaiton APIS
# Create an application
# @app.post("/applications", response_model=Application)


async def create_application(application: CreateApplicationDto):
    candidate = await db.candidate.find_unique(where={"id": application.candidate_id})

    if not candidate:
        raise HTTPException(
            status_code=404, detail=f"Candidate with ID {application.candidate_id} not found")

    job_posting = await db.job.find_unique(where={"id": application.job_posting_id}, include={"questions": True})
    if not job_posting:
        raise HTTPException(
            status_code=404, detail=f"Job posting with ID {application.job_posting_id} not found")

    new_application = await db.application.create(
        data={
            "candidate": {"connect": {"id": candidate.id}},
            "job": {"connect": {"id": job_posting.id}},
            "status": ApplicationStatus.RECIEVED,
        }
    )
    return new_application

# Get all applications


# @app.get("/applications", response_model=List[Application])
async def get_all_applications():
    applications = await db.application.find_many(include={"candidate": True, "job": True, "videoResponses": True})
    return applications

# Get a single application


# @app.get("/applications/{application_id}", response_model=Application)
async def get_application(application_id: int):
    application = await db.application.find_unique(
        where={"id": application_id},
        include={"candidate": True, "job": True, "videoResponses": True}
    )
    if not application:
        raise HTTPException(
            status_code=404, detail=f"Application with ID {application_id} not found")
    return application

# Update application status


# @app.patch("/applications/{application_id}/status")
async def update_application_status(application_id: int, update_data: UpdateApplicationDto):
    application = await db.application.find_unique(
        where={"id": application_id},
        include={"job": {"include": {
            "recruiter": True}}, "candidate": True}
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Ensure the recruiter owns the job posting
    job_posting = application.job
    if not job_posting or not job_posting.recruiter:
        raise HTTPException(
            status_code=403, detail="You are not authorized to update this application.")

    updated_application = await db.application.update(
        where={"id": application_id},
        data={"status": update_data.status}
    )
    return {
        "message": f"Application status updated to {update_data.status}.",
        "application": updated_application
    }

# Delete an application


# @app.delete("/applications/{application_id}")
async def delete_application(application_id: int):
    application = await db.application.find_unique(where={"id": application_id})
    if not application:
        raise HTTPException(
            status_code=404, detail=f"Application with ID {application_id} not found")

    await db.application.delete(where={"id": application_id})
    return {"message": f"Application with ID {application_id} has been deleted successfully"}
