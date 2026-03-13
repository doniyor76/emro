// src/app/api/db-init/route.ts
// DB schema yaratish — faqat bir marta ishga tushiriladi
// Vercel da deploy qilgandan keyin: GET /api/db-init?secret=YOUR_SECRET

import { NextRequest, NextResponse } from 'next/server'
import { initDB } from '@/lib/db'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  try {
    await initDB()
    return NextResponse.json({ ok: true, message: 'DB tables created successfully' })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
