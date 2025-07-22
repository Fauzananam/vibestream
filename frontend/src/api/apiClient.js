import axios from 'axios';
import { supabase } from '../supabaseClient';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // URL Backend FastAPI kita
});

// Interceptor: Ini adalah "middleware" untuk setiap request yang keluar.
// Fungsinya adalah untuk menyisipkan token JWT dari Supabase ke header Authorization.
apiClient.interceptors.request.use(async (config) => {
  // Ambil sesi saat ini dari Supabase
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;