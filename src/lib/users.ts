// src/lib/users.ts
// Foydalanuvchilarni saqlash — Vercel /tmp da (yoki in-memory fallback)
// Production uchun: bu yerga real DB (Postgres, MongoDB) ulang

import fs   from 'fs'
import path from 'path'

const DATA_DIR  = '/tmp'
const USERS_FILE = path.join(DATA_DIR, 'lv_users.json')

export interface StoredUser {
  email:        string
  name:         string
  salt:         string
  passwordHash: string
  joined:       string
  createdAt:    number
}

export function getUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return []
    const raw = fs.readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveUsers(users: StoredUser[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (e) {
    console.error('saveUsers error:', e)
  }
}
