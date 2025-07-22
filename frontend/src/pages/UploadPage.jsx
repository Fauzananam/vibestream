// frontend/src/pages/UploadPage.jsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import apiClient from '../api/apiClient';
// Kita tidak perlu import supabase di sini lagi untuk upload
import './UploadPage.css';

const UploadPage = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [musicFile, setMusicFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    // Fungsi helper untuk mengupload satu file ke backend
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const { data } = await apiClient.post('/music/upload-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data.file_path;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!musicFile || !title || !artist) {
            setStatusMessage('Title, Artist, and Music File are required.');
            return;
        }

        setIsUploading(true);
        setStatusMessage('Starting upload...');

        try {
            // 1. Upload Music File via Backend
            setStatusMessage('Uploading music file...');
            const musicPath = await uploadFile(musicFile);

            // 2. Upload Cover Art (jika ada) via Backend
            let coverPath = null;
            if (coverFile) {
                setStatusMessage('Uploading cover art...');
                coverPath = await uploadFile(coverFile);
            }

            // 3. Simpan metadata ke database
            setStatusMessage('Saving music details...');
            // Dummy duration untuk saat ini
            const duration = Math.floor(Math.random() * (300 - 180 + 1) + 180); 

            await apiClient.post('/music/', {
                title,
                artist_name: artist,
                file_path: musicPath,
                cover_art_path: coverPath,
                duration_seconds: duration
            });

            setStatusMessage('Upload successful!');
            // Reset form
            setTitle('');
            setArtist('');
            // Cara aman untuk mereset input file
            document.getElementById('musicFile').value = '';
            document.getElementById('coverFile').value = '';
            setMusicFile(null);
            setCoverFile(null);

        } catch (error) {
            console.error('Upload failed:', error);
            setStatusMessage(`Upload failed: ${error.response?.data?.detail || error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <header className="main-header">
                    <h2>Upload New Music</h2>
                    <p>Share your vibes with the world.</p>
                </header>
                <form className="upload-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} disabled={isUploading} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="artist">Artist Name</label>
                        <input type="text" id="artist" value={artist} onChange={e => setArtist(e.target.value)} disabled={isUploading} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="musicFile">Music File (MP3, WAV)</label>
                        <input type="file" id="musicFile" accept="audio/*" onChange={e => setMusicFile(e.target.files[0])} disabled={isUploading} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="coverFile">Cover Art (JPG, PNG)</label>
                        <input type="file" id="coverFile" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} disabled={isUploading} />
                    </div>
                    <button type="submit" className="pixel-button" disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                    {statusMessage && <p className="status-message">{statusMessage}</p>}
                </form>
            </main>
        </div>
    );
};

export default UploadPage;