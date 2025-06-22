const getNewAccessToken = async () => {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) {
    // Handle case where refresh token is not available
    // e.g., redirect to login
    throw new Error('No refresh token available');
  }

  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await response.json();

  if (data.access_token && data.expires_in) {
    localStorage.setItem('spotify_access_token', data.access_token);
    const expiresAt = new Date().getTime() + data.expires_in * 1000;
    localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
    // A new refresh token might be returned, update if so
    if (data.refresh_token) {
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
    }
    return data.access_token;
  } else {
    // Handle error, maybe redirect to login
    throw new Error('Failed to refresh access token');
  }
};

const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('spotify_token_expires_at');
  if (!expiresAt) return true;
  return new Date().getTime() > parseInt(expiresAt);
};

export const getPlaylists = async () => {
  let token = localStorage.getItem('spotify_access_token');

  if (!token || isTokenExpired()) {
    try {
      token = await getNewAccessToken();
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Handle scenario where token refresh fails, e.g., redirect to login
      // For now, we'll just re-throw the error
      throw error;
    }
  }

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
    throw new Error('Failed to fetch playlists');
  }

  const data = await response.json();
  return data.items;
}; 