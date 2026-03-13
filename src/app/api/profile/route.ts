// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/auth'
import { getProfileDB, saveProfileDB } from '@/lib/db-queries'

function getEmail(req: NextRequest): string | null {
  const token = req.cookies.get('lv_session')?.value
  if (!token) return null
  const p = decodeSession(token)
  return (p?.email as string) ?? null
}

export async function GET(req: NextRequest) {
  const email = getEmail(req)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const profile = await getProfileDB(email)
  return NextResponse.json(profile)
}

export async function POST(req: NextRequest) {
  const email = getEmail(req)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const data = await req.json()
    await saveProfileDB(email, data)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}
