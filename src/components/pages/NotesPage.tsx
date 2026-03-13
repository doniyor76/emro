'use client'
// src/components/pages/NotesPage.tsx
import { useState, useEffect, useCallback } from 'react'
import { showToast } from '@/components/ui/Toast'
import { loadNotes, pushNote, removeNote } from '@/lib/sync'
import { getStats } from '@/lib/storage'
import { SEED_NOTES } from '@/lib/data'
import { Note } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'

const TAG_COLORS: Record<string, string> = {
  Reja: '#3b82f6', Maqsad: '#f472b6', Loyiha: '#a78bfa',
  Kitob: '#fbbf24', Eslatma: '#3b82f6',
}

export default function NotesPage() {
  const { setStats } = useAppStore()
  const [notes, setNotes]       = useState<Note[]>(SEED_NOTES)
  const [activeId, setActiveId] = useState<string>('seed-1')
  const [title, setTitle]       = useState(SEED_NOTES[0].title)
  const [body, setBody]         = useState(SEED_NOTES[0].content)
  const [loading, setLoading]   = useState(true)

  const refresh = useCallback(async () => {
    const saved = await loadNotes()
    setNotes(saved.length ? [...SEED_NOTES, ...saved] : SEED_NOTES)
    setLoading(false)
    setStats(getStats())
  }, [setStats])

  useEffect(() => { refresh() }, [refresh])

  function openNote(note: Note) {
    setActiveId(note.id)
    setTitle(note.title)
    setBody(note.content)
  }

  function newNote() {
    const id = Date.now().toString()
    const n: Note = { id, title: 'Yangi eslatma', pre: '', tag: 'Eslatma', date: 'Hozir', content: '' }
    pushNote(n)
    setNotes(prev => [n, ...prev.filter(x => !x.id.startsWith('seed-')), ...SEED_NOTES])
    openNote(n)
    setStats(getStats())
  }

  async function doSave() {
    if (activeId.startsWith('seed-')) { showToast('Saqlandi!'); return }
    const updated: Note = { id: activeId, title, pre: body.slice(0,80), tag: 'Eslatma', date: 'Hozir', content: body }
    await pushNote(updated)
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, ...updated } : n))
    setStats(getStats())
    showToast('Saqlandi!')
  }

  async function doDelete() {
    if (activeId.startsWith('seed-')) { showToast('Namuna eslatmani o\'chirib bo\'lmaydi'); return }
    await removeNote(activeId)
    const remaining = notes.filter(n => n.id !== activeId)
    setNotes(remaining)
    setStats(getStats())
    if (remaining.length) openNote(remaining[0])
    showToast('O\'chirildi')
  }

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden', position:'relative' }}>

      {/* Sidebar */}
      <div style={{ width:260, flexShrink:0, borderRight:'1px solid var(--border)', background:'var(--bg2)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'14px 14px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontSize:'0.9rem', fontWeight:600 }}>Eslatmalar</span>
          <button onClick={newNote} style={{ width:28, height:28, borderRadius:7, background:'rgba(59,130,246,0.1)', border:'1px solid var(--border-accent)', color:'var(--accent2)', fontSize:18, cursor:'pointer', display:'grid', placeItems:'center', fontFamily:'var(--font-mono)' }}>＋</button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'6px 0' }}>
          {loading && <div style={{ padding:'20px', textAlign:'center', fontSize:'0.8rem', color:'var(--text3)' }}>Yuklanmoqda...</div>}
          {notes.map(note => (
            <div key={note.id} onClick={() => openNote(note)} style={{ padding:'10px 14px', cursor:'pointer', borderRadius:8, margin:'2px 8px', background: activeId===note.id ? 'rgba(59,130,246,0.08)' : 'transparent', borderLeft: activeId===note.id ? '2px solid var(--accent2)' : '2px solid transparent', transition:'all 0.15s' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ fontSize:'0.84rem', fontWeight:500 }}>{note.title}</span>
                <span style={{ fontSize:'0.65rem', color:'var(--text3)' }}>{note.date}</span>
              </div>
              <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:5 }}>{note.pre}</div>
              <span style={{ fontSize:'0.62rem', padding:'2px 8px', borderRadius:20, background:(TAG_COLORS[note.tag]||'#3b82f6')+'22', color:TAG_COLORS[note.tag]||'#3b82f6', border:`1px solid ${TAG_COLORS[note.tag]||'#3b82f6'}33` }}>{note.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap:4, padding:'8px 14px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          {['B','I','U'].map(f => (
            <button key={f} style={{ width:28, height:26, borderRadius:5, background:'rgba(59,130,246,0.05)', border:'1px solid var(--border)', color:'var(--text2)', cursor:'pointer', fontSize:'0.78rem', fontWeight:700 }}>{f}</button>
          ))}
          <div style={{ width:1, height:16, background:'var(--border)', margin:'0 4px' }} />
          {['H1','H2'].map(t => (
            <button key={t} style={{ height:26, padding:'0 8px', borderRadius:5, background:'rgba(59,130,246,0.05)', border:'1px solid var(--border)', color:'var(--text2)', cursor:'pointer', fontSize:'0.72rem' }}>{t}</button>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
            {!activeId.startsWith('seed-') && (
              <button onClick={doDelete} style={{ height:26, padding:'0 10px', borderRadius:5, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'var(--red)', cursor:'pointer', fontSize:'0.72rem' }}>O'chirish</button>
            )}
            <button onClick={doSave} style={{ height:26, padding:'0 12px', borderRadius:5, background:'rgba(59,130,246,0.1)', border:'1px solid var(--border-accent)', color:'var(--accent2)', cursor:'pointer', fontSize:'0.72rem', fontWeight:600 }}>Saqlash</button>
          </div>
        </div>

        <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'20px 24px', overflow:'hidden' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Sarlavha..." style={{ background:'none', border:'none', outline:'none', fontSize:'1.3rem', fontWeight:700, color:'var(--text)', fontFamily:'var(--font)', marginBottom:14, letterSpacing:'-0.02em' }} />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Yozishni boshlang..." style={{ flex:1, background:'none', border:'none', outline:'none', fontSize:'0.9rem', color:'var(--text)', fontFamily:'var(--font-mono)', lineHeight:1.7, resize:'none' }} />
        </div>

        <div style={{ padding:'8px 14px 12px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', flexShrink:0 }}>
          <span style={{ fontSize:'0.72rem', color:'var(--text3)' }}>Postgres + localStorage da saqlanadi</span>
        </div>
      </div>
    </div>
  )
}
