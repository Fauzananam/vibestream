#!/bin/bash

echo "🚀 Menjalankan Development Server untuk VibeStream..."

# Menjalankan Backend FastAPI
echo "🔥 Memulai server backend FastAPI di http://127.0.0.1:8000"
cd backend
source venv/bin/activate
uvicorn app.main:app --reload &
BACKEND_PID=$!
cd ..

# Menjalankan Frontend React
echo "⚛️ Memulai server frontend React di http://localhost:5173"
cd frontend
npm run dev &
FRONTEND_PID=$!

# Menunggu interupsi (Ctrl+C) untuk mematikan kedua server
trap "echo '🛑 Menghentikan semua server...'; kill $BACKEND_PID; kill $FRONTEND_PID; exit" SIGINT
wait