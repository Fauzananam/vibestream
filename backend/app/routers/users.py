from fastapi import APIRouter, Depends
from gotrue.types import User
from app.core.dependencies import get_current_user, supabase

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Mengambil profil lengkap pengguna, termasuk email dari token.
    """
    profile_response = supabase.table('profiles').select('*').eq('id', str(current_user.id)).single().execute()
    
    # --- PERBAIKAN DI SINI ---
    if profile_response.data:
        # Buat objek baru, gabungkan data profil dengan email dari token
        full_profile = profile_response.data
        full_profile['email'] = current_user.email
        return full_profile
    
    # Fallback jika profil tidak ada, tetap sertakan email
    return { 
        "id": current_user.id, 
        "email": current_user.email, 
        "role": "user",
        "username": None, # Tambahkan field lain agar konsisten
        "avatar_url": None,
    }