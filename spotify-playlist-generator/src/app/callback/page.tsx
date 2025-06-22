'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CallbackContent() {
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
          if (data.access_token && data.expires_in) {
            localStorage.setItem('spotify_access_token', data.access_token);
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
            const expiresAt = new Date().getTime() + data.expires_in * 1000;
            localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
            router.push('/dashboard');
          } else {
            console.error('Failed to get access token');
            router.push('/');
          }
        });
    }
  }, [searchParams, router]);

  return null;
}

export default function Callback() {
  return (
    <Suspense>
      <div className="flex items-center justify-center h-screen">
        <p>Logging you in...</p>
      </div>
      <CallbackContent />
    </Suspense>
  );
} 