from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import boto3
from fastapi import FastAPI, HTTPException
import json
from prisma.models import Job
from pydantic import BaseModel
from typing import List
from core.database import db
from openai import OpenAI
from botocore.client import Config
from core.config import OPENAI_API_KEY

# from app.schemas.question import QuestionResponse
# from app.core.config import settings

# Configure OpenAI API key

TOTAL_GENERATION_COUNT = 10

class QuestionResponse(BaseModel):
    question: str
    type: str  # 'open-ended' or 'multiple-choice'


class JobQuestionData(BaseModel):
    id: str
    candidate_id: int


class JobDetailData(BaseModel):
    title: str
    description: str
    total_questions: str


async def create_applicant_job_questions(data: JobQuestionData) -> List[QuestionResponse]:
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=OPENAI_API_KEY,
    )

    job = await db.job.find_first(
        include={"questions": True},
        where={"id": {"equals": int(data.id)}}
    )
    if not job:
        raise RuntimeError(f"Job not found")

    print(job.title)
    print(job.description)
    # Prepare the OpenAI prompt
    # prompt = (
    #     f"Generate a 5 interview questions for the following job:\n\n"
    #     f"Job Title: {data.title}\n"
    #     f"Job Description: {data.description}\n"
    #     f"Return the questions in JSON format with fields 'question' and 'type', "
    #     f"questions must be answerable in video response from the user and not require text response"
    # )
    prompt = (
        f"Generate exactly {TOTAL_GENERATION_COUNT} high-quality interview questions for the following job position.\n\n"
        f"Job Title: {job.title}\n"
        f"Job Description: {job.description}\n\n"
        f"Each question must:\n"
        f"- Be suitable for a video response from the candidate (avoid questions that require written answers).\n"
        f"- Assess practical experience, problem-solving skills, and communication ability.\n"
        f"- Be structured clearly and concisely.\n\n"
        f"Return the output in the following JSON format:\n"
        f"{{\n"
        f'    "questions": [\n'
        f'        {{"question": "<question 1>", "type": "video"}},\n'
        f'        {{"question": "<question 2>", "type": "video"}},\n'
        f'        {{"question": "<question 3>", "type": "video"}},\n'
        f'        {{"question": "<question 4>", "type": "video"}},\n'
        f'        {{"question": "<question 5>", "type": "video"}}\n'
        f"    ]\n"
        f"}}\n"
        f"Ensure all questions are engaging, relevant to the job, and focus on real-world applications."
    )
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        # Parse the JSON response
        content = response.choices[0].message.content.strip()
        print("Generated content: ", content)
        questions = json.loads(content)  # Safely parse JSON
        # Create initial question for collecting candidate ID
        id_question = "Please verify your identity by holding up your National ID / Passport to the camera, make sure to have a clear lighting."
        addnew = await db.question.create(
            data={"text": id_question, "jobId": int(data.id),
                  "candidateId": data.candidate_id, "isIdQuestion": True}
        )

        for question in questions["questions"]:
            await db.question.create(
                data={"text": question["question"], "jobId": int(data.id),
                      "candidateId": data.candidate_id}
            )
            print("Creating Question: ", question["question"])
    except Exception as e:
        raise RuntimeError(f"Error from OpenAI API: {e}")
    except json.JSONDecodeError:
        raise ValueError("Failed to parse questions from OpenAI response")

    # Convert to QuestionResponse objects
    return questions


async def generate_job_questions(data: JobDetailData) -> List[QuestionResponse]:
    client = OpenAI(
        # defaults to os.environ.get("OPENAI_API_KEY")
        api_key=OPENAI_API_KEY,
    )
    """
    Generate job-specific interview questions using OpenAI.
    """
    # Fetch job details from the database
    # job = await db.job.find_first(
    #     include={"questions": True},
    #     where={"id": {"equals": job_id}}
    # )
    # if not job:
    #     raise ValueError(f"Job with ID {job_id} not found")

    print(data.title)
    print(data.description)
    # Prepare the OpenAI prompt
    prompt = (
        f"Generate exactly {data.total_questions} high-quality interview questions for the following job position.\n\n"
        f"Job Title: {data.title}\n"
        f"Job Description: {data.description}\n\n"
        f"Each question must:\n"
        f"- Be suitable for a video response from the candidate (avoid questions that require written answers).\n"
        f"- Assess practical experience, problem-solving skills, and communication ability.\n"
        f"- Be structured clearly and concisely.\n\n"
        f"Return the output in the following JSON format:\n"
        f"{{\n"
        f'    "questions": [\n'
        f'        {{"question": "<question 1>", "type": "video"}},\n'
        f'        {{"question": "<question 2>", "type": "video"}},\n'
        f'        {{"question": "<question 3>", "type": "video"}},\n'
        f'        {{"question": "<question 4>", "type": "video"}},\n'
        f'        {{"question": "<question 5>", "type": "video"}}\n'
        f"    ]\n"
        f"}}\n"
        f"Ensure all questions are engaging, relevant to the job, and focus on real-world applications."
    )

    try:
        # Call OpenAI API to generate questions
        # response = openai.ChatCompletion.create(
        #     model="gpt-4",
        #     messages=[{"role": "user", "content": prompt}],
        #     temperature=0.7,
        #     max_tokens=500
        # )
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        # Parse the JSON response
        content = response.choices[0].message.content.strip()
        print("Generated content: ", content)
        questions = json.loads(content)  # Safely parse JSON
    except Exception as e:
        raise RuntimeError(f"Error from OpenAI API: {e}")
    except json.JSONDecodeError:
        raise ValueError("Failed to parse questions from OpenAI response")

    # Convert to QuestionResponse objects
    return questions


app = FastAPI()

# AWS S3 Configuration (Replace with your actual values)
AWS_ACCESS_KEY_ID = "AKIAYWBJYUXAVJ7EHVE3"
AWS_SECRET_ACCESS_KEY = "37Tct4NHgdcPVEUOe3ptAvGKzE6KW9tt5vg94+Km"
AWS_REGION = "eu-north-1"  # e.g., "us-west-1"
S3_BUCKET_NAME = "aiscreening"

# Initialize the S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION,
    config=Config(signature_version='s3v4')
)


class PresignedUrlRequest(BaseModel):
    file_name: str
    file_type: str  # MIME type of the file, e.g., "image/jpeg"


async def generate_presigned_url(filename):
    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": S3_BUCKET_NAME,
                "Key": filename,
                'ContentType': 'application/octet-stream',  # Example MIME type
            },
            ExpiresIn=3600,  # URL expiration time in seconds
        )

        return {"url": presigned_url}
    except NoCredentialsError:
        raise HTTPException(
            status_code=500, detail="AWS credentials not found.")
    except PartialCredentialsError:
        raise HTTPException(
            status_code=500, detail="Incomplete AWS credentials.")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating presigned URL: {str(e)}")
