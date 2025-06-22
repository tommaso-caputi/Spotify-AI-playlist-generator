import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, refresh_token } = body;
  const codeVerifier = request.cookies.get('spotify_code_verifier')?.value;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return new NextResponse('Missing Spotify credentials', { status: 500 });
  }

  const params = new URLSearchParams();
  params.append('client_id', clientId);

  if (refresh_token) {
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);
  } else if (code) {
    if (!codeVerifier) {
      return new NextResponse('Code verifier not found', { status: 400 });
    }
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
    params.append('code_verifier', codeVerifier);
  } else {
    return new NextResponse('Invalid request: code or refresh_token must be provided', { status: 400 });
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      },
      body: params,
    });

    const data = await response.json();

    if (!response.ok) {
      return new NextResponse(JSON.stringify(data), { status: response.status });
    }

    if (code) {
      const responseWithCookie = NextResponse.json(data);
      responseWithCookie.cookies.delete('spotify_code_verifier');
      return responseWithCookie;
    }

    return NextResponse.json(data);

  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 