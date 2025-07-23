import React from 'react';
import './MusicCard.css';
import { FaPlay } from 'react-icons/fa';
import { usePlayerStore } from '../store/playerStore';

const placeholderCover = 'https://via.placeholder.com/250/1a1a1a/ffffff?text=VibeStream';

const MusicCard = ({ music, onPlay }) => { // Terima 'onPlay' sebagai prop
return (
<div className="music-card" onClick={() => onPlay(music)}> {/* Panggil onPlay saat kartu diklik */}
<div className="cover-art-container">
<img src={music.cover_art_url || placeholderCover} alt={`Cover for ${music.title}`} />
<button className="play-button">
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