// src/app/api/auth/register/route.ts
// Yangi foydalanuvchi ro'yxatdan o'tkazish

import { NextRequest, NextResponse } from 'next/server'
import { encodeSession } from '@/lib/auth'
import { getUsers, saveUsers } from '@/lib/users'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Barcha maydonlarni to\'ldiring' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Parol kamida 6 ta belgi bo\'lishi kerak' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email noto\'g\'ri formatda' }, { status: 400 })
    }

    const users = getUsers()
    if (users.find((u: any) => u.email === email.toLowerCase().trim())) {
      return NextResponse.json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan' }, { status: 409 })
    }

    const salt         = Math.random().toString(36).slice(2)
    const passwordHash = btoa(password + salt)
    const newUser = {
      email:        email.toLowerCase().trim(),
      name:         name.trim(),
      salt,
      passwordHash,
      joined:       new Date().getFullYear().toString(),
      createdAt:    Date.now(),
    }

    saveUsers([...users, newUser])

    const session = encodeSession({
      email:   newUser.email,
      name:    newUser.name,
      initial: newUser.name[0].toUpperCase(),
      avatar:  '',
      joined:  newUser.joined,
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
