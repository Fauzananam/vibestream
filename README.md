# 🎵 VibeStream

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-yellow.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)](https://fastapi.tiangolo.com/)

VibeStream is a modern, open-source music streaming web application with a unique retro-pixel aesthetic. It allows users to upload their own music, create public or private playlists, and enjoy a seamless listening experience with a persistent, floating music player. The project is built with a powerful Python backend and a dynamic React frontend.

## ✨ Key Features

*   **Google OAuth Authentication**: Secure and easy login for users.
*   **Multi-Role User System**:
    *   **User**: Can upload music, create public/private playlists.
    *   **Admin**: Helps moderate public content.
    *   **Owner**: Has full control, including user role management.
*   **Music Upload**: Users can upload their own audio files and cover art.
*   **Playlist Creation**: Full-featured playlist system with `public` and `private` visibility settings, respecting user privacy.
*   **Floating Music Player**: A persistent, feature-rich player that continues playback across all pages, including progress bar, next/previous, and skip controls.
*   **Secure Admin Panel**: An exclusive panel for the `owner` to manage user roles.
*   **Modern-Retro UI**: A unique user interface that blends modern layout principles with pixel-perfect fonts and retro-style elements.
*   **Interactive Notifications**: User-friendly toast notifications and sound effects for a more engaging experience.

## 🛠️ Technology Stack

| Area      | Technology                                                                                                  |
| :-------- | :---------------------------------------------------------------------------------------------------------- |
| **Frontend**  | **React.js**, **Vite**, **Zustand** (State Management), **React Router**, **Axios**, **react-hot-toast**, **CSS3** |
| **Backend**   | **Python**, **FastAPI** (Web Framework), **Uvicorn** (ASGI Server)                                              |
| **Database & Services** | **Supabase** (PostgreSQL Database, Authentication, Storage), **Row Level Security (RLS)**             |

## 🚀 Getting Started

Follow these instructions to get a local copy of VibeStream up and running for development.

### Prerequisites

*   **Node.js** (v18 or newer) and **npm**
*   **Python** (v3.11 or newer)
*   A free **Supabase** account
*   A **Google Cloud Platform** account to set up OAuth credentials

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Fauzananam/vibestream.git
    cd vibestream
    ```

2.  **Setup Supabase**
    *   Create a new project on [Supabase](https://supabase.com/).
    *   Navigate to the **SQL Editor** and run all the SQL scripts created during the project to set up tables (`profiles`, `music`, `playlists`), triggers, and Row Level Security (RLS) policies.
    *   Navigate to **Storage** and create a new **public** bucket named `vibe-storage`. Set up the access policies as defined in the project steps.

3.  **Setup Google OAuth**
    *   Go to the Google Cloud Console and create a new project.
    *   Navigate to **APIs & Services > OAuth consent screen**, configure it for **External** users, and add the required app information.
    *   Go to **Credentials**, create a new **OAuth 2.0 Client ID** for a **Web application**.
    *   Add your Supabase callback URL to the "Authorized redirect URIs". You can find this URL in your Supabase project under **Authentication > Providers > Google**.
    *   Copy your **Client ID** and **Client Secret**.
    *   In your Supabase project, go to **Authentication > Providers > Google**, enable it, and paste your Client ID and Secret.

4.  **Configure Environment Variables**
    *   In the `backend/` folder, create a `.env` file and add your Supabase credentials:
        ```env
        # backend/.env
        SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
        SUPABASE_SERVICE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
        ```
    *   In the `frontend/` folder, create a `.env.local` file:
        ```env
        # frontend/.env.local
        VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
        VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
        ```

5.  **Run the Project Setup Script**
    This script will create a Python virtual environment and install all required backend and frontend dependencies.
    ```bash
    chmod +x startproject.sh
    ./startproject.sh
    ```

6.  **Set Your Role to Owner**
    To access the Admin Panel, you must manually set your role.
    *   Sign up for your application using Google login.
    *   Go to your Supabase **Table Editor**, open the `profiles` table.
    *   Find the row corresponding to your user and change the value in the `role` column from `user` to `owner`.

7.  **Run the Development Servers**
    This will start both the Python backend and the React frontend concurrently.
    ```bash
    chmod +x startdev.sh
    ./startdev.sh
    ```
    *   Backend will be available at `http://127.0.0.1:8000`
    *   Frontend will be available at `http://localhost:5173`

## 📜 License & Disclaimers

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

### Credit & Attribution

You are free to use, modify, and distribute this software. However, if you use a substantial portion of this project's source code for your own works, **crediting the original author is kindly requested.** Please include a link back to this repository.

### ⚠️ Music Content Disclaimer

The owner and contributors of the VibeStream project **do not claim any ownership or credit for the audio content uploaded to the platform** by its users. All responsibility for the uploaded content, including copyright and licensing, lies solely with the user who uploads it. This project is provided as an open-source template and is not responsible for how it is used or the content managed by it.

## ✍️ Author

*   **[Fauzananam]** - *Initial work & Project Lead* - [Fauzananam](https://github.com/Fauzananam)