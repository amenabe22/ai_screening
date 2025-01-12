from fastapi import HTTPException
from .models import CreateVideoResponseDto, VideoResponse
from ...core.database import db


# Helper functions to handle transcription and feedback generation
async def transcribe_and_summarize_video(video_url: str):
    # Here, you would use your service (AssemblyAI/OpenAI) to transcribe the video and generate a summary
    # Placeholder for transcription logic
    return {"conversation": "Transcribed text", "summary": "Summary of the video"}


async def generate_feedback(question: str, transcript: str):
    # Placeholder for feedback generation logic using OpenAI
    return "Generated feedback based on transcript"


# @app.post("/video-responses")
async def create_video_response(create_video_response_dto: CreateVideoResponseDto):
    application = await db.application.find_unique(
        where={"id": create_video_response_dto.application_id}
    )
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    question = await db.question.find_unique(
        where={"id": create_video_response_dto.question_id}
    )
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Create a new video response
    video_response = await db.videoresponse.create(
        data={
            "application": {"connect": {"id": application.id}},
            "question": {"connect": {"id": question.id}},
            "videoUrl": create_video_response_dto.video_url
        }
    )

    # Start transcription as a background task
    # Here, you can use a background task handler, or just await the transcription logic
    transcription_data = await transcribe_and_summarize_video(video_response.videoUrl)

    # Update the video response with transcription and summary
    video_response = await db.videoresponse.update(
        where={"id": video_response.id},
        data={
            "transcript": transcription_data["conversation"],
            "summary": transcription_data["summary"]
        }
    )

    # Generate feedback based on transcription
    feedback = await generate_feedback(question.text, video_response.transcript)
    video_response = await db.videoresponse.update(
        where={"id": video_response.id},
        data={"feedback": feedback}
    )

    return video_response


# @app.get("/video-responses")
async def get_video_responses():
    video_responses = await db.videoresponse.find_many(
        include={"application": True, "question": True}
    )
    return video_responses


# @app.get("/video-responses/{id}", response_model=VideoResponse)
async def get_video_response(id: int):
    video_response = await db.videoresponse.find_unique(
        where={"id": id},
        include={"application": True, "question": True}
    )
    if not video_response:
        raise HTTPException(status_code=404, detail="Video response not found")
    return video_response


# @app.delete("/video-responses/{id}", status_code=204)
async def delete_video_response(id: int):
    video_response = await db.videoresponse.delete(where={"id": id})
    if not video_response:
        raise HTTPException(status_code=404, detail="Video response not found")
    return {"detail": "Video response deleted successfully"}
