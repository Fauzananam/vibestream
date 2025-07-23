import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { usePlayerStore } from '../store/playerStore';
import './PlaylistDetailPage.css';
import { FaPlay } from 'react-icons/fa';

const PlaylistDetailPage = () => {
    const { id } = useParams(); // Ambil ID dari URL
    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { playMusic } = usePlayerStore();

    useEffect(() => {
        apiClient.get(`/playlists/${id}`)
            .then(response => {
                setPlaylist(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch playlist details:", error);
                setIsLoading(false);
            });
    }, [id]);

    const handlePlaySong = (song) => {
        playMusic(song, playlist.songs);
    };

    if (isLoading) return <p>Loading playlist...</p>;
    if (!playlist) return <p>Playlist not found.</p>;

    const coverUrl = playlist.songs[0]?.cover_art_url || 'https://via.placeholder.com/150';

    return (
        <>
            <header className="playlist-header">
                <img src={coverUrl} alt={playlist.name} className="playlist-cover-large" />
                <div className="playlist-info-large">
                    <h1>{playlist.name}</h1>
                    <p>{playlist.description}</p>
                    <button className="pixel-button" onClick={() => handlePlaySong(playlist.songs[0])}>
                        <FaPlay /> Play
                    </button>
                </div>
            </header>

            <table className="song-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {playlist.songs.map((song, index) => (
                        <tr key={song.id} onDoubleClick={() => handlePlaySong(song)}>
                            <td>{index + 1}</td>
                            <td>{song.title}</td>
                            <td>{song.artist_name}</td>
                            <td>{Math.floor(song.duration_seconds / 60)}:{String(song.duration_seconds % 60).padStart(2, '0')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default PlaylistDetailPage;