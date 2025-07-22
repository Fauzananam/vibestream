import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Coba dapatkan sesi yang ada saat komponen pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // Jika ada sesi, ambil profil dari backend kita
      if (session) {
        apiClient.get('/users/me')
          .then(response => setUserProfile(response.data))
          .catch(err => console.error("Error fetching user profile:", err));
      }
      setLoading(false);
    });

    // 2. Dengarkan perubahan status otentikasi (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // Jika sesi baru muncul (setelah login), ambil profil
        if (session) {
          apiClient.get('/users/me')
            .then(response => setUserProfile(response.data))
            .catch(err => console.error("Error fetching user profile:", err));
        } else {
          // Jika sesi hilang (setelah logout), hapus profil
          setUserProfile(null);
        }
      }
    );

    // Bersihkan listener saat komponen dilepas
    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const value = {
    session,
    userProfile,
    logout,
    loading
  };

  // Tampilkan loading screen sederhana sampai sesi selesai diperiksa
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook custom untuk mempermudah penggunaan context ini
export const useAuth = () => {
  return useContext(AuthContext);
};