// src/lib/db.ts
// Vercel Postgres (Neon) — barcha DB so'rovlari shu yerdan o'tadi
// Ulanish: POSTGRES_URL env variable orqali (Vercel dashboard da avtomatik o'rnatiladi)

import { sql } from '@vercel/postgres'

export { sql }

// ── Schema yaratish (birinchi deployda bir marta ishga tushadi) ──────────────
export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      email       TEXT UNIQUE NOT NULL,
      name        TEXT NOT NULL,
      salt        TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      joined      TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id         TEXT PRIMARY KEY,
      user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
      title      TEXT NOT NULL,
      pre        TEXT DEFAULT '',
      tag        TEXT DEFAULT 'Eslatma',
      date       TEXT DEFAULT 'Hozir',
      content    TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS media (
      id         TEXT PRIMARY KEY,
      user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
      emoji      TEXT DEFAULT '🖼',
      title      TEXT NOT NULL,
      date       TEXT DEFAULT '',
      type       TEXT DEFAULT 'rasm',
      color      TEXT DEFAULT '#111827',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      user_email TEXT PRIMARY KEY REFERENCES users(email) ON DELETE CASCADE,
      bio        TEXT DEFAULT '',
      skills     JSONB DEFAULT '[]',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  // Index for fast user_email lookups
  await sql`CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_media_user ON media(user_email)`
}
