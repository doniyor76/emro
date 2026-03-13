// src/lib/db.ts
// PostgreSQL wrapper — pg paketi, to'liq TypeScript support
// POSTGRES_URL bo'lmasa /tmp fallback ishlaydi

import { Pool, QueryResult } from 'pg'

let pool: Pool | null = null

function getPool(): Pool | null {
  if (!process.env.POSTGRES_URL) return null
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  }
  return pool
}

export function hasPostgres(): boolean {
  return !!process.env.POSTGRES_URL
}

// Tagged template literal SQL — sql`SELECT ...` sintaksisi
export async function dbSql<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<{ rows: T[]; rowCount: number }> {
  const db = getPool()
  if (!db) return { rows: [], rowCount: 0 }

  // Template literal → parameterized query
  let text = ''
  strings.forEach((s, i) => {
    text += s
    if (i < values.length) text += `$${i + 1}`
  })

  try {
    const result: QueryResult<T> = await db.query(text, values as unknown[])
    return { rows: result.rows, rowCount: result.rowCount ?? 0 }
  } catch (e) {
    console.error('DB error:', e)
    return { rows: [], rowCount: 0 }
  }
}

export async function initDB(): Promise<boolean> {
  if (!hasPostgres()) {
    console.log('No POSTGRES_URL — using /tmp fallback')
    return false
  }
  try {
    await dbSql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      salt TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      joined TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`
    await dbSql`CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      title TEXT DEFAULT '',
      pre TEXT DEFAULT '',
      tag TEXT DEFAULT 'Eslatma',
      date TEXT DEFAULT 'Hozir',
      content TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`
    await dbSql`CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      emoji TEXT DEFAULT '🖼️',
      title TEXT DEFAULT '',
      date TEXT DEFAULT '',
      type TEXT DEFAULT 'rasm',
      color TEXT DEFAULT '#111827',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`
    await dbSql`CREATE TABLE IF NOT EXISTS profiles (
      user_email TEXT PRIMARY KEY,
      bio TEXT DEFAULT '',
      skills JSONB DEFAULT '[]',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`
    await dbSql`CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_email)`
    await dbSql`CREATE INDEX IF NOT EXISTS idx_media_user ON media(user_email)`
    return true
  } catch (e) {
    console.error('initDB error:', e)
    return false
  }
}
