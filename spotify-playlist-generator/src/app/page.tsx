'use client';

import { useState, useEffect } from 'react';
import Playlists from './components/Playlists';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  if (isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
        <Playlists />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
      >
        Login with Spotify
      </button>
    </div>
  );
}
