import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from gotrue.types import User

from app.core.dependencies import get_current_user, supabase
from app.models.music import MusicCreate # Kita tidak butuh SignedUrlResponse lagi

router = APIRouter(
    prefix="/music",
    tags=["Music"]
)

BUCKET_NAME = "vibe-storage" 

# ENDPOINT LAMA DIHAPUS, DIGANTI DENGAN YANG INI
@router.post("/upload-file")
def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Menerima file dari frontend dan menguploadnya langsung ke Supabase Storage.
    Ini adalah alur proxy yang lebih stabil.
    """
    try:
        if not file.content_type:
            raise HTTPException(status_code=400, detail="File content type is missing")

        # Buat path file yang unik
        file_path = f"{current_user.id}/{uuid.uuid4()}-{file.filename}"
        
        # Baca konten file
        contents = file.file.read()

        # Upload ke Supabase Storage
        supabase.storage.from_(BUCKET_NAME).upload(
            path=file_path,
            file=contents,
            file_options={"content-type": file.content_type}
        )
        
        # Kembalikan path yang baru dibuat agar frontend bisa menggunakannya
        return {"file_path": file_path}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not upload file: {str(e)}"
        )

@router.get("/")
def get_all_music():
    """
    Mengambil daftar semua lagu dari database.
    Nanti bisa kita tambahkan paginasi di sini.
    """
    try:
        response = supabase.table('music').select('*').order('created_at', desc=True).execute()
        
        # PENTING: Ubah file_path menjadi URL publik yang bisa diakses
        base_url = f"{supabase.supabase_url}/storage/v1/object/public/{BUCKET_NAME}/"
        
        for item in response.data:
            # Konstruksi URL lengkap untuk file musik
            if item.get('file_path'):
                item['file_url'] = f"{base_url}{item['file_path']}"
            
            # Konstruksi URL lengkap untuk cover art
            if item.get('cover_art_path'):
                item['cover_art_url'] = f"{base_url}{item['cover_art_path']}"

        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))