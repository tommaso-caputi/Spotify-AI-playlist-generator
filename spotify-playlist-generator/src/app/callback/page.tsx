'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Spotify login error:', error);
      router.push('/');
      return;
    }

    if (code) {
      fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('spotify_access_token', data.access_token);
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
            router.push('/');
          } else {
            console.error('Failed to get access token');
            router.push('/');
          }
        });
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging you in...</p>
    </div>
  );
} 