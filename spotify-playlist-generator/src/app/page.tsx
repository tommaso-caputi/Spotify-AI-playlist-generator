'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    const expiresAt = localStorage.getItem('spotify_token_expires_at');
    if (token && expiresAt) {
      if (new Date().getTime() < parseInt(expiresAt)) {
        router.push('/dashboard');
      } else {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_token_expires_at');
      }
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

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
