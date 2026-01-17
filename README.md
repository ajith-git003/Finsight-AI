# FinSight AI

FinSight AI is an AI-powered personal finance assistant designed to help users
understand spending patterns, track savings goals, and receive actionable
financial insights using real transaction data.

This project focuses on building a controlled, backend-driven AI system
rather than a prompt-only demo.

---

## What This Project Solves

Managing personal finances becomes difficult when transaction data is scattered
and insights are unclear.

FinSight AI helps users:
- Upload transaction data
- Understand where money is being spent
- Ask natural language questions about finances
- Receive structured, personalized recommendations

---

## Key Features

- Expense analysis with automatic categorization  
- AI-powered financial assistant for natural language queries  
- Savings goal creation and tracking  
- Clean dashboard with light and dark mode support  

---

## System Design 
1. User uploads transaction data
2. Backend preprocesses and structures the data
3. Structured context is passed to the AI model
4. AI generates insights and recommendations
5. Responses are streamed back to the frontend in real time

The AI is treated as a controlled system component, not a black box.

---

## Project Structure 

```text
frontend/        # User interface and visualizations
backend/         # API, data processing, and AI logic
docs/            # Architecture and setup documentation
```


---

## Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Recharts
- Deployed on Vercel

### Backend
- FastAPI (Python)
- OpenAI (GPT-4o-mini)
- Server-Sent Events (SSE)
- Deployed on Render

---

## Deployment

- Frontend hosted on Vercel
- Backend hosted on Render
- API keys managed using environment variables

Live Demo:
https://finsight-ai-i.vercel.app/

---

## Purpose

This project was built as part of my AI engineering portfolio to demonstrate:
- End-to-end AI system design
- Backend-controlled AI workflows
- Real-world data handling
- Full-stack deployment ownership

---

## License

This project is intended for educational and portfolio purposes.

## Project Structure (High-Level)

