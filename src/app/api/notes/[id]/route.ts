// src/app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/auth'
import { deleteNoteDB } from '@/lib/db-queries'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('lv_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = decodeSession(token)
  const email = payload?.email as string
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await deleteNoteDB(email, params.id)
  return NextResponse.json({ ok: true })
}
