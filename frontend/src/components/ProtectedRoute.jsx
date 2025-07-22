import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { session } = useAuth();

  // Jika ada sesi (user sudah login), tampilkan konten halaman (Outlet).
  // Jika tidak, arahkan ke halaman login.
  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;