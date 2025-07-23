from fastapi import APIRouter, Depends, HTTPException
from gotrue.types import User
import uuid

# Impor dependensi dan model Pydantic kita
from app.core.dependencies import get_current_user, supabase
from app.models.playlist import PlaylistCreate, AddMusicRequest

# Membuat instance router khusus untuk playlist
router = APIRouter(
    prefix="/playlists",
    tags=["Playlists"]
)

@router.post("/")
def create_playlist(
    playlist_data: PlaylistCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Membuat playlist baru untuk pengguna yang sedang login.
    Menerima nama, deskripsi (opsional), dan visibilitas.
    """
    try:
        res = supabase.table('playlists').insert({
            'name': playlist_data.name,
            'description': playlist_data.description,
            'visibility': playlist_data.visibility,
            'creator_id': str(current_user.id) # Pastikan ID adalah string
        }).execute()

        if res.data:
            return res.data[0]
        # Jika ada error dari Supabase (misal, RLS menolak)
        raise HTTPException(status_code=400, detail=res.error.message if res.error else "Could not create playlist.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/mine")
def get_my_playlists(current_user: User = Depends(get_current_user)):
    """
    Mengambil semua playlist yang dibuat oleh pengguna saat ini.
    Row Level Security (RLS) di Supabase sudah melindungi ini,
    namun filter eksplisit ini adalah praktik yang baik.
    """
    try:
        res = supabase.table('playlists').select('*').eq('creator_id', str(current_user.id)).order('created_at', desc=True).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{playlist_id}")
def get_playlist_details(playlist_id: uuid.UUID):
    """
    Mengambil detail sebuah playlist, termasuk daftar lagunya.
    Menggunakan join implisit Supabase untuk mengambil lagu terkait.
    """
    try:
        res = supabase.table('playlists').select(
            '*, playlist_music(music(*))' # Ini adalah sintaks join Supabase
        ).eq('id', str(playlist_id)).single().execute()

        if not res.data:
            raise HTTPException(status_code=404, detail="Playlist not found")

        playlist = res.data
        
        base_url = f"{supabase.supabase_url}/storage/v1/object/public/vibe-storage/"
        
        # Data lagu mentah ada di dalam 'playlist_music', kita perlu merapikannya
        songs = []
        for item in playlist.get('playlist_music', []):
            song = item.get('music')
            if song:
                if song.get('file_path'):
                    song['file_url'] = f"{base_url}{song['file_path']}"
                if song.get('cover_art_path'):
                    song['cover_art_url'] = f"{base_url}{song['cover_art_path']}"
                songs.append(song)
        
        playlist['songs'] = songs
        del playlist['playlist_music'] # Hapus data mentah yang tidak rapi

        return playlist
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{playlist_id}/add-music")
def add_music_to_playlist(
    playlist_id: uuid.UUID, # Menggunakan tipe UUID untuk validasi otomatis
    request: AddMusicRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Menambahkan sebuah lagu ke dalam sebuah playlist.
    """
    try:
        # Kita bisa menambahkan cek di sini untuk memastikan user adalah pemilik playlist
        # Tapi RLS sudah seharusnya menangani ini di level database
        res = supabase.table('playlist_music').insert({
            'playlist_id': str(playlist_id),
            'music_id': str(request.music_id),
        }).execute()

        if res.data:
            return res.data[0]
        
        # Berikan pesan error yang lebih baik jika lagu sudah ada
        if res.error and 'duplicate key value' in res.error.message:
            raise HTTPException(status_code=409, detail="This song is already in the playlist.")
        
        raise HTTPException(status_code=400, detail=res.error.message if res.error else "Could not add music to playlist.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))