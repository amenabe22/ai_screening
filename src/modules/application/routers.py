from fastapi import APIRouter, HTTPException
from prisma.models import Application
from typing import List
from .api import (
    create_application, get_application,
    get_all_applications, update_application_status,
    delete_application
)
from .models import CreateApplicationDto, UpdateApplicationDto

router = APIRouter()


@router.post("/", response_model=Application)
async def create_application_api(application: CreateApplicationDto):
    new_application = await create_application(application)
    return new_application


@router.get("/", response_model=List[Application])
async def get_all_applications_api():
    applications = await get_all_applications()
    return applications


@router.get("/{application_id}", response_model=Application)
async def get_application_api(application_id: int):
    application = await get_application(application_id)
    return application


@router.patch("/{application_id}/status")
async def update_application_status_api(application_id: int, update_data: UpdateApplicationDto):
    return await update_application_status(application_id, update_data)


@router.delete("/{application_id}")
async def delete_application_api(application_id: int):
    return await delete_application(application_id)
