from pydantic import BaseModel


class CreateVideoResponseDto(BaseModel):
    application_id: int
    question_id: int
    video_url: str


class VideoResponse(BaseModel):
    id: int
    application_id: int
    question_id: int
    video_url: str
    transcript: str = None
    summary: str = None
    feedback: str = None
