import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import './UploadPage.css';
import { FaFileUpload, FaCheckCircle } from 'react-icons/fa';

const UploadPage = () => {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [musicFile, setMusicFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // State baru untuk pesan status dengan ID unik untuk animasi
    const [status, setStatus] = useState({ message: '', key: 0 });

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await apiClient.post('/music/upload-file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data.file_path;
    };

    // Helper untuk mengubah pesan status dengan animasi
    const updateStatus = (message) => {
        setStatus(prevStatus => ({ message, key: prevStatus.key + 1 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!musicFile || !title || !artist) {
            updateStatus('Title, Artist, and Music File are required.');
            return;
        }

        setIsUploading(true);
        updateStatus('Wait a minute mann...');

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Jeda dramatis
            updateStatus('Almost...');
            const musicPath = await uploadFile(musicFile);

            let coverPath = null;
            if (coverFile) {
                updateStatus('Uploading the art...');
                coverPath = await uploadFile(coverFile);
            }
            
            updateStatus('Saving details...');
            const duration = Math.floor(Math.random() * (300 - 180 + 1) + 180);
            await apiClient.post('/music/', {
                title, artist_name: artist, file_path: musicPath,
                cover_art_path: coverPath, duration_seconds: duration
            });

            updateStatus('Upload completed, bud!!');
            
            // Reset form setelah beberapa saat agar user bisa melihat pesan sukses
            setTimeout(() => {
                setTitle('');
                setArtist('');
                document.getElementById('musicFile').value = '';
                document.getElementById('coverFile').value = '';
                setMusicFile(null);
                setCoverFile(null);
                updateStatus(''); // Hapus pesan status
            }, 2000);

        } catch (error) {
            console.error('Upload failed:', error);
            updateStatus(`Upload failed: ${error.response?.data?.detail || error.message}`);
        } finally {
            // Kita biarkan isUploading tetap true sampai animasi selesai
            setTimeout(() => setIsUploading(false), 2000);
        }
    };

    return (
        <>
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
                
                <div className="form-group-row">
                    <div className="form-group custom-file-input">
                        <label>Music File (MP3, WAV)</label>
                        <label htmlFor="musicFile" className="file-label">
                            <FaFileUpload />
                            <span>{musicFile ? 'File Chosen' : 'Choose File'}</span>
                        </label>
                        <input type="file" id="musicFile" accept="audio/*" onChange={e => setMusicFile(e.target.files[0])} disabled={isUploading} required />
                        {musicFile && <span className="file-name"><FaCheckCircle /> {musicFile.name}</span>}
                    </div>
                    <div className="form-group custom-file-input">
                        <label>Cover Art (JPG, PNG)</label>
                        <label htmlFor="coverFile" className="file-label">
                            <FaFileUpload />
                            <span>{coverFile ? 'File Chosen' : 'Choose File'}</span>
                        </label>
                        <input type="file" id="coverFile" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} disabled={isUploading} />
                        {coverFile && <span className="file-name"><FaCheckCircle /> {coverFile.name}</span>}
                    </div>
                </div>

                <button type="submit" className="pixel-button" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
                <div className="status-container">
                    {status.message && (
                        <p key={status.key} className="status-message">
                            {status.message}
                        </p>
                    )}
                </div>  
            </form>
        </>
    );
};

export default UploadPage;