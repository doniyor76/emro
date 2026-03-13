// src/app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/auth'
import { getNotesDB, saveNoteDB } from '@/lib/db-queries'

function getEmail(req: NextRequest): string | null {
  const token = req.cookies.get('lv_session')?.value
  if (!token) return null
  const payload = decodeSession(token)
  return (payload?.email as string) ?? null
}

export async function GET(req: NextRequest) {
  const email = getEmail(req)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const notes = await getNotesDB(email)
  return NextResponse.json({ notes })
}

export async function POST(req: NextRequest) {
  const email = getEmail(req)
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const note = await req.json()
    await saveNoteDB(email, note)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Xatolik' }, { status: 500 })
  }
}
