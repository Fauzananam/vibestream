import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  // STATE
  playlist: [],      // Antrian lagu saat ini
  currentMusic: null,  // Lagu yang sedang aktif
  currentIndex: null,  // Index lagu yang sedang aktif di dalam playlist
  isPlaying: false,

  // ACTIONS
  playMusic: (music, playlist) => {
    // Cari index lagu yang di-klik di dalam playlist yang diberikan
    const newIndex = playlist.findIndex(item => item.id === music.id);
    set({
      currentMusic: music,
      playlist: playlist,
      currentIndex: newIndex,
      isPlaying: true,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  playNext: () => {
    const { playlist, currentIndex } = get();
    if (playlist.length > 0) {
      // Gunakan modulo untuk kembali ke awal jika di akhir playlist
      const nextIndex = (currentIndex + 1) % playlist.length;
      set({
        currentMusic: playlist[nextIndex],
        currentIndex: nextIndex,
        isPlaying: true,
      });
    }
  },

  playPrevious: () => {
    const { playlist, currentIndex } = get();
    if (playlist.length > 0) {
      // Gunakan modulo untuk kembali ke akhir jika di awal playlist
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      set({
        currentMusic: playlist[prevIndex],
        currentIndex: prevIndex,
        isPlaying: true,
      });
    }
  },
}));