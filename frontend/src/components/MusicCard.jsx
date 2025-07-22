import React from 'react';
import './MusicCard.css';
import { FaPlay } from 'react-icons/fa';

// Gunakan gambar placeholder dari situs seperti placeholder.com
const placeholderCover = 'https://via.placeholder.com/250/1a1a1a/ffffff?text=VibeStream';

const MusicCard = ({ title, artist, coverUrl }) => {
  return (
    <div className="music-card">
      <div className="cover-art-container">
        <img src={coverUrl || placeholderCover} alt={`Cover for ${title}`} />
        <button className="play-button">
          <FaPlay />
        </button>
      </div>
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        <p className="card-artist">{artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;