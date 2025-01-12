from pydantic import BaseModel

# Define the input schema for creating a questiona
class QuestionCreate(BaseModel):
    text: str
    job_id: int


# Define the schema for updating a question
class QuestionUpdate(BaseModel):
    text: str
