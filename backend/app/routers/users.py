# backend/app/routers/users.py

from fastapi import APIRouter, Depends
from supabase import Client as SupabaseClient # Memberi alias untuk menghindari konflik nama
from app.core.dependencies import get_current_user, supabase

# Membuat instance router. Router seperti sebuah "mini-aplikasi" FastAPI.
router = APIRouter(
    prefix="/users", # Semua endpoint di file ini akan dimulai dengan /users
    tags=["Users"]    # Mengelompokkan endpoint di dokumentasi API
)


@router.get("/me")
def read_users_me(current_user = Depends(get_current_user)):
    """
    Endpoint untuk mendapatkan informasi pengguna yang sedang login.
    `Depends(get_current_user)` akan menjalankan fungsi verifikasi token.
    Jika token valid, `current_user` akan berisi data pengguna.
    Jika tidak valid, fungsi tersebut akan menghasilkan error 401 dan kode ini tidak akan pernah dijalankan.
    """
    # Di sini kita bisa menambahkan logika untuk mengambil profil dari tabel public.profiles jika perlu
    # profile_response = supabase.table('profiles').select('*').eq('id', current_user.id).single().execute()
    
    # Untuk sekarang, kita kembalikan saja data user dari token
    return {
        "id": current_user.id,
        "email": current_user.email,
        "aud": current_user.aud,
        "role": current_user.role,
        "created_at": current_user.created_at,
    }