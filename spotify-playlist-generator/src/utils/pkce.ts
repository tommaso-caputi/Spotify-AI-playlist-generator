import crypto from 'crypto';

function base64URLEncode(str: Buffer) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function generateCodeVerifier() {
  return base64URLEncode(crypto.randomBytes(32));
}

export async function generateCodeChallenge(verifier: string) {
  const hashed = crypto.createHash('sha256').update(verifier).digest();
  return base64URLEncode(hashed);
} 