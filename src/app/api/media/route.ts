// src/app/api/media/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/auth'
import { getMediaDB, saveMediaDB } from '@/lib/db-queries'

function getEmail(req: NextRequest): string | null {
  const token = req.cookies.get('lv_session')?.value
  if (!token) return null
  const p = decodeSession(token)
  return (p?.email as string) ?? null
}

export async function GET(req: NextRequest) {
  const email = getEmail(req)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const media = await getMediaDB(email)
  return NextResponse.json({ media })
}

export async function POST(req: NextRequest) {
  const email = getEmail(req)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const item = await req.json()
    await saveMediaDB(email, item)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}
