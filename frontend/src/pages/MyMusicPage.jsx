import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './MyMusicPage.css';
import { FaPlus, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyMusicPage = () => {
    const [myUploads, setMyUploads] = useState([]);
    const [myPlaylists, setMyPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State untuk mengontrol modal
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
    const [newPlaylistVisibility, setNewPlaylistVisibility] = useState('public');

    const [songToAdd, setSongToAdd] = useState(null);

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

    // Gunakan useCallback agar fungsi tidak dibuat ulang pada setiap render
    const fetchAllData = useCallback(async () => {
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
            toast.error('Could not fetch your library.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylistName) return toast.error("Playlist name is required.");
        
        setIsSubmitting(true);
        const toastId = toast.loading('Creating playlist...');

        try {
            await apiClient.post('/playlists/', {
                name: newPlaylistName,
                description: newPlaylistDesc,
                visibility: newPlaylistVisibility
            });
            toast.success('Playlist created!', { id: toastId });
            
            setIsPlaylistModalOpen(false);
            setNewPlaylistName('');
            setNewPlaylistDesc('');
            setNewPlaylistVisibility('public');
            fetchAllData();
        } catch (error) {
            console.error("Failed to create playlist:", error);
            toast.error(`Error: ${error.response?.data?.detail || 'Could not create playlist.'}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddSongToPlaylist = async (playlistId) => {
        if (!songToAdd) return;

        const toastId = toast.loading(`Adding '${songToAdd.title}'...`);
        try {
            await apiClient.post(`/playlists/${playlistId}/add-music`, {
                music_id: songToAdd.id
            });
            toast.success('Song added!', { id: toastId });
            fetchAllData();
        } catch (error) {
            console.error(error);
            toast.error(`Error: ${error.response?.data?.detail || 'Failed to add song.'}`, { id: toastId });
        } finally {
            setSongToAdd(null);
        }
    };

    if (isLoading) return <div className="loading-container"><p>Loading your music library...</p></div>;

    return (
        <>
            {/* --- MODAL UNTUK BUAT PLAYLIST --- */}
            {isPlaylistModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsPlaylistModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
                            <button type="button" className="close-modal-btn" onClick={() => setIsPlaylistModalOpen(false)}><FaTimes /></button>
                            <h3>Create New Playlist</h3>
                            <input type="text" placeholder="Playlist Name" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} required />
                            <textarea placeholder="Description (optional)" value={newPlaylistDesc} onChange={e => setNewPlaylistDesc(e.target.value)}></textarea>
                            <div className="visibility-selector">
                                <label>Visibility:</label>
                                <select value={newPlaylistVisibility} onChange={e => setNewPlaylistVisibility(e.target.value)}>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                            <button type="submit" className="pixel-button" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Playlist'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL UNTUK TAMBAH LAGU --- */}
            {songToAdd && (
                <div className="modal-backdrop" onClick={() => setSongToAdd(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button type="button" className="close-modal-btn" onClick={() => setSongToAdd(null)}><FaTimes /></button>
                        <h4>Add "{songToAdd.title}" to...</h4>
                        {myPlaylists.length > 0 ? (
                            <div className="playlist-selection-list">
                                {myPlaylists.map(pl => (
                                    <button key={pl.id} className="playlist-select-item" onClick={() => handleAddSongToPlaylist(pl.id)}>
                                        {pl.name} <span className={`visibility-tag small ${pl.visibility}`}>{pl.visibility}</span>
                                    </button>
                                ))}
                            </div>
                        ) : <p>You don't have any playlists yet. Create one first!</p>}
                    </div>
                </div>
            )}

            <header className="main-header">
                <h2>My Music & Playlists</h2>
                <p>Curate your vibes and share them with the world.</p>
            </header>

            <section className="library-section">
                <div className="section-header">
                    <h3>My Playlists</h3>
                    <button className="pixel-button" onClick={() => setIsPlaylistModalOpen(true)}>
                        <FaPlus /> Create New
                    </button>
                </div>
                <div className="playlist-grid">
                    {myPlaylists.map(pl => (
                        <Link to={`/playlist/${pl.id}`} key={pl.id} className="playlist-card-link">
                            <div className="playlist-card">
                                <img 
                                    src={pl.cover_art_path ? `${SUPABASE_URL}/storage/v1/object/public/vibe-storage/${pl.cover_art_path}` : 'https://placehold.co/200/2a2a2a/ffffff?text=VibeStream'} 
                                    alt={pl.name} 
                                />
                                <h4>{pl.name}</h4>
                                <span className={`visibility-tag ${pl.visibility}`}>{pl.visibility}</span>
                            </div>
                        </Link>
                    ))}
                </div>
                {myPlaylists.length === 0 && <p className="empty-state">Your playlists will appear here.</p>}
            </section>

            <section className="library-section">
                <h3>My Uploads</h3>
                <div className="uploads-list">
                    {myUploads.length > 0 ? myUploads.map(song => (
                        <div key={song.id} className="upload-item">
                            <span className="upload-item-title">{song.title} - {song.artist_name}</span>
                            <button onClick={() => setSongToAdd(song)} className="add-btn" title="Add to playlist">
                                <FaPlus />
                            </button>
                        </div>
                    )) : <p className="empty-state">You haven't uploaded any music yet.</p>}
                </div>
            </section>
        </>
    );
};

export default MyMusicPage;