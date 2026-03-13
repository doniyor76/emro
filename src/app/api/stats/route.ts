// src/app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/auth'
import { getStatsDB } from '@/lib/db-queries'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('lv_session')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const p = decodeSession(token)
  const email = p?.email as string
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const stats = await getStatsDB(email)
  return NextResponse.json(stats)
}
