from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ---------------------------
# App Init
# ---------------------------
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

# Load CSV data
backend_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(backend_dir, "sample_transactions.csv")
df = pd.read_csv(csv_path)

# Create simple context from transactions
documents = [
    f"On {row.date}, spent ₹{row.amount} on {row.description} under {row.category}"
    for _, row in df.iterrows()
]

# ---------------------------
# Health Check
# ---------------------------
@app.get("/")
def health():
    return {"status": "Insightful Finance Buddy RAG backend running"}

# ---------------------------
# RAG CHAT ENDPOINT (Lovable Compatible)
# ---------------------------
@app.post("/api/ask")
async def ask(request: Request):
    body = await request.json()
    messages = body.get("messages", [])
    user_query = messages[-1]["content"]

    # ---------------------------
    # Get Recent Transactions as Context
    # ---------------------------
    # Just use recent transactions instead of RAG
    context = "\n".join(documents[:10])  # First 10 transactions

    # ---------------------------
    # OpenAI LLM Response with Streaming
    # ---------------------------
    system_prompt = f"""You are an expert AI financial assistant providing personalized financial advice. 

Analyze the user's transaction data and provide detailed, actionable recommendations with:
- **Specific numbers and calculations** based on their actual spending
- **Structured breakdown** with clear categories using bullets or numbered lists
- **Practical, realistic suggestions** they can implement immediately
- **Use emojis** for better readability (💡, 💰, 📊, etc.)
- **Format with markdown** (bold, bullets, numbered lists) - NEVER use markdown tables
- Use bullet points with dashes or numbers instead of tables
- Be encouraging and motivational

Relevant transaction records:
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
                temperature=0.8,
                max_tokens=1500
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
