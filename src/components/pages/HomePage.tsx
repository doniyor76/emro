'use client'
// src/components/pages/HomePage.tsx — tozalangan, professional
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/hooks/useAppStore'
import { showToast } from '@/components/ui/Toast'
import { saveNote, saveMedia, getStats } from '@/lib/storage'
import { RIBBON_ITEMS } from '@/lib/data'

interface Msg { type: 'ai' | 'user'; text: string }
type Cat = 'ai' | 'note' | 'achievement' | 'skill' | 'plan'

const CATS: Array<{ id: Cat; label: string }> = [
  { id: 'ai',          label: 'AI'       },
  { id: 'note',        label: 'Eslatma'  },
  { id: 'achievement', label: 'Yutuq'    },
  { id: 'skill',       label: 'Skill'    },
  { id: 'plan',        label: 'Reja'     },
]

const AI_REPLIES = [
  'Saqlandi. Keyinroq eslataman.',
  'Xotiraga qo\'shildi.',
  'Tasnif qilindi va arxivlandi.',
  'Maqsad belgilandi. Kuzataman.',
  'Portfolio\'ga qo\'shilsinmi? Aytasiz.',
]

const PANELS = [
  { id: 'notes',   icon: '✏️', label: 'Eslatmalar',  key: 'notes',  color: '#3b82f6' },
  { id: 'library', icon: '📚', label: 'Arxiv',        key: 'total',  color: '#22d3ee' },
  { id: 'media',   icon: '🖼', label: 'Media',        key: 'images', color: '#10b981' },
]

