import os
import whisper
import tempfile
import requests
from openai import OpenAI
from core.database import db
from fastapi import HTTPException
from core.config import OPENAI_API_KEY
from .models import CreateVideoResponseDto
from moviepy.video.io.VideoFileClip import VideoFileClip

# Initialize the Whisper model
# Choose model size based on your resource constraints
whisper_model = whisper.load_model("base")

client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=OPENAI_API_KEY,
)


async def download_video(video_url: str, output_path: str) -> str:
    """Download video from URL and save it locally."""
    response = requests.get(video_url, stream=True)
    if response.status_code == 200:
        with open(output_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=1024):
                file.write(chunk)
        return output_path
    else:
        raise ValueError(
            f"Failed to download video. Status code: {response.status_code}")


async def extract_audio_from_video(video_path: str) -> str:
    """Extract audio from a video file using MoviePy."""
    video = VideoFileClip(video_path)
    audio_path = video_path.replace(".mp4", ".mp3")
    video.audio.write_audiofile(audio_path)
    video.close()
    return audio_path


async def transcribe_and_summarize_video(video_url: str):
    # Step 1: Download video
    with tempfile.TemporaryDirectory() as temp_dir:
        video_path = os.path.join(temp_dir, "video.mp4")
        await download_video(video_url, video_path)

        # Step 2: Extract audio
        audio_path = await extract_audio_from_video(video_path)

        # Step 3: Transcribe audio using Whisper
        transcription_result = whisper_model.transcribe(audio_path)
        transcript = transcription_result["text"]

        # Step 4: Generate summary using OpenAI
        # openai.api_key = "your-openai-api-key"
        summary_prompt = (
            f"Summarize the following conversation concisely:\n\n{transcript}"
        )
        summary_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": summary_prompt}]
        )

        summary = summary_response.choices[0].message.content.strip()
        # summary_response = openai.ChatCompletion.create(
        #     model="gpt-4",
        #     messages=[
        #         {"role": "system", "content": "You are a helpful summarization assistant."},
        #         {"role": "user", "content": summary_prompt}
        #     ]
        # )
        # summary = summary_response["choices"][0]["message"]["content"].strip()

        return {"conversation": transcript, "summary": summary}


async def generate_rating(question: str, transcript: str):
    # Use OpenAI to generate rating
    # raitng_prompt = (
    #     f"Rate the following transcript of a response to the question: '{question}'. "
    #     f"Provide an honest reasonable rate out of 10 just return the rating value number:\n\n{transcript}"
    # )
    rating_prompt = (
        f"Analyze the following transcript of a response to the question: '{question}'.\n\n"
        f"Evaluate the response based on the following factors:\n"
        f"- Relevance to the question\n"
        f"- Clarity and coherence\n"
        f"- Depth of insight, detail, and completeness\n"
        f"- Grammar, articulation, and structure\n\n"
        f"Provide an honest, reasonable rating out of 10 that reflects the quality of the response.\n"
        f"Consider how well the response addresses the question, the clarity of the explanation, "
        f"and the overall usefulness of the answer in a real-world context. The rating should "
        f"reflect both the strengths and weaknesses of the response.\n\n"
        f"Transcript:\n{transcript}"
    )

    summary_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": rating_prompt}]
    )

    rating = summary_response.choices[0].message.content.strip()

    return rating


async def generate_feedback(question: str, transcript: str):
    # Use OpenAI to generate feedback
    feedback_prompt = (
        f"Analyze the following transcript of a response to the question: '{question}'. "
        f"Provide constructive feedback on the content, clarity, and overall quality:\n\n{transcript}"
    )
    summary_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": feedback_prompt}]
    )

    feedback = summary_response.choices[0].message.content.strip()

    return feedback

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
    if not question.isIdQuestion:
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
        rating = await generate_rating(question.text, video_response.transcript)
        video_response = await db.videoresponse.update(
            where={"id": video_response.id},
            data={"feedback": feedback, "rating": rating},
        )

    return video_response


# @app.get("/video-responses")
async def get_video_responses():
    video_responses = await db.videoresponse.find_many(
        include={"application": True, "question": True},
        order={
            "question": {
                "isIdQuestion": 'desc'
            }
        }
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
