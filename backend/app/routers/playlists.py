from fastapi import APIRouter, Depends, HTTPException
from gotrue.types import User
from app.core.dependencies import get_current_user, supabase
from app.models.playlist import PlaylistCreate, AddMusicRequest
import uuid

router = APIRouter(
    prefix="/playlists",
    tags=["Playlists"]
)

@router.post("/")
def create_playlist(
    playlist_data: PlaylistCreate,
    current_user: User = Depends(get_current_user)
):
    """Membuat playlist baru untuk pengguna yang sedang login."""
    res = supabase.table('playlists').insert({
        'name': playlist_data.name,
        'description': playlist_data.description,
        'visibility': playlist_data.visibility,
        'creator_id': current_user.id
    }).execute()

    if res.data:
        return res.data[0]
    raise HTTPException(status_code=400, detail="Could not create playlist.")

@router.get("/mine")
def get_my_playlists(current_user: User = Depends(get_current_user)):
    """Mengambil semua playlist yang dibuat oleh pengguna saat ini."""
    # RLS akan secara otomatis memfilter ini, tetapi kita bisa lebih eksplisit
    res = supabase.table('playlists').select('*').eq('creator_id', current_user.id).execute()
    return res.data

@router.get("/{playlist_id}")
def get_playlist_details(playlist_id: uuid.UUID):
    """Mengambil detail sebuah playlist, termasuk daftar lagunya."""
    # Gunakan join implisit Supabase untuk mengambil lagu terkait
    res = supabase.table('playlists').select(
        '*, playlist_music(music(*))'
    ).eq('id', playlist_id).single().execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Playlist not found")

    playlist = res.data
    
    # Sama seperti di /music, kita perlu membuat URL publik untuk setiap lagu
    base_url = f"{supabase.supabase_url}/storage/v1/object/public/vibe-storage/"
    
    # Data lagu ada di dalam 'playlist_music', kita perlu merapikannya
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

@router.post("/{playlist_id}/add-music")
def add_music_to_playlist(
    # Ubah tipe data dari str menjadi uuid.UUID
    playlist_id: uuid.UUID, 
    request: AddMusicRequest,
    current_user: User = Depends(get_current_user)
):
    """Menambahkan sebuah lagu ke dalam sebuah playlist."""
    # Sekarang, `playlist_id` adalah objek UUID yang valid, bukan lagi string.
    # Kode di bawah ini tidak perlu diubah.
    res = supabase.table('playlist_music').insert({
        'playlist_id': str(playlist_id), # Konversi kembali ke string saat mengirim ke Supabase
        'music_id': str(request.music_id),
    }).execute()

    if res.data:
        return res.data[0]
    
    # Cek error duplikasi lewat pesan error
    if res.error and "duplicate" in res.error.message.lower():
        raise HTTPException(status_code=409, detail="This song is already in the playlist.")
    
    raise HTTPException(status_code=400, detail="Could not add music to playlist.")