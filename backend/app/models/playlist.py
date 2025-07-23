from pydantic import BaseModel
import uuid

# Model untuk request pembuatan playlist
class PlaylistCreate(BaseModel):
    name: str
    description: str | None = None
    visibility: str # Akan berisi 'public' atau 'private'

# Model untuk request penambahan musik ke playlist
class AddMusicRequest(BaseModel):
    music_id: uuid.UUID