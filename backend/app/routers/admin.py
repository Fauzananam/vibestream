from fastapi import APIRouter, Depends, HTTPException, status
from gotrue.types import User
import uuid
from app.core.dependencies import get_current_user, supabase
from app.models.admin import SetRoleRequest

router = APIRouter(prefix="/admin", tags=["Admin"])

# Dependency KHUSUS untuk memeriksa apakah pengguna adalah OWNER
def get_owner(current_user: User = Depends(get_current_user)):
    user_profile = supabase.table('profiles').select('role').eq('id', str(current_user.id)).single().execute()
    if not user_profile.data or user_profile.data['role'] != 'owner':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to perform this action.")
    return user_profile.data

@router.get("/users", dependencies=[Depends(get_owner)])
def get_all_users():
    """Mengambil daftar semua pengguna. Hanya bisa diakses oleh Owner."""
    res = supabase.table('profiles').select('id, username, role').execute()
    return res.data

@router.put("/users/{user_id}/role", dependencies=[Depends(get_owner)])
def set_user_role(user_id: uuid.UUID, payload: SetRoleRequest):
    """Mengatur peran seorang pengguna. Hanya bisa diakses oleh Owner."""
    res = supabase.table('profiles').update({
        'role': payload.role
    }).eq('id', str(user_id)).execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="User not found.")
    return res.data[0]