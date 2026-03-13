// src/lib/storage.ts
// Barcha ma'lumotlar localStorage da saqlanadi — Supabase yo'q

import { Note, MediaItem } from '@/types'

const PREFIX = 'lv_'
const key = (k: string) => PREFIX + k

function get<T>(k: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key(k))
    return v ? (JSON.parse(v) as T) : fallback
  } catch { return fallback }
}

function set(k: string, v: unknown) {
  try { localStorage.setItem(key(k), JSON.stringify(v)) } catch {}
}

function remove(k: string) {
  try { localStorage.removeItem(key(k)) } catch {}
}

// ── Notes ──────────────────────────────────────────────────
export function getNotes(): Note[] {
  return get<Note[]>('notes', [])
}

export function saveNote(note: Note) {
  const notes = getNotes()
  const idx = notes.findIndex(n => n.id === note.id)
  if (idx >= 0) notes[idx] = note
  else notes.unshift(note)
  set('notes', notes)
}

export function deleteNote(id: string) {
  set('notes', getNotes().filter(n => n.id !== id))
}

// ── Media ──────────────────────────────────────────────────
export function getMedia(): MediaItem[] {
  return get<MediaItem[]>('media', [])
}

export function saveMedia(item: MediaItem) {
  const items = getMedia()
  items.unshift(item)
  set('media', items)
}

// ── Stats ──────────────────────────────────────────────────
export function getStats() {
  const notes = getNotes().length
  const media = getMedia()
  const images = media.filter(m => m.type === 'rasm').length
  const videos = media.filter(m => m.type === 'video').length
  return { total: notes + images + videos, images, notes, achievements: 4, videos }
}

// ── Skills ─────────────────────────────────────────────────
export function getSkills(): string[] {
  return get<string[]>('skills', ['JavaScript', 'Python', 'React', 'UI/UX Dizayn', 'PostgreSQL', 'Node.js', 'Figma', 'Next.js'])
}
export function setSkills(s: string[]) { set('skills', s) }

// ── Bio ────────────────────────────────────────────────────
export function getBio(): string {
  return get<string>('bio', "LifeVault foydalanuvchisi. Xotiralar, yutuqlar va ko'nikmalar shu yerda saqlanadi.")
}
export function setBio(bio: string) { set('bio', bio) }

// ── Session (cookie'dan user info cache) ───────────────────
export function getLocalUser() {
  return get<{ name: string; email: string; initial: string; avatar?: string; joined?: string } | null>('user', null)
}
export function setLocalUser(u: { name: string; email: string; initial: string; avatar?: string; joined?: string } | null) {
  if (u) set('user', u)
  else remove('user')
}
