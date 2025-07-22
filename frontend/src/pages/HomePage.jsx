import React from 'react';
import Sidebar from '../components/Sidebar';
import './HomePage.css';
import MusicCard from '../components/MusicCard'; 

const HomePage = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <h2>Dashboard</h2>
          <p>Welcome back! Here's the latest public music on VibeStream.</p>
        </header>
        
        <div className="music-grid">
          {/* Ini adalah data dummy. Nanti akan kita ganti dengan data dari API */}
          <MusicCard title="Pixel Paradise" artist="Synthwave Kid" />
          <MusicCard title="8-Bit Adventure" artist="Chip Tune" />
          <MusicCard title="Sunset Drive" artist="RetroWave" />
          <MusicCard title="Neon Nights" artist="VaporFunk" />
        </div>
      </main>
    </div>
  );
};

export default HomePage;