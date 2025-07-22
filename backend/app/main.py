from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Membuat instance aplikasi FastAPI
app = FastAPI()

# --- Middleware ---
# Menambahkan CORS Middleware agar Frontend (React) yang berjalan di domain berbeda (localhost:5173)
# bisa berkomunikasi dengan Backend (localhost:8000). Ini sangat penting!
origins = [
    "http://localhost:5173", # URL development React
    "http://localhost:5173/",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Mengizinkan semua metode (GET, POST, dll.)
    allow_headers=["*"], # Mengizinkan semua header
)


# --- Endpoints ---
# Membuat endpoint "root" atau "hello world"
@app.get("/")
def read_root():
    """
    Endpoint dasar untuk mengecek apakah server berjalan.
    """
    return {"message": "Welcome to VibeStream API!"}