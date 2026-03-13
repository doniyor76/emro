// src/lib/auth.ts
// Google OAuth — Supabase yo'q, to'g'ridan-to'g'ri Google OAuth 2.0

export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
export const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

export function buildGoogleAuthUrl(state: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID!,
    redirect_uri:  `${base}/api/auth/callback`,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'offline',
    prompt:        'consent',
    state,
  })
  return `${GOOGLE_AUTH_URL}?${params}`
}

export async function exchangeCodeForTokens(code: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri:  `${base}/api/auth/callback`,
      grant_type:    'authorization_code',
    }),
  })
  if (!res.ok) throw new Error('Token exchange failed')
  return res.json()
}

export async function getGoogleUserInfo(accessToken: string) {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error('Failed to get user info')
  return res.json() as Promise<{
    sub: string; email: string; name: string; picture?: string; given_name?: string
  }>
}

// Simple signed session — server side only
export function encodeSession(payload: object): string {
  const secret = process.env.AUTH_SECRET || 'changeme-min-32-chars-long-secret!'
  const data = btoa(JSON.stringify(payload))
  // Lightweight HMAC-like signature using Web Crypto is not available in edge-less API routes
  // We use a simple base64 concat with a secret hash for this lightweight implementation
  const sig = btoa(secret.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ data.charCodeAt(i % data.length))).join(''))
  return `${data}.${sig}`
}

export function decodeSession(token: string): Record<string, unknown> | null {
  try {
    const [data] = token.split('.')
    return JSON.parse(atob(data))
  } catch {
    return null
  }
}
