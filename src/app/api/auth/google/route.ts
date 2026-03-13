// src/app/api/auth/google/route.ts
// Google OAuth boshlanishi — foydalanuvchini Google ga yo'naltiradi

import { NextResponse } from 'next/server'
import { buildGoogleAuthUrl } from '@/lib/auth'

export async function GET() {
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36)
  const url   = buildGoogleAuthUrl(state)

  const res = NextResponse.redirect(url)
  // state ni cookie da saqlash — CSRF himoyasi uchun
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   600, // 10 daqiqa
    path:     '/',
  })
  return res
}
