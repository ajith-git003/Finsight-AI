from fastapi import FastAPI, Request, Body
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import json
import os
from openai import OpenAI
from rag_engine import TransactionRAG
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ---------------------------
# App Init
# ---------------------------
# ---------------------------
# Pydantic Models
# ---------------------------
class Message(BaseModel):
    role: str
    content: str

class AskRequest(BaseModel):
    messages: List[Message]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# OpenAI Client & Load Data
# ---------------------------
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ---------------------------
# Initialize RAG System
# ---------------------------
rag_system = TransactionRAG()
# documents = ... (removed legacy static loading)

# ---------------------------
# Health Check
# ---------------------------
@app.get("/")
def health():
    return {"status": "Insightful Finance Buddy RAG backend running"}

# ---------------------------
# RAG CHAT ENDPOINT 
# ---------------------------
@app.post("/api/ask")
async def ask(payload: AskRequest = Body(...)):
    messages = payload.messages
    # Safely get the last user message content
    if not messages:
        return {"error": "No messages provided"}
    
    user_query = messages[-1].content

    # ---------------------------
    # Retrieve Context via RAG
    # ---------------------------
    # Uses vector search to find most relevant transactions
    # Using await for non-blocking execution
    context = await rag_system.retrieve_context(user_query)

    # ---------------------------
    # OpenAI LLM Response with Streaming
    # ---------------------------
    system_prompt = f"""You are an expert AI financial assistant providing personalized financial advice. 

Analyze the user's transaction data and provide detailed, actionable recommendations with:
- **Specific numbers and calculations** based on their actual spending
- **Concise, structured breakdown** (use bullets)
- **Practical, realistic suggestions** they can implement immediately
- **Use emojis** for better readability (💡, 💰, 📊, etc.)
- **ALWAYS use the Indian Rupee symbol (₹) for all currency values** (e.g., ₹500, ₹10,000)
- **Format with markdown** (bold, bullets, numbered lists) - NEVER use markdown tables
- Use bullet points with dashes or numbers instead of tables
- Be encouraging and motivational


Retrieved relevant transactions:
{context}

IMPORTANT: Do NOT use markdown table syntax (pipes |). Instead, use bullet points and clear formatting with emojis and bold text.
Analyze these transactions deeply and provide comprehensive, personalized advice that shows you understand their spending patterns."""

    user_message = f"""{user_query}

Provide a detailed, well-structured response with specific numbers, actionable steps, and realistic recommendations based on the transaction data."""

    def stream():
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                stream=True,
                temperature=0.7,
                max_tokens=1000
            )
            
            for chunk_response in response:
                if chunk_response.choices[0].delta.content:
                    content = chunk_response.choices[0].delta.content
                    chunk = {
                        "choices": [{"delta": {"content": content}}]
                    }
                    yield f"data: {json.dumps(chunk)}\n\n"
            
            yield "data: [DONE]\n\n"
        except Exception as e:
            error_msg = f"Error: {str(e)}"
            chunk = {
                "choices": [{"delta": {"content": error_msg}}]
            }
            yield f"data: {json.dumps(chunk)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(stream(), media_type="text/event-stream")
