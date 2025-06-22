import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge } from '@/utils/pkce';

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new NextResponse('Missing Spotify credentials', { status: 500 });
  }

  const scope = 'playlist-modify-private playlist-modify-public';
  const authUrl = new URL('https://accounts.spotify.com/authorize');

  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('code_challenge', codeChallenge);

  const response = NextResponse.redirect(authUrl);

  response.cookies.set('spotify_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return response;
} 