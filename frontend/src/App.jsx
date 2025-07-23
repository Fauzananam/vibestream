import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import { useAuth } from './context/AuthContext'; 
function App() {
  const { session } = useAuth(); // Dapatkan status sesi

  // Tampilkan layout utama jika ada sesi, jika tidak, hanya tampilkan rute publik
  return (
    <>
      {session ? (
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
              </Route>
              <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
          </main>
          <MusicPlayer /> {/* Player sekarang berada di layout utama */}
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