export default function HomePage() {
  const { setActiveTab, stats, setStats } = useAppStore()
  const [msgs, setMsgs] = useState<Msg[]>([
    { type: 'ai', text: 'Salom! Xotira, eslatma yoki savol yozing.' }
  ])
  const [input, setInput]     = useState('')
  const [cat, setCat]         = useState<Cat>('ai')
  const [sending, setSending] = useState(false)
  const [chatFull, setChatFull] = useState(false)

  const chatRef  = useRef<HTMLDivElement>(null)
  const taRef    = useRef<HTMLTextAreaElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef  = useRef(0)
  const posRef   = useRef(0)
  const fileRef  = useRef<HTMLInputElement>(null)

  const ribbon = [...RIBBON_ITEMS, ...RIBBON_ITEMS]

  useEffect(() => { setStats(getStats()) }, [setStats])

  // Ribbon scroll
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tick = () => {
      posRef.current += 0.5
      const half = track.scrollWidth / 2
      if (posRef.current >= half) posRef.current -= half
      track.style.transform = `translateX(-${posRef.current}px)`
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [msgs])

  function resizeTa() {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 80) + 'px'
  }

  function send() {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    setChatFull(true)
    setMsgs(p => [...p, { type: 'user', text }])
    setSending(true)
    if (cat === 'note' || cat === 'ai') {
      saveNote({ id: Date.now().toString(), title: text.slice(0,60), pre: text.slice(0,80), tag: 'Eslatma', date: 'Hozir', content: text })
    }
    setStats(getStats())
    setTimeout(() => {
      setMsgs(p => [...p, { type: 'ai', text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)] }])
      setSending(false)
    }, 600 + Math.random() * 600)
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    e.target.value = ''
    Array.from(files).forEach(file => {
      saveMedia({ id: Date.now().toString()+Math.random(), emoji: file.type.startsWith('video') ? '🎬' : '🖼', title: file.name, date: new Date().toLocaleDateString(), type: file.type.startsWith('video') ? 'video' : 'rasm', color: '#111827' })
    })
    setStats(getStats())
    showToast(`${files.length} ta fayl saqlandi`)
  }

  // ── Shared input bar ──
  const InputBar = (
    <div style={{ padding:'8px 12px 10px', background:'var(--bg)', borderTop:'1px solid var(--border)', flexShrink:0 }}>
      {/* Category pills */}
      <div style={{ display:'flex', gap:5, marginBottom:8, overflowX:'auto', scrollbarWidth:'none' }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            padding:'4px 12px', borderRadius:20, flexShrink:0,
            border:'1px solid ' + (cat===c.id ? 'var(--accent)' : 'var(--border)'),
            background: cat===c.id ? 'rgba(59,130,246,0.12)' : 'transparent',
            color: cat===c.id ? 'var(--accent2)' : 'var(--text3)',
            fontSize:'0.72rem', fontWeight: cat===c.id ? 600 : 400,
            cursor:'pointer', fontFamily:'var(--font)',
          }}>{c.label}</button>
        ))}
      </div>
      {/* Textarea row */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
        <button onClick={() => fileRef.current?.click()} style={{
          width:38, height:38, borderRadius:10, flexShrink:0,
          background:'var(--card)', border:'1px solid var(--border)',
          cursor:'pointer', display:'grid', placeItems:'center', color:'var(--text2)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div style={{ flex:1, display:'flex', alignItems:'flex-end', background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:'6px 6px 6px 12px' }}>
          <textarea
            ref={taRef} value={input}
            onChange={e => { setInput(e.target.value); resizeTa() }}
            onKeyDown={onKey}
            placeholder={chatFull ? 'Davom eting...' : 'Xotira, eslatma yoki savol yozing...'}
            rows={1}
            style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'0.88rem', fontFamily:'var(--font)', resize:'none', lineHeight:1.5, maxHeight:80, overflowY:'auto', padding:'2px 6px 2px 0' }}
          />
          <button onClick={send} disabled={!input.trim()} style={{
            width:32, height:32, borderRadius:8, flexShrink:0,
            background: input.trim() ? 'var(--accent)' : 'var(--card2)',
            border:'none', cursor: input.trim() ? 'pointer' : 'default',
            display:'grid', placeItems:'center',
            transition:'background 0.15s',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
          </button>
        </div>
      </div>
    </div>
  )

  const Bubbles = () => (
    <>
      {msgs.map((m, i) => (
        <div key={i} style={{ display:'flex', gap:8, justifyContent: m.type==='user' ? 'flex-end' : 'flex-start' }}>
          {m.type==='ai' && (
            <div style={{ width:24, height:24, borderRadius:7, background:'var(--accent)', display:'grid', placeItems:'center', flexShrink:0, marginTop:2 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
          )}
          <div style={{
            maxWidth:'78%', padding:'8px 12px',
            borderRadius: m.type==='ai' ? '3px 12px 12px 12px' : '12px 3px 12px 12px',
            background: m.type==='ai' ? 'var(--card)' : 'var(--accent)',
            border: m.type==='ai' ? '1px solid var(--border)' : 'none',
            fontSize:'0.86rem', lineHeight:1.5, color:'var(--text)',
          }}>{m.text}</div>
        </div>
      ))}
      {sending && (
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ width:24, height:24, borderRadius:7, background:'var(--accent)', display:'grid', placeItems:'center', flexShrink:0 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div style={{ padding:'8px 14px', borderRadius:'3px 12px 12px 12px', background:'var(--card)', border:'1px solid var(--border)', display:'flex', gap:4, alignItems:'center' }}>
            {[0,0.2,0.4].map((d,i) => <span key={i} style={{ width:5, height:5, borderRadius:'50%', background:'var(--text3)', display:'inline-block', animation:`dot 1s ${d}s ease-in-out infinite` }}/>)}
          </div>
        </div>
      )}
    </>
  )

  // Full chat view
  if (chatFull) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--bg)' }}>
        <div style={{ height:48, flexShrink:0, display:'flex', alignItems:'center', gap:10, padding:'0 14px', borderBottom:'1px solid var(--border)', background:'var(--bg)' }}>
          <button onClick={() => setChatFull(false)} style={{ width:32, height:32, borderRadius:9, background:'var(--card)', border:'1px solid var(--border)', display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text2)', flexShrink:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
          <div style={{ width:28, height:28, borderRadius:8, background:'var(--accent)', display:'grid', placeItems:'center', flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <div style={{ fontWeight:600, fontSize:'0.88rem' }}>Emro AI</div>
            <div style={{ fontSize:'0.62rem', color:'var(--green)', display:'flex', alignItems:'center', gap:3 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--green)', display:'inline-block' }}/>Online
            </div>
          </div>
        </div>
        <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:'14px', display:'flex', flexDirection:'column', gap:10, scrollbarWidth:'none' }}>
          <Bubbles />
        </div>
        {InputBar}
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={onFiles} style={{ display:'none' }} />
        <style>{`@keyframes dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}`}</style>
      </div>
    )
  }

  // Home view
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--bg)' }}>

      {/* Ribbon */}
      <div style={{ flexShrink:0, padding:'12px 0 8px' }}>
        <div style={{ fontSize:'0.62rem', color:'var(--text3)', letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:'var(--font-mono)', padding:'0 16px', marginBottom:8 }}>
          Xotiralar
        </div>
        <div style={{ position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:24, background:'linear-gradient(90deg,var(--bg),transparent)', zIndex:2, pointerEvents:'none' }} />
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:24, background:'linear-gradient(-90deg,var(--bg),transparent)', zIndex:2, pointerEvents:'none' }} />
          <div style={{ paddingLeft:16 }}>
            <div ref={trackRef} style={{ display:'flex', gap:8, width:'max-content', willChange:'transform' }}>
              {ribbon.map((m, i) => (
                <div key={i} onClick={() => showToast(m.label)} style={{ flexShrink:0, cursor:'pointer' }}>
                  <div style={{ width:58, height:80, borderRadius:12, background:`linear-gradient(160deg,${m.color},#080c14)`, border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
                    {m.emoji}
                  </div>
                  <div style={{ fontSize:'0.58rem', color:'var(--text3)', textAlign:'center', marginTop:4, width:58, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panels */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, padding:'4px 12px 8px', flexShrink:0 }}>
        {PANELS.map(p => (
          <button key={p.id} onClick={() => setActiveTab(p.id as any)} style={{
            borderRadius:14, padding:'14px 12px',
            background:'var(--card)', border:'1px solid var(--border)',
            cursor:'pointer', textAlign:'left', display:'flex', flexDirection:'column', gap:8,
            transition:'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ width:32, height:32, borderRadius:9, background: p.color+'18', display:'grid', placeItems:'center', fontSize:15 }}>{p.icon}</div>
            <div>
              <div style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text)', marginBottom:2 }}>{p.label}</div>
              <div style={{ fontSize:'0.7rem', color:p.color, fontWeight:600, fontFamily:'var(--font-mono)' }}>{(stats as any)[p.key] || 0}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Mini chat */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', margin:'0 12px 8px', borderRadius:14, border:'1px solid var(--border)', background:'var(--card)', overflow:'hidden', minHeight:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div style={{ width:20, height:20, borderRadius:6, background:'var(--accent)', display:'grid', placeItems:'center', flexShrink:0 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
          </div>
          <span style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text2)' }}>Emro AI</span>
          <span style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 6px var(--green)' }} />
          <button onClick={() => setChatFull(true)} style={{ fontSize:'0.65rem', color:'var(--text3)', background:'none', border:'1px solid var(--border)', cursor:'pointer', padding:'3px 9px', borderRadius:7, fontFamily:'var(--font)' }}>
            Ochish
          </button>
        </div>
        <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:'10px 12px', display:'flex', flexDirection:'column', gap:8, scrollbarWidth:'none', minHeight:0 }}>
          <Bubbles />
        </div>
      </div>

      {InputBar}
      <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={onFiles} style={{ display:'none' }} />
      <style>{`@keyframes dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}`}</style>
    </div>
  )
}
