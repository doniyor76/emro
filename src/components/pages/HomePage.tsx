'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/hooks/useAppStore'
import { showToast } from '@/components/ui/Toast'
import { pushNote, pushMedia } from '@/lib/sync'
import { getStats } from '@/lib/storage'
import { RIBBON_ITEMS } from '@/lib/data'

interface Msg { type: 'ai' | 'user'; text: string }
type Cat = 'ai' | 'note' | 'achievement' | 'skill' | 'plan'

interface Memory {
  id: string
  label: string
  emoji?: string
  src?: string       // base64 rasm/video thumbnail
  color: string
  accent: string
}

const CATS: Array<{ id: Cat; label: string }> = [
  { id: 'ai',          label: 'AI'      },
  { id: 'note',        label: 'Eslatma' },
  { id: 'achievement', label: 'Yutuq'   },
  { id: 'skill',       label: 'Skill'   },
  { id: 'plan',        label: 'Reja'    },
]

const AI_REPLIES = [
  'Saqlandi. Keyinroq eslataman.',
  "Xotiraga qo'shildi.",
  'Tasnif qilindi va arxivlandi.',
  'Maqsad belgilandi. Kuzataman.',
  "Portfolio'ga qo'shilsinmi? Aytasiz.",
]

const PANELS = [
  {
    id: 'notes', key: 'notes', color: '#3b82f6', label: 'Eslatmalar',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
  },
  {
    id: 'library', key: 'total', color: '#22d3ee', label: 'Arxiv',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  },
  {
    id: 'media', key: 'images', color: '#10b981', label: 'Media',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>,
  },
]

// Seed memories from RIBBON_ITEMS
const SEED_MEMORIES: Memory[] = RIBBON_ITEMS.map(r => ({
  id: 'seed-' + r.label,
  label: r.label,
  emoji: r.emoji,
  color: r.color,
  accent: r.accent,
}))

