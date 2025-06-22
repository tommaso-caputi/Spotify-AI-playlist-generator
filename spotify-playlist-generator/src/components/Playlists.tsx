'use client';

import { useState, useEffect } from 'react';
import { getPlaylists } from '../utils/spotify';

interface Playlist {
  id: string;
  name: string;
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlistsData = await getPlaylists();
        setPlaylists(playlistsData);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
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