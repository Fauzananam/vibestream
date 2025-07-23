import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  currentMusic: null, // Berisi objek lagu { id, title, artist, file_url, cover_art_url }
  isPlaying: false,
  
  // Aksi untuk memulai atau mengganti lagu
  playMusic: (music) => set({ currentMusic: music, isPlaying: true }),

  // Aksi untuk play/pause
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // Aksi untuk menghentikan musik
  stopMusic: () => set({ currentMusic: null, isPlaying: false }),
}));