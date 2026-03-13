// src/lib/users.ts
// Foydalanuvchilar — Vercel Postgres (asosiy) + /tmp JSON (fallback)

import fs from 'fs'
import path from 'path'
import { dbSql, hasPostgres } from './db'

export interface StoredUser {
  email:         string
  name:          string
  salt:          string
  password_hash: string
  joined:        string
}

// ── /tmp fallback ──────────────────────────────────────────────────────────
const TMP_FILE = path.join('/tmp', 'emro_users.json')

function tmpGet(): StoredUser[] {
  try {
    if (!fs.existsSync(TMP_FILE)) return []
    return JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'))
  } catch { return [] }
}

function tmpSave(users: StoredUser[]) {
  try { fs.writeFileSync(TMP_FILE, JSON.stringify(users, null, 2)) } catch {}
}

// ── Public API ─────────────────────────────────────────────────────────────
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const em = email.toLowerCase().trim()
  // /tmp dan tez tekshirish
  const local = tmpGet().find(u => u.email === em)
  if (local) return local
  // Postgres dan qidirish
  if (hasPostgres()) {
    const r = await dbSql<StoredUser>`
      SELECT email, name, salt, password_hash, joined
      FROM users WHERE email = ${em} LIMIT 1
    `
    if (r.rows[0]) return r.rows[0]
  }
  return null
}

export async function createUser(u: {
  email: string; name: string; salt: string; passwordHash: string; joined: string
}): Promise<StoredUser | null> {
  const user: StoredUser = {
    email:         u.email.toLowerCase().trim(),
    name:          u.name.trim(),
    salt:          u.salt,
    password_hash: u.passwordHash,
    joined:        u.joined,
  }
  // /tmp ga saqlash (har doim ishlaydi)
  const existing = tmpGet()
  if (!existing.find(x => x.email === user.email)) {
    tmpSave([...existing, user])
  }
  // Postgres ga ham saqlash
  if (hasPostgres()) {
    await dbSql`
      INSERT INTO users (email, name, salt, password_hash, joined)
      VALUES (${user.email}, ${user.name}, ${user.salt}, ${user.password_hash}, ${user.joined})
      ON CONFLICT (email) DO NOTHING
    `
    await dbSql`
      INSERT INTO profiles (user_email, bio, skills)
      VALUES (${user.email}, '', '[]') ON CONFLICT DO NOTHING
    `
  }
  return user
}

export async function userExists(email: string): Promise<boolean> {
  const em = email.toLowerCase().trim()
  if (tmpGet().find(u => u.email === em)) return true
  if (hasPostgres()) {
    const r = await dbSql`SELECT 1 FROM users WHERE email = ${em} LIMIT 1`
    return (r.rowCount ?? 0) > 0
  }
  return false
}
