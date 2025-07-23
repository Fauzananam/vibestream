import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './MyMusicPage.css';
import { FaPlus } from 'react-icons/fa';

const MyMusicPage = () => {
    // State untuk menyimpan data dari API
    const [myUploads, setMyUploads] = useState([]);
    const [myPlaylists, setMyPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State untuk mengontrol UI form pembuatan playlist
    const [showForm, setShowForm] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
    const [newPlaylistVisibility, setNewPlaylistVisibility] = useState('public');

    // State untuk mengontrol modal "Add to Playlist"
    const [songToAdd, setSongToAdd] = useState(null);

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const [uploadsRes, playlistsRes] = await Promise.all([
                apiClient.get('/music/'),
                apiClient.get('/playlists/mine')
            ]);
            setMyUploads(uploadsRes.data);
            setMyPlaylists(playlistsRes.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylistName) {
            alert("Playlist name is required.");
            return;
        }
        try {
            await apiClient.post('/playlists/', {
                name: newPlaylistName,
                description: newPlaylistDesc,
                visibility: newPlaylistVisibility
            });
            setShowForm(false);
            setNewPlaylistName('');
            setNewPlaylistDesc('');
            setNewPlaylistVisibility('public');
            fetchAllData();
        } catch (error) {
            console.error("Failed to create playlist:", error);
            alert("Could not create playlist.");
        }
    };

    const handleAddSongToPlaylist = async (playlistId) => {
        if (!songToAdd) return;
        try {
            await apiClient.post(`/playlists/${playlistId}/add-music`, {
                music_id: songToAdd.id
            });
            alert(`Added '${songToAdd.title}' to the playlist!`);
            // Refresh data untuk melihat perubahan (opsional tapi bagus)
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to add song. It might already be in the playlist.");
        } finally {
            setSongToAdd(null);
        }
    };

    if (isLoading) {
        return <p>Loading your music library...</p>;
    }

    return (
        <>
            <header className="main-header">
                <h2>My Music & Playlists</h2>
                <p>Curate your vibes and share them with the world.</p>
            </header>

            {songToAdd && (
                <div className="add-to-playlist-modal-backdrop" onClick={() => setSongToAdd(null)}>
                    <div className="add-to-playlist-modal" onClick={e => e.stopPropagation()}>
                        <h4>Add "{songToAdd.title}" to...</h4>
                        {myPlaylists.length > 0 ? (
                            myPlaylists.map(pl => (
                                <button key={pl.id} onClick={() => handleAddSongToPlaylist(pl.id)}>
                                    {pl.name} ({pl.visibility})
                                </button>
                            ))
                        ) : (
                            <p>You don't have any playlists yet. Create one first!</p>
                        )}
                    </div>
                </div>
            )}

            <section className="library-section">
                <h3>My Playlists</h3>
                <button className="pixel-button" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Create New Playlist'}
                </button>

                {showForm && (
                    <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
                        <h4>New Playlist Details</h4>
                        <input type="text" placeholder="Playlist Name" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} required />
                        <textarea placeholder="Description (optional)" value={newPlaylistDesc} onChange={e => setNewPlaylistDesc(e.target.value)}></textarea>
                        <div className="visibility-selector">
                            <label>Visibility:</label>
                            <select value={newPlaylistVisibility} onChange={e => setNewPlaylistVisibility(e.target.value)}>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                        </div>
                        <button type="submit">Create Playlist</button>
                    </form>
                )}
                <div style={{ height: '16px' }}></div>
                <div className="playlist-grid">
                    {myPlaylists.map(pl => {
                        // --- PERBAIKAN UTAMA DI SINI ---
                        // Tentukan URL gambar dengan cara yang lebih aman dan bersih
                        const imageUrl = pl.cover_art_path 
                            ? `${SUPABASE_URL}/storage/v1/object/public/vibe-storage/${pl.cover_art_path}` 
                            : 'https://placehold.co/200/2a2a2a/ffffff?text=VibeStream';

                        return (
                            <Link to={`/playlist/${pl.id}`} key={pl.id} className="playlist-card-link">
                                <div className="playlist-card">
                                    <img 
                                        src={imageUrl} 
                                        alt={pl.name} 
                                    />
                                    <h4>{pl.name}</h4>
                                    <span className={`visibility-tag ${pl.visibility}`}>{pl.visibility}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="library-section">
                <h3>My Uploads</h3>
                <div className="uploads-list">
                    {myUploads.length > 0 ? myUploads.map(song => (
                        <div key={song.id} className="upload-item">
                            <span>{song.title} - {song.artist_name}</span>
                            <button onClick={() => setSongToAdd(song)} title="Add to playlist">
                                <FaPlus />
                            </button>
                        </div>
                    )) : (
                        <p>You haven't uploaded any music yet.</p>
                    )}
                </div>
            </section>
        </>
    );
};

export default MyMusicPage;