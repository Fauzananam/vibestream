import React, { useRef, useEffect, useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import './MusicPlayer.css';
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa';

// Helper untuk format waktu
const formatTime = (seconds) => {
  if (isNaN(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const { currentMusic, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      isPlaying ? audio.play().catch(e => console.error(e)) : audio.pause();
    }
  }, [isPlaying, currentMusic]);

  const handleTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSkipForward = () => {
    audioRef.current.currentTime += 10;
  };

  if (!currentMusic) return null;

  return (
    <div className="floating-player">
      <audio
        ref={audioRef}
        src={currentMusic.file_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext} // Otomatis mainkan lagu berikutnya saat selesai
      />
      <img src={currentMusic.cover_art_url || 'https://via.placeholder.com/64'} alt={currentMusic.title} className="player-cover-v2" />
      <div className="player-content">
        <div className="player-info-v2">
          <p className="player-title-v2">{currentMusic.title}</p>
          <p className="player-artist-v2">{currentMusic.artist_name}</p>
        </div>
        <div className="player-controls-v2">
          <button onClick={playPrevious}><FaStepBackward /></button>
          <button className="play-pause-btn" onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={playNext}><FaStepForward /></button>
          <button onClick={handleSkipForward}>+10s</button>
        </div>
        <div className="progress-container">
          <span>{formatTime(progress)}</span>
          <div className="progress-bar-background">
            <div className="progress-bar-foreground" style={{ width: `${(progress / duration) * 100}%` }}></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;