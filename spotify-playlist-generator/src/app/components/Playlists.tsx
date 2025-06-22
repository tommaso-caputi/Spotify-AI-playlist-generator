'use client';

import { useState, useEffect } from 'react';

interface Playlist {
  id: string;
  name: string;
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const token = localStorage.getItem('spotify_access_token');
      if (token) {
        try {
          const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            // Handle error, e.g. token expired
            // For now, just log it
            console.error('Failed to fetch playlists');
            // Maybe clear token and redirect to login
            return;
          }

          const data = await response.json();
          setPlaylists(data.items);
        } catch (error) {
          console.error('Error fetching playlists:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return <p>Loading playlists...</p>;
  }

  return (
    <ul>
      {playlists.map(playlist => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
} 