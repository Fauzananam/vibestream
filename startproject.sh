#!/bin/bash

echo "🚀 Memulai setup proyek VibeStream (Versi 2.0)..."

# === BACKEND SETUP ===
echo "🐍 Menyiapkan Backend Python..."
cd backend

# Membuat virtual environment
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "Gagal membuat venv. Pastikan python3 dan python3-venv terinstall."
    exit 1
fi

# Mengaktifkan venv dan menginstall dependensi
# (Tidak perlu diaktifkan di skrip, pip bisa dipanggil langsung)
./venv/bin/pip install "fastapi[all]" python-dotenv supabase
echo "✅ Backend Python siap di folder 'backend/'."
echo "   Jangan lupa untuk membuat file .env di dalam folder backend."
echo "" # Baris baru untuk kerapian

# === FRONTEND SETUP ===
echo "⚛️ Menyiapkan Frontend React..."
cd ../frontend

# Langkah 1: Inisialisasi proyek React menggunakan Vite di folder saat ini
npm create vite@latest . -- --template react
if [ $? -ne 0 ]; then
    echo "Gagal menginisialisasi proyek Vite. Pastikan Node.js dan npm terinstall."
    exit 1
fi

# Langkah 2: Menginstall dependensi Node.js
npm install
if [ $? -ne 0 ]; then
    echo "Gagal menjalankan npm install."
    exit 1
fi

echo "✅ Frontend React siap di folder 'frontend/'."
echo "   Jangan lupa untuk membuat file .env.local di dalam folder frontend."
echo ""

cd ..
echo "🎉 Setup Proyek Selesai! 🎉"
echo "Langkah selanjutnya:"
echo "1. Pastikan proyek di Supabase sudah dibuat."
echo "2. Isi file 'backend/.env' dan 'frontend/.env.local' dengan kunci API Anda."
echo "3. Jalankan './startdev.sh' untuk memulai development."