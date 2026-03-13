'use client'
// src/components/pages/NotesPage.tsx
import { useState, useEffect } from 'react'
import { showToast } from '@/components/ui/Toast'
import { getNotes, saveNote, deleteNote, getStats } from '@/lib/storage'
import { SEED_NOTES } from '@/lib/data'
import { Note } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'

const TAG_COLORS: Record<string, string> = {
  Reja: '#4f8ef7', Maqsad: '#f472b6', Loyiha: '#a78bfa',
  Kitob: '#fbbf24', Eslatma: '#00d4ff',
}

export default function NotesPage() {
  const { setStats } = useAppStore()
  const [notes, setNotes]       = useState<Note[]>([])
  const [activeId, setActiveId] = useState<string>('seed-1')
  const [title, setTitle]       = useState(SEED_NOTES[0].title)
  const [body, setBody]         = useState(SEED_NOTES[0].content)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const saved = getNotes()
    setNotes(saved.length ? [...SEED_NOTES, ...saved] : SEED_NOTES)
  }, [])

  function openNote(note: Note) {
    setActiveId(note.id)
    setTitle(note.title)
    setBody(note.content)
    if (window.innerWidth < 640) setSidebarOpen(false)
  }

  function newNote() {
    const id = Date.now().toString()
    const n: Note = { id, title: 'Yangi eslatma', pre: '', tag: 'Eslatma', date: 'Hozir', content: '' }
    saveNote(n)
    setNotes(prev => [n, ...prev])
    setActiveId(id)
    setTitle(n.title)
    setBody('')
    setStats(getStats())
    if (window.innerWidth < 640) setSidebarOpen(false)
  }

  function doSave() {
    const isSeed = activeId.startsWith('seed-')
    if (!isSeed) {
      saveNote({ id: activeId, title, pre: body.slice(0, 80), tag: 'Eslatma', date: 'Hozir', content: body })
      setNotes(prev => prev.map(n => n.id === activeId ? { ...n, title, pre: body.slice(0, 80), content: body } : n))
    }
    showToast('✅ Saqlandi!')
    setStats(getStats())
  }

  function doDelete() {
    if (activeId.startsWith('seed-')) { showToast('❌ Namuna eslatmalarni o\'chirish mumkin emas'); return }
    deleteNote(activeId)
    const remaining = notes.filter(n => n.id !== activeId)
    setNotes(remaining)
    setStats(getStats())
    if (remaining.length) openNote(remaining[0])
    showToast('🗑 O\'chirildi')
  }

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Sidebar */}
      <div style={{ width: 260, flexShrink: 0, borderRight: '1px solid var(--b1)', background: 'var(--bg2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--b2)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>📝 Notes</h3>
          <button onClick={newNote} style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--cyan)', fontSize: 18, cursor: 'pointer', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)' }}>＋</button>
        </div>
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--b2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.04)', border: '1px solid var(--b2)', borderRadius: 8, padding: '8px 10px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Qidirish..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '0.82rem', width: '100%', fontFamily: 'var(--font)' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {notes.map(note => (
            <div key={note.id} onClick={() => openNote(note)} style={{ padding: '10px 14px', cursor: 'pointer', borderRadius: 8, margin: '2px 8px', background: activeId === note.id ? 'rgba(0,212,255,0.08)' : 'transparent', borderLeft: activeId === note.id ? '2px solid var(--cyan)' : '2px solid transparent', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 500, color: 'var(--text)' }}>{note.title}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{note.date}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 5 }}>{note.pre}</div>
              <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 20, background: (TAG_COLORS[note.tag] || '#4f8ef7') + '22', color: TAG_COLORS[note.tag] || '#4f8ef7', border: `1px solid ${TAG_COLORS[note.tag] || '#4f8ef7'}33` }}>{note.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px', borderBottom: '1px solid var(--b2)', flexShrink: 0, flexWrap: 'wrap' }}>
          {['B', 'I', 'U'].map(f => (
            <button key={f} style={{ width: 28, height: 26, borderRadius: 5, background: 'rgba(0,212,255,0.05)', border: '1px solid var(--b2)', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>{f}</button>
          ))}
          <div style={{ width: 1, height: 16, background: 'var(--b1)', margin: '0 4px' }} />
          {['H1', 'H2'].map(t => (
            <button key={t} style={{ height: 26, padding: '0 8px', borderRadius: 5, background: 'rgba(0,212,255,0.05)', border: '1px solid var(--b2)', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.72rem' }}>{t}</button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {!activeId.startsWith('seed-') && (
              <button onClick={doDelete} style={{ height: 26, padding: '0 10px', borderRadius: 5, background: 'rgba(255,69,96,0.08)', border: '1px solid rgba(255,69,96,0.25)', color: 'var(--red)', cursor: 'pointer', fontSize: '0.72rem' }}>🗑</button>
            )}
            <button onClick={doSave} style={{ height: 26, padding: '0 12px', borderRadius: 5, background: 'rgba(0,229,160,0.1)', border: '1px solid rgba(0,229,160,0.3)', color: 'var(--green)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>💾 Saqlash</button>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 24px', overflow: 'hidden' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Sarlavha..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 14, letterSpacing: '-0.02em' }} />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Yozishni boshlang..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-mono)', lineHeight: 1.7, resize: 'none' }} />
        </div>
        <div style={{ padding: '8px 14px 12px', borderTop: '1px solid var(--b2)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div onClick={() => showToast('⭐ AI tahlil qilmoqda...')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 20, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--gold)' }}>
            ⭐ AI tahlil
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text3)', marginLeft: 'auto' }}>Qurilmada saqlanadi</span>
        </div>
      </div>
    </div>
  )
}
