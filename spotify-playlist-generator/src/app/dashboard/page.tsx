'use client';

import Playlists from '../../components/Playlists';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    //check if token has expired
    const token = localStorage.getItem('spotify_access_token');
    const expiresAt = localStorage.getItem('spotify_token_expires_at');
    if (!token || !expiresAt || new Date().getTime() > parseInt(expiresAt)) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Playlists</h1>
      <Playlists />
    </div>
  );
} 