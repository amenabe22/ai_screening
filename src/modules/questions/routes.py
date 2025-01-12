from typing import List
from fastapi import APIRouter
from .api import create_question, create_questions, delete_question, update_question
from .models import QuestionCreate, QuestionUpdate

router = APIRouter()


# POST endpoint to create a question for a job
@router.post("/")
async def create_question_api(question: QuestionCreate):
    new_question = await create_question(question)
    return new_question


@router.put("/{question_id}")
async def update_question_api(question_id: int, question: QuestionUpdate):
    updated_question = await update_question(question_id, question)
    return updated_question

# Batch create endpoint


@router.post("/batch")
async def create_questions_api(questions: List[QuestionCreate]):
    create_qn = await create_questions(questions)
    return create_qn


@router.delete("/{question_id}")
async def delete_question_api(question_id: int):
    delete_qn = await delete_question(question_id)
    return delete_qn
