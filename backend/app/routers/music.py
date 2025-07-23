import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from gotrue.types import User

from app.core.dependencies import get_current_user, supabase
from app.models.music import MusicCreate

router = APIRouter(
    prefix="/music",
    tags=["Music"]
)

BUCKET_NAME = "vibe-storage"

# ---ENDPOINT 1: GET SEMUA MUSIK---
@router.get("/")
def get_all_music():
    try:
        response = supabase.table('music').select('*').order('created_at', desc=True).execute()
        base_url = f"{supabase.supabase_url}/storage/v1/object/public/{BUCKET_NAME}/"
        for item in response.data:
            if item.get('file_path'):
                item['file_url'] = f"{base_url}{item['file_path']}"
            if item.get('cover_art_path'):
                item['cover_art_url'] = f"{base_url}{item['cover_art_path']}"
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---ENDPOINT 2: SIMPAN METADATA---
@router.post("/")
def upload_music_metadata(
    music_data: MusicCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        data_to_insert = music_data.model_dump()
        data_to_insert['uploader_id'] = current_user.id
        response = supabase.table('music').insert(data_to_insert).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not save music metadata: {str(e)}")

# ---ENDPOINT 3: UPLOAD FILE---
@router.post("/upload-file")
def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        if not file.content_type:
            raise HTTPException(status_code=400, detail="File content type is missing")
        file_path = f"{current_user.id}/{uuid.uuid4()}-{file.filename}"
        contents = file.file.read()
        supabase.storage.from_(BUCKET_NAME).upload(
            path=file_path, file=contents, file_options={"content-type": file.content_type}
        )
        return {"file_path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")