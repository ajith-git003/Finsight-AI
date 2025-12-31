# Insightful Finance Buddy 💰

An AI-powered personal finance assistant that helps you manage expenses, track spending, and get intelligent financial advice.

## Features

- 📊 **Expense Tracking**: Upload and visualize your financial transactions
- 🤖 **AI Assistant**: Get personalized financial advice powered by OpenAI GPT-4
- 📈 **Interactive Dashboard**: Beautiful charts and analytics
- 🔍 **RAG-Powered Insights**: Vector search through your transaction history
- 💡 **Smart Recommendations**: Actionable suggestions to save money

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- TailwindCSS + shadcn/ui
- Recharts for visualizations
- React Query for data fetching

### Backend
- FastAPI (Python)
- OpenAI GPT-4o-mini
- FAISS for vector search
- Sentence Transformers for embeddings
- Server-Sent Events (SSE) for streaming responses

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ajith-git003/insightful-finance-buddy.git
cd insightful-finance-buddy
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

3. **Frontend Setup**
```bash
cd frontend/insightful-finance-buddy-main
npm install
```

### Running Locally

1. **Start Backend** (in one terminal)
```bash
cd AIMLproject
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --app-dir backend
```

2. **Start Frontend** (in another terminal)
```bash
cd frontend/insightful-finance-buddy-main
npm run dev
```

3. **Open** `http://localhost:8080`

## Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## Deployment

### Vercel (Frontend)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Render/Railway (Backend)
1. Connect GitHub repository
2. Set environment variables
3. Use start command: `uvicorn main:app --host 0.0.0.0 --port $PORT --app-dir backend`

## Contributing

Built with assistance from [Warp AI](https://warp.dev) 🚀

## License

MIT

## Acknowledgments

- Frontend design inspired by Lovable
- Backend developed with Google IDX
- AI assistance provided by Warp
