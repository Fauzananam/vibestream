from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Impor router yang telah kita buat
from app.routers import users,music

# Membuat instance aplikasi FastAPI
app = FastAPI(
    title="VibeStream API",
    description="API untuk aplikasi streaming musik VibeStream.",
    version="0.1.0"
)

# --- Middleware ---
# Menambahkan CORS Middleware agar Frontend (React) bisa berkomunikasi
origins = [
    "http://localhost:5173",
    "http://localhost:5173/",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Routers ---
# Mendaftarkan router pengguna ke aplikasi utama.
# Semua endpoint dari users.py sekarang akan aktif.
app.include_router(users.router)
app.include_router(music.router) 


# --- Endpoints ---
# Endpoint dasar untuk mengecek apakah server berjalan.
@app.get("/")
def read_root():
    """
    Endpoint dasar untuk mengecek status API.
    """
    return {"status": "ok", "message": "Welcome to VibeStream API!"}