export default function HomePage() {
  const { setActiveTab, stats, setStats } = useAppStore()

  const [msgs, setMsgs]         = useState<Msg[]>([{ type:'ai', text:'Salom! Xotira, eslatma yoki savol yozing.' }])
  const [input, setInput]       = useState('')
  const [cat, setCat]           = useState<Cat>('ai')
  const [sending, setSending]   = useState(false)
  const [chatFull, setChatFull] = useState(false)
  const [memories, setMemories] = useState<Memory[]>(SEED_MEMORIES)

  const chatRef       = useRef<HTMLDivElement>(null)
  const taRef         = useRef<HTMLTextAreaElement>(null)
  const trackRef      = useRef<HTMLDivElement>(null)
  const animRef       = useRef(0)
  const posRef        = useRef(0)
  const pausedRef     = useRef(false)
  const fileRef       = useRef<HTMLInputElement>(null)
  const memFileRef    = useRef<HTMLInputElement>(null)
  // Touch drag
  const touchStartX   = useRef(0)
  const touchLastPos  = useRef(0)
  const isDragging    = useRef(false)

  useEffect(() => { setStats(getStats()) }, [setStats])

  // ── Uzluksiz ribbon scroll ──────────────────────────────────────────────────
  useEffect(() => {
    cancelAnimationFrame(animRef.current)
    posRef.current = 0

    const track = trackRef.current
    if (!track) return

    // Kutib turish — DOM renderdan keyin o'lcham aniq bo'ladi
    const start = () => {
      const tick = () => {
        if (!pausedRef.current) {
          posRef.current += 0.55
          // Yarmi = bitta set kengligi — shu yerga yetganda boshiga qayt
          const half = track.scrollWidth / 2
          if (half > 0 && posRef.current >= half) posRef.current -= half
          track.style.transform = `translateX(-${posRef.current.toFixed(2)}px)`
        }
        animRef.current = requestAnimationFrame(tick)
      }
      animRef.current = requestAnimationFrame(tick)
    }

    // 100ms kuting — memories o'zgarganda DOM qayta render bo'ladi
    const t = setTimeout(start, 100)
    return () => { clearTimeout(t); cancelAnimationFrame(animRef.current) }
  }, [memories])

  // ── Xotiraga rasm/video qo'shish ────────────────────────────────────────────
  function handleMemoryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    e.target.value = ''

    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/')
      const label   = file.name.replace(/\.[^.]+$/, '').slice(0, 20)

      const readAndAdd = (src: string) => {
        const newMem: Memory = {
          id:     Date.now().toString() + Math.random(),
          label,
          src,
          color:  '#0c1220',
          accent: '#3b82f6',
        }
        setMemories(prev => [newMem, ...prev])
        // Media sahifasiga ham qo'shish
        pushMedia({
          id:    newMem.id,
          emoji: isVideo ? '🎬' : '🖼️',
          title: label,
          date:  new Date().toLocaleDateString('uz'),
          type:  isVideo ? 'video' : 'rasm',
          color: '#111827',
        })
        setStats(getStats())
        showToast(`"${label}" qo'shildi`)
      }

      if (isVideo) {
        // Video uchun thumbnail yasash
        const url    = URL.createObjectURL(file)
        const video  = document.createElement('video')
        video.src    = url
        video.currentTime = 0.5
        video.muted  = true
        video.playsInline = true
        video.onloadeddata = () => {
          const canvas  = document.createElement('canvas')
          canvas.width  = 200
          canvas.height = 300
          const ctx = canvas.getContext('2d')!
          // Letter-box / crop
          const vr = video.videoWidth  / video.videoHeight
          const cr = canvas.width / canvas.height
          let sx=0, sy=0, sw=video.videoWidth, sh=video.videoHeight
          if (vr > cr) { sw = sh * cr; sx = (video.videoWidth - sw)/2 }
          else         { sh = sw / cr; sy = (video.videoHeight - sh)/2 }
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
          readAndAdd(canvas.toDataURL('image/jpeg', 0.7))
          URL.revokeObjectURL(url)
        }
        video.onerror = () => { readAndAdd(''); URL.revokeObjectURL(url) }
      } else {
        // Rasm uchun FileReader + canvas crop
        const reader = new FileReader()
        reader.onload = ev => {
          const src = ev.target?.result as string
          const img = new Image()
          img.onload = () => {
            const canvas  = document.createElement('canvas')
            canvas.width  = 200
            canvas.height = 300
            const ctx = canvas.getContext('2d')!
            const ir = img.width / img.height
            const cr = canvas.width / canvas.height
            let sx=0, sy=0, sw=img.width, sh=img.height
            if (ir > cr) { sw = sh * cr; sx = (img.width - sw)/2 }
            else         { sh = sw / cr; sy = (img.height - sh)/2 }
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
            readAndAdd(canvas.toDataURL('image/jpeg', 0.75))
          }
          img.src = src
        }
        reader.readAsDataURL(file)
      }
    })
  }

  // ── Chat ────────────────────────────────────────────────────────────────────
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
    setMsgs(p => [...p, { type:'user', text }])
    setSending(true)
    if (cat === 'note' || cat === 'ai') {
      pushNote({ id: Date.now().toString(), title: text.slice(0,60), pre: text.slice(0,80), tag:'Eslatma', date:'Hozir', content: text })
    }
    setStats(getStats())
    setTimeout(() => {
      setMsgs(p => [...p, { type:'ai', text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)] }])
      setSending(false)
    }, 500 + Math.random() * 600)
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    // Chat papka (+) orqali media qo'shish
    const files = e.target.files
    if (!files?.length) return
    e.target.value = ''
    // Ribbon ga ham qo'shish uchun handleMemoryUpload ni qayta ishlatamiz
    const dt = new DataTransfer()
    Array.from(files).forEach(f => dt.items.add(f))
    const fakeEvt = { target: { files: dt.files, value:'' }, currentTarget: {} } as any
    handleMemoryUpload(fakeEvt)
  }

  // ── Ribbon karta komponenti ────────────────────────────────────────────────
  const MemCard = ({ m }: { m: Memory }) => (
    <div
      style={{ flexShrink:0, cursor:'pointer', userSelect:'none' }}
      onClick={() => showToast(m.label)}

    >
      <div style={{
        width: 76, height: 104,
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        background: m.src ? '#000' : `linear-gradient(155deg, ${m.color}, #05080f)`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='scale(1.06)'; (e.currentTarget as HTMLElement).style.boxShadow='0 6px 24px rgba(0,0,0,0.6)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow='0 2px 12px rgba(0,0,0,0.4)' }}
      >
        {m.src ? (
          <>
            <img src={m.src} alt={m.label} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
          </>
        ) : (
          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 34 }}>
            {m.emoji}
          </div>
        )}
      </div>
      <div style={{
        fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)',
        textAlign: 'center', marginTop: 6,
        width: 76, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
        fontWeight: 500, letterSpacing: '0.01em',
      }}>
        {m.label}
      </div>
    </div>
  )

  // ── Chat bubbles ────────────────────────────────────────────────────────────
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
            {[0, 0.2, 0.4].map((d,i) => (
              <span key={i} style={{ width:5, height:5, borderRadius:'50%', background:'var(--text3)', display:'inline-block', animation:`dot 1s ${d}s ease-in-out infinite` }}/>
            ))}
          </div>
        </div>
      )}
    </>
  )

  // ── Input bar ──────────────────────────────────────────────────────────────
  const InputBar = (
    <div style={{ padding:'8px 12px 10px', background:'var(--bg)', borderTop:'1px solid var(--border)', flexShrink:0 }}>
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
            display:'grid', placeItems:'center', transition:'background 0.15s',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
          </button>
        </div>
      </div>
    </div>
  )

  // ── Full chat view ─────────────────────────────────────────────────────────
  if (chatFull) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--bg)' }}>
        <div style={{ height:48, flexShrink:0, display:'flex', alignItems:'center', gap:10, padding:'0 14px', borderBottom:'1px solid var(--border)' }}>
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
        <input ref={fileRef} type="file" multiple accept="image/*,video/*,audio/*" onChange={onFiles} style={{ display:'none' }} />
        <style>{`@keyframes dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}`}</style>
      </div>
    )
  }

  // ── Home view ──────────────────────────────────────────────────────────────
  const doubled = [...memories, ...memories]

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:'var(--bg)' }}>

      {/* Ribbon header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 10px', flexShrink:0 }}>
        <span style={{ fontSize:'0.58rem', color:'var(--text3)', letterSpacing:'0.16em', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>
          Xotiralar
        </span>
        <button
          onClick={() => memFileRef.current?.click()}
          style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:20, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', cursor:'pointer', fontSize:'0.7rem', color:'var(--accent2)', fontFamily:'var(--font)', fontWeight:500, whiteSpace:'nowrap' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Qo'shish
        </button>
        <input ref={memFileRef} type="file" accept="image/*,video/*" multiple onChange={handleMemoryUpload} style={{ display:'none' }} />
      </div>

      {/* Ribbon scroll */}
      <div style={{ flexShrink:0, position:'relative', overflow:'hidden', paddingBottom:4 }}>
        {/* Edge fades */}
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:28, background:'linear-gradient(90deg,var(--bg),transparent)', zIndex:3, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:28, background:'linear-gradient(-90deg,var(--bg),transparent)', zIndex:3, pointerEvents:'none' }} />

        <div
          style={{ paddingLeft:12, paddingRight:12, cursor:'grab', userSelect:'none' }}
          onTouchStart={e => {
            isDragging.current = true
            touchStartX.current = e.touches[0].clientX
            touchLastPos.current = posRef.current
            pausedRef.current = true
          }}
          onTouchMove={e => {
            if (!isDragging.current) return
            const dx = touchStartX.current - e.touches[0].clientX
            const track = trackRef.current
            if (!track) return
            const half = track.scrollWidth / 2
            let next = touchLastPos.current + dx
            if (next < 0) next += half
            if (next >= half) next -= half
            posRef.current = next
            track.style.transform = `translateX(-${next.toFixed(2)}px)`
          }}
          onTouchEnd={() => {
            isDragging.current = false
            setTimeout(() => { pausedRef.current = false }, 2000)
          }}
          onMouseDown={e => {
            isDragging.current = true
            touchStartX.current = e.clientX
            touchLastPos.current = posRef.current
            pausedRef.current = true
            ;(e.currentTarget as HTMLElement).style.cursor = 'grabbing'
          }}
          onMouseMove={e => {
            if (!isDragging.current) return
            const dx = touchStartX.current - e.clientX
            const track = trackRef.current
            if (!track) return
            const half = track.scrollWidth / 2
            let next = touchLastPos.current + dx
            if (next < 0) next += half
            if (next >= half) next -= half
            posRef.current = next
            track.style.transform = `translateX(-${next.toFixed(2)}px)`
          }}
          onMouseUp={e => {
            isDragging.current = false
            ;(e.currentTarget as HTMLElement).style.cursor = 'grab'
            setTimeout(() => { pausedRef.current = false }, 1500)
          }}
          onMouseLeave={e => {
            if (isDragging.current) {
              isDragging.current = false
              ;(e.currentTarget as HTMLElement).style.cursor = 'grab'
            }
            pausedRef.current = false
          }}
        >
          <div ref={trackRef} style={{ display:'flex', gap:10, width:'max-content', willChange:'transform', pointerEvents: isDragging.current ? 'none' : 'auto' }}>
            {doubled.map((m, i) => <MemCard key={i} m={m} />)}
          </div>
        </div>
      </div>

      {/* Panels */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, padding:'10px 12px 8px', flexShrink:0 }}>
        {PANELS.map(p => (
          <button key={p.id} onClick={() => setActiveTab(p.id as any)} style={{
            borderRadius:14, padding:'14px 10px',
            background:'var(--card)', border:'1px solid var(--border)',
            cursor:'pointer', textAlign:'left', display:'flex', flexDirection:'column', gap:8,
            transition:'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <div style={{ width:34, height:34, borderRadius:10, background: p.color+'18', display:'grid', placeItems:'center', fontSize:16 }}>{p.icon}</div>
            <div>
              <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text)', marginBottom:2 }}>{p.label}</div>
              <div style={{ fontSize:'0.72rem', color:p.color, fontWeight:600, fontFamily:'var(--font-mono)' }}>{(stats as any)[p.key] ?? 0}</div>
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
      <input ref={fileRef} type="file" multiple accept="image/*,video/*,audio/*" onChange={onFiles} style={{ display:'none' }} />
      <style>{`@keyframes dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}`}</style>
    </div>
  )
}
