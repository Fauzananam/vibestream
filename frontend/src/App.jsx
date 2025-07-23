import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import MyMusicPage from './pages/MyMusicPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext'; 
function App() {
  const { session } = useAuth();

  // Tampilkan layout utama jika ada sesi, jika tidak, hanya tampilkan rute publik
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          className: '',
          style: {
            margin: '40px',
            background: '#333',
            color: '#fff',
            border: '2px solid #555',
          },
        }}
      />

      {session ? (
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/my-music" element={<MyMusicPage />} />
                <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
              </Route>
              <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
          </main>
          <MusicPlayer />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Arahkan semua rute lain ke login jika tidak ada sesi */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;