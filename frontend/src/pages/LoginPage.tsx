import React from 'react';
import { supabase } from '../supabaseClient';
import './LoginPage.css'; // Css login page

const LoginPage = () => {

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Arahkan pengguna ke halaman utama setelah login berhasil
          redirectTo: window.location.origin, 
        },
      });

      if (error) {
        console.error('Error logging in with Google:', error);
        alert('Error logging in: ' + error.message);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="title">VibeStream</h1>
        <p className="subtitle">[ Press Login to Start ]</p>
        <button className="pixel-button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;