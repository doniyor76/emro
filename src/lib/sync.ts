// src/lib/sync.ts
// localStorage + Postgres sync
// Strategiya: localStorage dan tez yuklash (offline ham ishlaydi),
// keyin API bilan sync qilish (real saqlanadi)

import { Note, MediaItem } from '@/types'
import * as local from './storage'

// ── NOTES ──────────────────────────────────────────────────────────────────

export async function loadNotes(): Promise<Note[]> {
  // 1. Avval localStorage dan tez ko'rsat
  const cached = local.getNotes()

  // 2. API dan yangilash (background)
  try {
    const res = await fetch('/api/notes')
    if (res.ok) {
      const { notes } = await res.json()
      // localStorage ni yangilash
      if (notes?.length) {
        localStorage.setItem('lv_notes', JSON.stringify(notes))
        return notes
      }
    }
  } catch { /* offline — cached ishlatiladi */ }

  return cached
}

export async function pushNote(note: Note): Promise<void> {
  // Avval local saqla (tez)
  local.saveNote(note)
  // Keyin API ga yuborish
  try {
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    })
  } catch { /* offline — local saqlanib qoldi */ }
}

export async function removeNote(id: string): Promise<void> {
  local.deleteNote(id)
  try {
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
  } catch {}
}

// ── MEDIA ──────────────────────────────────────────────────────────────────

export async function loadMedia(): Promise<MediaItem[]> {
  const cached = local.getMedia()
  try {
    const res = await fetch('/api/media')
    if (res.ok) {
      const { media } = await res.json()
      if (media?.length) {
        localStorage.setItem('lv_media', JSON.stringify(media))
        return media
      }
    }
  } catch {}
  return cached
}

export async function pushMedia(item: MediaItem): Promise<void> {
  local.saveMedia(item)
  try {
    await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
  } catch {}
}

// ── PROFILE ────────────────────────────────────────────────────────────────

export async function loadProfile(): Promise<{ bio: string; skills: string[] }> {
  const cached = {
    bio: local.getBio(),
    skills: local.getSkills(),
  }
  try {
    const res = await fetch('/api/profile')
    if (res.ok) {
      const data = await res.json()
      if (data.bio !== undefined) {
        local.setBio(data.bio)
        local.setSkills(data.skills || [])
        return data
      }
    }
  } catch {}
  return cached
}

export async function pushProfile(data: { bio?: string; skills?: string[] }): Promise<void> {
  if (data.bio !== undefined) local.setBio(data.bio)
  if (data.skills !== undefined) local.setSkills(data.skills)
  try {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {}
}

// ── STATS ──────────────────────────────────────────────────────────────────

export async function loadStats() {
  try {
    const res = await fetch('/api/stats')
    if (res.ok) return await res.json()
  } catch {}
  return local.getStats()
}
