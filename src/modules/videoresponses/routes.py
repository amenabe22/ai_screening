from fastapi import APIRouter
from .api import (
    create_video_response, get_video_response,
    get_video_responses, delete_video_response
)
from .models import VideoResponse, CreateVideoResponseDto


router = APIRouter()


@router.post("/")
async def create_video_response_api(create_video_response_dto: CreateVideoResponseDto):
    return await create_video_response(create_video_response_dto)


@router.get("/")
async def get_video_responses_api():
    return await get_video_responses()


@router.get("/{id}", response_model=VideoResponse)
async def get_video_response_api(id: int):
    return await get_video_response(id)


@router.delete("/{id}", status_code=204)
async def delete_video_response_api(id: int):
    return await delete_video_response(id)
