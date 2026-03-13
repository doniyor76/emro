// src/app/api/db-init/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { initDB } from '@/lib/db'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const ok = await initDB()
  return NextResponse.json({ ok, message: ok ? 'DB ready' : 'No Postgres configured' })
}
