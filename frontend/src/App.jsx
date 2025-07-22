
import React from 'react';
// Hapus BrowserRouter dari impor di sini
import { Routes, Route, Navigate } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Hapus pembungkus <Router> dari sini
  return (
    <Routes>
      {/* Rute publik */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute Terproteksi */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        {/* Tambahkan rute terproteksi lainnya di sini nanti */}
      </Route>

      {/* Redirect dari root ke /home */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Rute fallback jika halaman tidak ditemukan */}
      <Route path="*" element={<h1>404: Page Not Found</h1>} />
    </Routes>
  );
}

export default App;