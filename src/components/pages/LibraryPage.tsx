'use client'
// src/components/pages/LibraryPage.tsx
import { useEffect } from 'react'
import { useAppStore } from '@/hooks/useAppStore'
import { getStats } from '@/lib/storage'
import { BOOKS } from '@/lib/data'

const BOOK_COLORS = ['#1e3a8a','#14532d','#7c2d12','#581c87','#0c4a6e','#831843','#1c1917','#064e3b']

export default function LibraryPage() {
  const { stats, setStats } = useAppStore()

  useEffect(() => { setStats(getStats()) }, [setStats])

  const STAT_CARDS = [
    { label: 'Jami element', value: stats.total,        color: 'var(--accent2)' },
    { label: 'Rasm',         value: stats.images,       color: 'var(--accent2)'  },
    { label: 'Eslatma',      value: stats.notes,        color: 'var(--green)' },
    { label: 'Yutuq',        value: stats.achievements, color: 'var(--gold)'  },
    { label: 'Video',        value: stats.videos,       color: 'var(--pink)'  },
  ]

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font)', fontSize: '1.5rem', fontWeight: 400, background: 'linear-gradient(135deg,#fff,var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>📚 Kutubxona</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>Barcha xotiralaringiz koinot singari tartibli va chiroyli</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10, marginBottom: 28 }}>
          {STAT_CARDS.map(s => (
            <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 14px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font)', color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)' }}>
            Kitob javoni <div style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,var(--accent),var(--accent2),var(--accent))', opacity: 0.4 }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {BOOKS.map((book, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', width: 72, cursor: 'pointer', alignItems: 'center', transition: 'transform 0.25s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                  <div style={{ width: 48, height: 80, borderRadius: '4px 10px 10px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', position: 'relative', overflow: 'hidden', background: `linear-gradient(160deg,${BOOK_COLORS[i % BOOK_COLORS.length]},${BOOK_COLORS[(i+2) % BOOK_COLORS.length]})`, boxShadow: '3px 4px 12px rgba(0,0,0,0.5),inset -2px 0 0 rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {book.emoji}
                    <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center', fontSize: '0.55rem', color: 'rgba(255,255,255,0.7)' }}>{book.count}</div>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textAlign: 'center', marginTop: 6 }}>{book.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
