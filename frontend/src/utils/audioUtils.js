// Pastikan AudioContext dibuat hanya sekali untuk efisiensi
let audioContext;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Memainkan suara sederhana menggunakan Web Audio API.
 * @param {'confirm' | 'cancel' | 'success' | 'error'} type - Tipe suara yang akan dimainkan.
 */
export const playSoundEffect = (type) => {
  try {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    const soundProfiles = {
      // Suara 'blip' netral untuk konfirmasi
      confirm: { frequency: 600, type: 'triangle', duration: 0.1 },
      // Suara 'bloop' rendah untuk pembatalan
      cancel: { frequency: 300, type: 'sawtooth', duration: 0.15 },
      // Suara 'ping' tinggi untuk sukses
      success: { frequency: 800, type: 'sine', duration: 0.2 },
      // Suara 'buzz' error
      error: { frequency: 200, type: 'square', duration: 0.3 },
    };

    const profile = soundProfiles[type] || soundProfiles.confirm;

    oscillator.type = profile.type;
    oscillator.frequency.setValueAtTime(profile.frequency, context.currentTime);
    gainNode.gain.setValueAtTime(0.1, context.currentTime); // Volume awal

    // Efek fade out yang cepat
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + profile.duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + profile.duration);
  } catch (e) {
    console.error("Web Audio API is not supported in this browser or failed to play sound.", e);
  }
};