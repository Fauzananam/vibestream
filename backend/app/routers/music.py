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

# Endpoint untuk menyimpan metadata tetap sama, tidak perlu diubah.
@router.post("/")
def upload_music_metadata(
    music_data: MusicCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Menyimpan metadata lagu ke database setelah file diupload ke storage.
    """
    try:
        data_to_insert = music_data.model_dump()
        data_to_insert['uploader_id'] = current_user.id
        response = supabase.table('music').insert(data_to_insert).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not save music metadata: {str(e)}"
        )