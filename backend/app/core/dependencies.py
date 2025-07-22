# backend/app/core/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
from gotrue.types import User # Impor tipe User untuk type hinting yang lebih baik

from app.core.config import settings

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)) -> User: # Menambahkan return type hint
    """
    Dependency untuk memverifikasi token JWT dan mendapatkan data pengguna.
    """
    try:
        user_response = supabase.auth.get_user(token)

        # --- PERBAIKAN DI SINI ---
        # Periksa apakah user_response dan user_response.user ada sebelum melanjutkan
        if user_response and user_response.user:
            return user_response.user
        # -------------------------

        # Jika karena alasan aneh user tidak ditemukan, lempar error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        # Jika ada error apapun (misal, token kadaluarsa, format salah), tolak akses.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )