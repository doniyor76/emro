'use client'
// src/components/pages/HomePage.tsx
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/hooks/useAppStore'
import { showToast }   from '@/components/ui/Toast'
import { saveNote, saveMedia, getStats } from '@/lib/storage'
import { RIBBON_ITEMS } from '@/lib/data'

interface Msg { type: 'ai' | 'user'; text: string }
type Category = 'ai' | 'note' | 'achievement' | 'skill' | 'plan'

const CATS: Array<{ id: Category; label: string; color: string }> = [
  { id: 'ai',          label: '🤖 AI',    color: '#00d4ff' },
  { id: 'note',        label: '📝 Notes', color: '#4f8ef7' },
  { id: 'achievement', label: '🏆 Yutuq', color: '#f0a500' },
  { id: 'skill',       label: '⚡ Skill', color: '#06b6d4' },
  { id: 'plan',        label: '📅 Reja',  color: '#00e5a0' },
]

const AI_REPLIES = [
  '✅ Saqlandi! AI tasnif qilmoqda...',
  "💡 Ajoyib fikr! Xotirangizga qo'shildi.",
  '📝 Eslatma saqlanib qoldi.',
  '🎯 Maqsad belgilandi! Kuzatib boraman.',
  "⭐ Zo'r! Portfolioga qo'shaylikmi?",
  '🚀 Qabul qilindi. Hammasi tartibga tushadi.',
]

const PANELS = [
  { id: 'notes',   icon: '📝', name: 'Notes',            desc: 'Fikrlar, rejalar', color: '#5865f2', statsKey: 'notes'  },
  { id: 'library', icon: '📚', name: 'Kutubxona',        desc: 'Barcha xotiralar', color: '#22d3ee', statsKey: 'total'  },
  { id: 'media',   icon: '🖼️', name: 'Rasmlar & Vidlar', desc: 'Suratlar',         color: '#10b981', statsKey: 'images' },
]

export default function HomePage() {
  const { setActiveTab, stats, setStats } = useAppStore()
  const [msgs, setMsgs]     = useState<Msg[]>([{ type: 'ai', text: 'Salom! Xotira yuklang yoki savol bering. 🌟' }])
  const [inputVal, setInput] = useState('')
  const [cat, setCat]        = useState<Category>('ai')
  const [sending, setSending] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const chatRef  = useRef<HTMLDivElement>(null)
  const taRef    = useRef<HTMLTextAreaElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef  = useRef(0)
  const posRef   = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef  = useRef<HTMLInputElement>(null)

  const ribbon = [...RIBBON_ITEMS, ...RIBBON_ITEMS]

  // Refresh stats from localStorage
  useEffect(() => { setStats(getStats()) }, [setStats])

  // Stars
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let af: number
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.003 + 0.001,
    }))
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const draw = () => {
      af = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.a += s.sp
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,210,255,${((Math.sin(s.a) * 0.4 + 0.6) * 0.5).toFixed(2)})`
        ctx.fill()
      })
    }
    draw()
    return () => { cancelAnimationFrame(af); ro.disconnect() }
  }, [])

  // Ribbon animation
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tick = () => {
      posRef.current += 0.45
      const half = track.scrollWidth / 2
      if (posRef.current >= half) posRef.current -= half
      track.style.transform = `translateX(-${posRef.current}px)`
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  // Scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [msgs, chatOpen])

  function resizeTa() {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 80) + 'px'
  }

  function sendMsg() {
    const text = inputVal.trim()
    if (!text || sending) return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    setChatOpen(true)
    setMsgs(prev => [...prev, { type: 'user', text }])
    setSending(true)

    // Save to localStorage
    const id = Date.now().toString()
    if (cat === 'note' || cat === 'ai') {
      saveNote({ id, title: text.slice(0, 60), pre: text.slice(0, 80), tag: 'Eslatma', date: 'Hozir', content: text })
    }
    setStats(getStats())

    setTimeout(() => {
      setMsgs(prev => [...prev, { type: 'ai', text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)] }])
      setSending(false)
    }, 600 + Math.random() * 700)
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() }
  }

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    e.target.value = ''
    showToast(`📤 ${files.length} ta fayl saqlandi`)
    Array.from(files).forEach(file => {
      saveMedia({
        id: Date.now().toString() + Math.random(),
        emoji: file.type.startsWith('video') ? '🎬' : '🖼️',
        title: file.name,
        date: new Date().toLocaleDateString(),
        type: file.type.startsWith('video') ? 'video' : 'rasm',
        color: '#0f1b3a',
      })
    })
    setStats(getStats())
  }

  const canSend = inputVal.trim().length > 0 && !sending

  // ── Shared input bar ──────────────────────────────────────
  const InputBar = (
    <div style={{ padding: '6px 10px 10px', flexShrink: 0, background: 'rgba(4,6,14,0.97)', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {CATS.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{
            padding: '3px 11px', borderRadius: 20,
            border: `1px solid ${cat === c.id ? c.color : 'rgba(255,255,255,0.08)'}`,
            background: cat === c.id ? c.color + '1a' : 'transparent',
            color: cat === c.id ? c.color : 'var(--text3)',
            fontSize: '0.67rem', fontWeight: cat === c.id ? 600 : 400,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            fontFamily: 'var(--font)',
          }}>{c.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
        <button onClick={() => fileRef.current?.click()} style={{ width: 38, height: 38, borderRadius: 19, flexShrink: 0, background: 'linear-gradient(135deg,rgba(79,142,247,0.2),rgba(0,212,255,0.12))', border: '1px solid rgba(0,212,255,0.28)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--cyan)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(0,212,255,0.22)', borderRadius: 22, padding: '5px 5px 5px 12px' }}>
          <textarea
            ref={taRef} value={inputVal}
            onChange={e => { setInput(e.target.value); resizeTa() }}
            onKeyDown={onKey} onFocus={() => setChatOpen(true)}
            placeholder="AI bilan yozing..." rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontSize: '0.88rem', fontFamily: 'var(--font)', resize: 'none', padding: '3px 6px 3px 0', lineHeight: 1.55, maxHeight: 80, overflowY: 'auto', alignSelf: 'center' }}
          />
          <button onClick={sendMsg} disabled={!canSend} style={{ width: 32, height: 32, borderRadius: 16, flexShrink: 0, background: canSend ? 'linear-gradient(135deg,var(--blue),var(--cyan))' : 'rgba(255,255,255,0.05)', border: 'none', cursor: canSend ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: canSend ? '0 0 14px rgba(0,212,255,0.45)' : 'none', alignSelf: 'flex-end' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={canSend ? '#fff' : 'rgba(255,255,255,0.2)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
          </button>
        </div>
      </div>
    </div>
  )

  const MsgBubbles = ({ size }: { size: 'sm' | 'lg' }) => (
    <>
      {msgs.map((m, i) => (
        <div key={i} style={{ display: 'flex', gap: size === 'lg' ? 8 : 6, alignItems: 'flex-end', justifyContent: m.type === 'user' ? 'flex-end' : 'flex-start' }}>
          {m.type === 'ai' && (
            <div style={{ width: size === 'lg' ? 26 : 20, height: size === 'lg' ? 26 : 20, borderRadius: size === 'lg' ? 8 : 5, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width={size === 'lg' ? 12 : 9} height={size === 'lg' ? 12 : 9} viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/><path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
          <div style={{ maxWidth: '80%', padding: size === 'lg' ? '9px 14px' : '6px 11px', borderRadius: m.type === 'ai' ? (size === 'lg' ? '4px 14px 14px 14px' : '3px 11px 11px 11px') : (size === 'lg' ? '14px 4px 14px 14px' : '11px 3px 11px 11px'), background: m.type === 'ai' ? 'rgba(10,14,30,0.95)' : 'linear-gradient(135deg,var(--blue),var(--cyan))', border: m.type === 'ai' ? '1px solid rgba(0,212,255,0.1)' : 'none', fontSize: size === 'lg' ? '0.87rem' : '0.82rem', lineHeight: 1.5 }}>
            {m.text}
          </div>
        </div>
      ))}
      {sending && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/></svg>
          </div>
          <div style={{ padding: '9px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(12,16,34,0.95)', border: '1px solid rgba(0,212,255,0.12)', display: 'flex', gap: 5, alignItems: 'center' }}>
            {[0, 0.22, 0.44].map((d, i) => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text3)', display: 'inline-block', animation: `typingDot 1.2s ${d}s ease-in-out infinite` }} />)}
          </div>
        </div>
      )}
    </>
  )

  // Full chat mode
  if (chatOpen) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
        <div style={{ height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', background: 'rgba(6,8,14,0.98)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
          <button onClick={() => setChatOpen(false)} style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.12)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text2)', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', display: 'grid', placeItems: 'center', boxShadow: '0 0 16px rgba(0,212,255,0.4)', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/><path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>LifeVault AI</div>
            <div style={{ fontSize: '0.63rem', color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', boxShadow: '0 0 5px var(--cyan)' }}/>Online
            </div>
          </div>
        </div>
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, scrollbarWidth: 'none' }}>
          <MsgBubbles size="lg" />
        </div>
        {InputBar}
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={onFiles} style={{ display: 'none' }} />
        <style>{`@keyframes typingDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}`}</style>
      </div>
    )
  }

  // Home screen
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: 'var(--bg)' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -80, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Ribbon */}
        <div style={{ flexShrink: 0, paddingTop: 10 }}>
          <div style={{ padding: '0 16px', marginBottom: 8 }}>
            <span style={{ fontSize: '0.58rem', color: 'var(--text3)', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>⭐ XOTIRALAR</span>
          </div>
          <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: 4 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(90deg,var(--bg),transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, background: 'linear-gradient(-90deg,var(--bg),transparent)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ paddingLeft: 16 }}>
              <div ref={trackRef} style={{ display: 'flex', gap: 8, width: 'max-content', willChange: 'transform' }}>
                {ribbon.map((m, i) => (
                  <div key={i} style={{ flexShrink: 0, width: 60, cursor: 'pointer' }} onClick={() => showToast(`📖 ${m.label}`)}>
                    <div style={{ width: 60, height: 82, borderRadius: 13, background: `linear-gradient(160deg,${m.color} 0%,#04060e 100%)`, border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, position: 'relative', overflow: 'hidden', boxShadow: `0 2px 12px ${m.accent}22` }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 55%)' }} />
                      <span style={{ position: 'relative', zIndex: 1 }}>{m.emoji}</span>
                    </div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text3)', textAlign: 'center', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '8px 12px 6px', flexShrink: 0 }}>
          {PANELS.map(p => (
            <div key={p.id} onClick={() => setActiveTab(p.id as any)} style={{ position: 'relative', borderRadius: 18, padding: '2px', cursor: 'pointer' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: `conic-gradient(from var(--rot-angle,0deg), ${p.color}, #070912 30%, ${p.color}55 55%, #070912 75%, ${p.color})`, animation: 'rotateBorder 3s linear infinite' }} />
              <div style={{ position: 'relative', zIndex: 1, borderRadius: 16, background: 'rgba(5,8,18,0.98)', padding: '11px 10px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: p.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, fontSize: 15, boxShadow: `0 0 10px ${p.color}44` }}>{p.icon}</div>
                <div style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text)', marginBottom: 2, lineHeight: 1.2 }}>{p.name}</div>
                <div style={{ fontSize: '0.57rem', color: 'var(--text3)', marginBottom: 5 }}>{p.desc}</div>
                <div style={{ fontSize: '0.62rem', color: p.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {(stats as any)[p.statsKey] || 0} ta
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mini chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '0 10px 4px', borderRadius: 18, border: '1px solid rgba(0,212,255,0.1)', background: 'rgba(4,6,14,0.9)', overflow: 'hidden', minHeight: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px 6px', borderBottom: '1px solid rgba(0,212,255,0.07)', flexShrink: 0 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', display: 'grid', placeItems: 'center', boxShadow: '0 0 8px rgba(0,212,255,0.3)' }}>
              <svg width="9" height="9" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/><path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--cyan)' }}>• LifeVault AI</span>
            <button onClick={() => setChatOpen(true)} style={{ marginLeft: 'auto', fontSize: '0.6rem', color: 'var(--text3)', background: 'none', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', padding: '2px 9px', borderRadius: 8 }}>
              To&apos;liq ↗
            </button>
          </div>
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 6px', display: 'flex', flexDirection: 'column', gap: 7, scrollbarWidth: 'none', minHeight: 0 }}>
            <MsgBubbles size="sm" />
          </div>
        </div>

        {InputBar}
      </div>

      <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={onFiles} style={{ display: 'none' }} />
      <style>{`
        @property --rot-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes rotateBorder { to { --rot-angle: 360deg; } }
        @keyframes typingDot { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-5px);opacity:1} }
      `}</style>
    </div>
  )
}
