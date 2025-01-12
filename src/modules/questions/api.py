from typing import List
from ...core.database import db
from fastapi import HTTPException
from .models import QuestionCreate, QuestionUpdate


async def create_question(question: QuestionCreate):
    # Verify the job exists
    job = await db.job.find_unique(where={"id": question.job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Create the question and associate it with the job
    new_question = await db.question.create(
        data={
            "text": question.text,
            "job": {"connect": {"id": question.job_id}}
        }
    )
    return new_question


async def update_question(question_id: int, question: QuestionUpdate):
    # Check if the question exists
    existing_question = await db.question.find_unique(where={"id": question_id})
    if not existing_question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Update the question
    updated_question = await db.question.update(
        where={"id": question_id},
        data={"text": question.text}
    )

    return updated_question


# Batch create endpoint
async def create_questions(questions: List[QuestionCreate]):
    # Map the input into the format required by Prisma
    question_data = [
        {"text": question.text, "jobId": question.job_id}
        for question in questions
    ]

    # Use Prisma to create the questions in batch
    created_count = await db.question.create_many(data=question_data)

    if created_count != len(questions):
        raise HTTPException(
            status_code=500, detail="Not all questions were created successfully"
        )

    return {"message": f"Successfully created {created_count} questions"}


async def delete_question(question_id: int):
    # Check if the question exists
    question = await db.question.find_unique(where={"id": question_id})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Delete the question
    await db.question.delete(where={"id": question_id})

    return {"message": f"Question with ID {question_id} deleted successfully"}
