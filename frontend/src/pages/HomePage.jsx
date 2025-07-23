import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import Sidebar from '../components/Sidebar';
import MusicCard from '../components/MusicCard';
import MusicPlayer from '../components/MusicPlayer';
import './HomePage.css';

const HomePage = () => {
  const [musicList, setMusicList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <h2>Dashboard</h2>
          <p>Welcome back! Here's the latest public music on VibeStream.</p>
        </header>
        
        {isLoading ? <p>Loading music...</p> : (
          <div className="music-grid">
            {/* 
              Sekarang kita hanya memetakan `musicList` yang sudah dijamin
              berisi item-item yang valid.
            */}
            {musicList.map(music => (
              <MusicCard key={music.id} music={music} />
            ))}
          </div>
        )}
      </main>
      <MusicPlayer />
    </div>
  );
};

export default HomePage;