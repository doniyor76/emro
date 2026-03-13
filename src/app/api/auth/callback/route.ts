// src/app/api/auth/callback/route.ts
// Google OAuth callback — code ni token ga almashtiradi, session cookie yozadi

import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, getGoogleUserInfo, encodeSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const base   = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url    = new URL(req.url)
  const code   = url.searchParams.get('code')
  const state  = url.searchParams.get('state')
  const savedState = req.cookies.get('oauth_state')?.value

  // CSRF check
  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${base}/?auth_error=invalid_state`)
  }

  try {
    const tokens   = await exchangeCodeForTokens(code)
    const userInfo = await getGoogleUserInfo(tokens.access_token)

    const name    = userInfo.name || userInfo.given_name || userInfo.email.split('@')[0]
    const initial = name[0].toUpperCase()
    const joined  = new Date().getFullYear().toString()

    const session = encodeSession({
      email:   userInfo.email,
      name,
      initial,
      avatar:  userInfo.picture ?? '',
      joined,
      iat:     Date.now(),
    })

    const res = NextResponse.redirect(`${base}/`)
    // Session cookie — 30 kun
    res.cookies.set('lv_session', session, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 30,
      path:     '/',
    })
    // oauth_state ni o'chirish
    res.cookies.delete('oauth_state')
    return res
  } catch (err) {
    console.error('OAuth callback error:', err)
    return NextResponse.redirect(`${base}/?auth_error=failed`)
  }
}
