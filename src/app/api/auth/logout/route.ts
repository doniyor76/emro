// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const res  = NextResponse.redirect(`${base}/`)
  res.cookies.delete('lv_session')
  return res
}
