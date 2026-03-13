// src/app/api/auth/login/route.ts
// Email + parol bilan kirish

import { NextRequest, NextResponse } from 'next/server'
import { encodeSession } from '@/lib/auth'
import { getUsers } from '@/lib/users'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email va parol kiritilishi shart' }, { status: 400 })
    }

    const users = getUsers()
    const user  = users.find((u: any) => u.email === email.toLowerCase().trim())

    if (!user) {
      return NextResponse.json({ error: "Bu email ro'yxatdan o'tmagan" }, { status: 401 })
    }

    // Simple password check (hashed with btoa — lightweight, no bcrypt needed for demo)
    const hashed = btoa(password + user.salt)
    if (hashed !== user.passwordHash) {
      return NextResponse.json({ error: 'Parol noto\'g\'ri' }, { status: 401 })
    }

    const session = encodeSession({
      email:   user.email,
      name:    user.name,
      initial: user.name[0].toUpperCase(),
      avatar:  '',
      joined:  user.joined,
      iat:     Date.now(),
    })

    const res = NextResponse.json({ ok: true })
    res.cookies.set('lv_session', session, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 24 * 30,
      path:     '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Xatolik yuz berdi' }, { status: 500 })
  }
}
