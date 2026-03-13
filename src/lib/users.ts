// src/lib/users.ts
// Foydalanuvchilar — Vercel Postgres da saqlanadi

import { sql } from './db'

export interface StoredUser {
  email:         string
  name:          string
  salt:          string
  password_hash: string
  joined:        string
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  try {
    const result = await sql<StoredUser>`
      SELECT email, name, salt, password_hash, joined
      FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
    `
    return result.rows[0] ?? null
  } catch (e) {
    console.error('findUserByEmail:', e)
    return null
  }
}

export async function createUser(u: {
  email: string; name: string; salt: string; passwordHash: string; joined: string
}): Promise<StoredUser | null> {
  try {
    const result = await sql<StoredUser>`
      INSERT INTO users (email, name, salt, password_hash, joined)
      VALUES (${u.email.toLowerCase().trim()}, ${u.name.trim()}, ${u.salt}, ${u.passwordHash}, ${u.joined})
      RETURNING email, name, salt, password_hash, joined
    `
    // Empty profile yaratish
    await sql`
      INSERT INTO profiles (user_email, bio, skills)
      VALUES (${u.email.toLowerCase().trim()}, '', '[]')
      ON CONFLICT DO NOTHING
    `
    return result.rows[0] ?? null
  } catch (e) {
    console.error('createUser:', e)
    return null
  }
}

export async function userExists(email: string): Promise<boolean> {
  try {
    const r = await sql`SELECT 1 FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1`
    return (r.rowCount ?? 0) > 0
  } catch { return false }
}
