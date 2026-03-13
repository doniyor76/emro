// src/lib/db-queries.ts
// Notes, Media, Profile — Postgres CRUD funksiyalari

import { dbSql as sql } from './db'
import { Note, MediaItem } from '@/types'

// ── NOTES ─────────────────────────────────────────────────────────────────────

export async function getNotesDB(userEmail: string): Promise<Note[]> {
  try {
    const r = await sql<Note & { user_email: string }>`
      SELECT id, title, pre, tag, date, content
      FROM notes
      WHERE user_email = ${userEmail}
      ORDER BY created_at DESC
    `
    return r.rows
  } catch (e) {
    console.error('getNotesDB:', e)
    return []
  }
}

export async function saveNoteDB(userEmail: string, note: Note): Promise<void> {
  try {
    await sql`
      INSERT INTO notes (id, user_email, title, pre, tag, date, content)
      VALUES (${note.id}, ${userEmail}, ${note.title}, ${note.pre}, ${note.tag}, ${note.date}, ${note.content})
      ON CONFLICT (id) DO UPDATE SET
        title      = EXCLUDED.title,
        pre        = EXCLUDED.pre,
        tag        = EXCLUDED.tag,
        content    = EXCLUDED.content,
        updated_at = NOW()
    `
  } catch (e) {
    console.error('saveNoteDB:', e)
  }
}

export async function deleteNoteDB(userEmail: string, noteId: string): Promise<void> {
  try {
    await sql`DELETE FROM notes WHERE id = ${noteId} AND user_email = ${userEmail}`
  } catch (e) {
    console.error('deleteNoteDB:', e)
  }
}

// ── MEDIA ─────────────────────────────────────────────────────────────────────

export async function getMediaDB(userEmail: string): Promise<MediaItem[]> {
  try {
    const r = await sql<MediaItem & { user_email: string }>`
      SELECT id, emoji, title, date, type, color
      FROM media
      WHERE user_email = ${userEmail}
      ORDER BY created_at DESC
    `
    return r.rows
  } catch (e) {
    console.error('getMediaDB:', e)
    return []
  }
}

export async function saveMediaDB(userEmail: string, item: MediaItem): Promise<void> {
  try {
    await sql`
      INSERT INTO media (id, user_email, emoji, title, date, type, color)
      VALUES (${item.id}, ${userEmail}, ${item.emoji}, ${item.title}, ${item.date}, ${item.type}, ${item.color})
      ON CONFLICT (id) DO NOTHING
    `
  } catch (e) {
    console.error('saveMediaDB:', e)
  }
}

// ── PROFILE (bio + skills) ─────────────────────────────────────────────────────

export async function getProfileDB(userEmail: string): Promise<{ bio: string; skills: string[] }> {
  try {
    const r = await sql<{ bio: string; skills: string[] }>`
      SELECT bio, skills FROM profiles WHERE user_email = ${userEmail} LIMIT 1
    `
    if (r.rows[0]) return { bio: r.rows[0].bio || '', skills: r.rows[0].skills || [] }
    return { bio: '', skills: [] }
  } catch (e) {
    console.error('getProfileDB:', e)
    return { bio: '', skills: [] }
  }
}

export async function saveProfileDB(userEmail: string, data: { bio?: string; skills?: string[] }): Promise<void> {
  try {
    await sql`
      INSERT INTO profiles (user_email, bio, skills)
      VALUES (${userEmail}, ${data.bio ?? ''}, ${JSON.stringify(data.skills ?? [])}::jsonb)
      ON CONFLICT (user_email) DO UPDATE SET
        bio        = COALESCE(EXCLUDED.bio, profiles.bio),
        skills     = COALESCE(EXCLUDED.skills, profiles.skills),
        updated_at = NOW()
    `
  } catch (e) {
    console.error('saveProfileDB:', e)
  }
}

// ── STATS ─────────────────────────────────────────────────────────────────────

export async function getStatsDB(userEmail: string) {
  try {
    const [notesR, mediaR] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM notes WHERE user_email = ${userEmail}`,
      sql`SELECT type, COUNT(*) as count FROM media WHERE user_email = ${userEmail} GROUP BY type`,
    ])
    const notes  = Number(notesR.rows[0]?.count ?? 0)
    const images = Number(mediaR.rows.find((r: any) => r.type === 'rasm')?.count ?? 0)
    const videos = Number(mediaR.rows.find((r: any) => r.type === 'video')?.count ?? 0)
    return { total: notes + images + videos, notes, images, videos, achievements: 4 }
  } catch (e) {
    console.error('getStatsDB:', e)
    return { total: 0, notes: 0, images: 0, videos: 0, achievements: 0 }
  }
}
