from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag_pipeline import ask_question, load_vectorstore
import os

# Create FastAPI app
app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load vectorstore once at startup
@app.on_event("startup")
def startup_event():
    if os.path.exists("vectorstore.pkl"):
        load_vectorstore()
    else:
        print("⚠ Vectorstore not found. Please build it first.")


# Request schema
class QuestionRequest(BaseModel):
    question: str


# API route
@app.post("/ask")
def ask_api(request: QuestionRequest):
    answer = ask_question(request.question)
    return {"answer": answer}


# Health check
@app.get("/")
def root():
    return {"status": "RAG API is running"}