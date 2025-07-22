# backend/app/core/config.py

import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    """
    Kelas untuk mengelola konfigurasi aplikasi.
    Pydantic akan secara otomatis membaca variabel environment.
    """
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    SUPABASE_JWT_SECRET: str

    class Config:
        env_file = ".env"

# Membuat satu instance dari Settings yang akan digunakan di seluruh aplikasi
settings = Settings() # type: ignore
