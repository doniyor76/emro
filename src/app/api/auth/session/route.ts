// src/app/api/auth/session/route.ts
// Client bu endpointdan joriy foydalanuvchini oladi

import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('lv_session')?.value
  if (!token) return NextResponse.json({ user: null })

  const payload = decodeSession(token)
  if (!payload) return NextResponse.json({ user: null })

  return NextResponse.json({
    user: {
      email:   payload.email,
      name:    payload.name,
      initial: payload.initial,
      avatar:  payload.avatar,
      joined:  payload.joined,
    },
  })
}
