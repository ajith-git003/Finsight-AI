# FastAPI Backend for Financial Analysis

This backend provides a RAG pipeline for personalized financial advice using FastAPI, ChromaDB, and Google Gemini.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Environment Variables:**
   - Rename the `.env.template` file to `.env`.
   - Open the `.env` file and replace `YOUR_GEMINI_API_KEY` with your actual Google Gemini API key.

3. **Run the FastAPI Application:**
   ```bash
   uvicorn main:app --reload
   ```

4. **Access the API:**
   The API will be running at `http://127.0.0.1:8000`.
