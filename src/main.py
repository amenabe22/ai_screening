from typing import List
from core.database import db
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from prisma.models import Application, Candidate
from prisma.enums import ApplicationStatus
from typing import Optional
from modules.jobs import jobs_router
from modules.questions import questions_router
from modules.application import application_router
from modules.candidates import candidates_router
from modules.videoresponses import videoresponses_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(jobs_router, prefix="/jobs", tags=["Jobs"])
app.include_router(questions_router, prefix="/questions", tags=["Question"])
app.include_router(application_router,
                   prefix="/applications", tags=["Applications"])
app.include_router(candidates_router, prefix="/candidates",
                   tags=["Candidates"])
app.include_router(candidates_router, prefix="/candidates",
                   tags=["Candidates"])
app.include_router(videoresponses_router, prefix="/video-responses",
                   tags=["Video Responses"])


@app.on_event("startup")
async def startup():
    await db.connect()


@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()


@app.get("/")
async def root():
    return {"message": "Hello World"}
