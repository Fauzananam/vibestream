import React, { useRef, useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import './MusicPlayer.css';
import { FaPlay, FaPause } from 'react-icons/fa';

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const { currentMusic, isPlaying, togglePlay } = usePlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentMusic]);

  if (!currentMusic) {
    return null; // Jangan render apapun jika tidak ada musik yang dipilih
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} src={currentMusic.file_url} />
      <img src={currentMusic.cover_art_url || 'https://via.placeholder.com/64'} alt={currentMusic.title} className="player-cover" />
      <div className="player-info">
        <p className="player-title">{currentMusic.title}</p>
        <p className="player-artist">{currentMusic.artist_name}</p>
      </div>
      <button className="player-control" onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
};

export default MusicPlayer;