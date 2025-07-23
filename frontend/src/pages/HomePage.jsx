import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import Sidebar from '../components/Sidebar';
import MusicCard from '../components/MusicCard';
import MusicPlayer from '../components/MusicPlayer';
import { usePlayerStore } from '../store/playerStore';
import './HomePage.css';

const HomePage = () => {
  const [musicList, setMusicList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playMusic } = usePlayerStore();

  useEffect(() => {
    apiClient.get('/music/')
      .then(response => {
        // Filter data yang tidak valid sebelum menyimpannya ke state
        const validMusic = response.data.filter(item => item && item.id);
        setMusicList(validMusic);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch music:", error);
        setIsLoading(false);
      });
  }, []);

  const handlePlayMusic = (music) => {
    // Panggil aksi dari store dengan lagu yang di-klik dan seluruh daftar lagu
    playMusic(music, musicList);
  };

  return (
    <> {/* Gunakan Fragment karena layout utama sudah ada di App.jsx */}
      <header className="main-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's the latest public music on VibeStream.</p>
      </header>
      
      {isLoading ? <p>Loading music...</p> : (
        <div className="music-grid">
          {musicList.map(music => (
            <MusicCard 
              key={music.id} 
              music={music} 
              onPlay={handlePlayMusic} // Teruskan fungsi handler ke kartu
            />
          ))}
        </div>
      )}
    </>
  );
};

export default HomePage;