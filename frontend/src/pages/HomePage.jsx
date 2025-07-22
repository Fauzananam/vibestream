import React from 'react';
import { useAuth } from '../context/AuthContext';
import './HomePage.css'; // Kita akan buat file CSS ini

const HomePage = () => {
  const { userProfile, logout } = useAuth();

  if (!userProfile) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>VibeStream</h1>
        <div className="user-info">
          {/* Tampilkan email, gunakan 'N/A' jika tidak ada */}
          <span>{userProfile.email || 'N/A'}</span>
          {/* Gunakan tombol pixelated yang sudah kita buat sebelumnya */}
          <button className="pixel-button accent" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main className="home-content">
        <h2>Welcome to your Dashboard</h2>
        <p>This is where your music journey begins. Soon you will be able to see playlists, upload music, and more!</p>
        <p>Your user ID is: {userProfile.id}</p>
      </main>
    </div>
  );
};

export default HomePage;