from pydantic import BaseModel

class MusicCreate(BaseModel):
    title: str
    artist_name: str
    file_path: str
    cover_art_path: str | None = None
    duration_seconds: int

class SignedUrlResponse(BaseModel):
    signed_url: str
    path: str