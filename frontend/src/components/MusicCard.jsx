import React from 'react';
import './MusicCard.css';
import { FaPlay } from 'react-icons/fa';
import { usePlayerStore } from '../store/playerStore';

const placeholderCover = 'https://via.placeholder.com/250/1a1a1a/ffffff?text=VibeStream';

const MusicCard = ({ music }) => {
  // Ambil aksi 'playMusic' dari store
  const { playMusic } = usePlayerStore();

  return (
    <div className="music-card">
      <div className="cover-art-container">
        <img src={music.cover_art_url || placeholderCover} alt={`Cover for ${music.title}`} />
        {/* Saat tombol di klik, panggil playMusic dengan data lagu ini */}
        <button className="play-button" onClick={() => playMusic(music)}>
          <FaPlay />
        </button>
      </div>
      <div className="card-info">
        <h3 className="card-title">{music.title}</h3>
        <p className="card-artist">{music.artist_name}</p>
      </div>
    </div>
  );
};

export default MusicCard;