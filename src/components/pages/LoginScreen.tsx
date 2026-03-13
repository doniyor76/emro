'use client'
// src/components/pages/LoginScreen.tsx
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/hooks/useAppStore'

type Mode = 'login' | 'register'

function InputField({ icon, type, value, onChange, placeholder, showToggle, onToggle, error, autoComplete }: {
  icon: React.ReactNode; type: string; value: string
  onChange: (v: string) => void; placeholder: string
  showToggle?: boolean; onToggle?: () => void
  error?: boolean; autoComplete?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position:'relative' }}>
      <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color: focused ? 'var(--accent2)' : 'var(--text3)', pointerEvents:'none', transition:'color 0.15s' }}>
        {icon}
      </span>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          width:'100%', padding:'12px 14px 12px 40px',
          background:'var(--card)', color:'var(--text)',
          border:`1.5px solid ${error ? '#ef4444' : focused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius:10, fontSize:'0.9rem', fontFamily:'var(--font)',
          outline:'none', transition:'border-color 0.15s',
          paddingRight: showToggle ? 40 : 14,
        }}
      />
      {showToggle && onToggle && (
        <button onClick={onToggle} type="button" style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex', padding:4 }}>
          {type === 'password'
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          }
        </button>
      )}
    </div>
  )
}

export default function LoginScreen() {
  const { setLang } = useAppStore()
  const [mode, setMode]     = useState<Mode>('login')
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [pw, setPw]         = useState('')
  const [cf, setCf]         = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCf, setShowCf] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error, setError]       = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Subtle star background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let af: number
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.003 + 0.0005,
    }))
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      af = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.a += s.sp
        const alpha = (Math.sin(s.a) * 0.3 + 0.7) * 0.25
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,220,255,${alpha.toFixed(2)})`
        ctx.fill()
      })
    }
    draw()
    return () => { cancelAnimationFrame(af); window.removeEventListener('resize', resize) }
  }, [])

  function switchMode(m: Mode) {
    setMode(m); setError('')
    setName(''); setEmail(''); setPw(''); setCf('')
  }

  function validate() {
    if (mode === 'register' && !name.trim()) return 'Ismingizni kiriting'
    if (!email.trim()) return 'Email kiriting'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email noto\'g\'ri'
    if (!pw) return 'Parol kiriting'
    if (pw.length < 6) return 'Parol kamida 6 ta belgi'
    if (mode === 'register' && pw !== cf) return 'Parollar mos kelmadi'
    return null
  }

  async function submit() {
    if (loading) return
    const err = validate()
    if (err) { setError(err); return }
    setError(''); setLoading(true)

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const body     = mode === 'login' ? { email: email.trim(), password: pw } : { name: name.trim(), email: email.trim(), password: pw }

    try {
      const res  = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Xatolik yuz berdi') }
      else { window.location.reload() }
    } catch { setError('Tarmoq xatosi. Qayta urinib ko\'ring.') }
    finally  { setLoading(false) }
  }

  function doGoogle() {
    if (gLoading) return
    setGLoading(true)
    window.location.href = '/api/auth/google'
  }

  const icons = {
    user:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    email: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    lock:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  }

  return (
    <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:0 }} />

      {/* Soft glow */}
      <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none' }}>
        <div style={{ position:'absolute', width:400, height:400, top:-100, left:-100, borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)', filter:'blur(60px)' }} />
        <div style={{ position:'absolute', width:300, height:300, bottom:-80, right:-60, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,211,238,0.05) 0%,transparent 70%)', filter:'blur(60px)' }} />
      </div>

      <div style={{ position:'relative', zIndex:10, width:'min(390px,94vw)', maxHeight:'95vh', overflowY:'auto', scrollbarWidth:'none' }}>
        <div style={{
          background:'rgba(10,14,24,0.96)',
          border:'1px solid var(--border)',
          borderRadius:20, padding:'32px 28px 28px',
          backdropFilter:'blur(32px)',
          boxShadow:'0 32px 80px rgba(0,0,0,0.7)',
        }}>

          {/* Brand */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', marginBottom:12 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#3b82f6,#22d3ee)', display:'grid', placeItems:'center', boxShadow:'0 4px 20px rgba(59,130,246,0.35)', marginBottom:12 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span style={{ fontSize:'0.5rem', fontWeight:600, letterSpacing:'0.25em', color:'var(--accent2)', textTransform:'uppercase', fontFamily:'var(--font-mono)', display:'block', marginBottom:2 }}>pro</span>
              <h1 style={{ fontFamily:'var(--font)', fontSize:'1.8rem', fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em', lineHeight:1 }}>Emro</h1>
            </div>
            <p style={{ fontSize:'0.8rem', color:'var(--text3)' }}>Barcha xotiralaringiz bir joyda</p>
          </div>

          {/* Mode tabs */}
          <div style={{ display:'flex', background:'var(--card)', border:'1px solid var(--border)', borderRadius:11, padding:3, marginBottom:20, gap:3 }}>
            {(['login','register'] as Mode[]).map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex:1, padding:'9px', borderRadius:8, border:'none', cursor:'pointer',
                fontSize:'0.84rem', fontWeight: mode===m ? 700 : 400,
                background: mode===m ? 'var(--accent)' : 'transparent',
                color: mode===m ? '#fff' : 'var(--text3)',
                transition:'all 0.15s', fontFamily:'var(--font)',
              }}>
                {m === 'login' ? 'Kirish' : 'Ro\'yxatdan o\'tish'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {mode === 'register' && (
              <InputField icon={icons.user} type="text" value={name} onChange={setName}
                placeholder="To'liq ismingiz" autoComplete="name" />
            )}
            <InputField icon={icons.email} type="email" value={email} onChange={setEmail}
              placeholder="Email manzilingiz" autoComplete="email" />
            <InputField icon={icons.lock} type={showPw ? 'text' : 'password'} value={pw} onChange={setPw}
              placeholder="Parolingiz" showToggle onToggle={() => setShowPw(p => !p)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
            {mode === 'register' && (
              <div style={{ position:'relative' }}>
                <InputField icon={icons.lock} type={showCf ? 'text' : 'password'} value={cf} onChange={setCf}
                  placeholder="Parolni tasdiqlang" showToggle onToggle={() => setShowCf(p => !p)}
                  error={cf.length > 0 && cf !== pw} autoComplete="new-password" />
                {cf.length > 0 && (
                  <span style={{ position:'absolute', right:42, top:'50%', transform:'translateY(-50%)', fontSize:13 }}>
                    {cf === pw ? '✓' : '✗'}
                  </span>
                )}
              </div>
            )}

            {error && (
              <div style={{ padding:'10px 12px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:9, fontSize:'0.8rem', color:'#fca5a5', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ flexShrink:0 }}>!</span> {error}
              </div>
            )}

            <button onClick={submit} disabled={loading} style={{
              width:'100%', padding:'12px', borderRadius:11, border:'none',
              background: loading ? 'rgba(59,130,246,0.4)' : 'var(--accent)',
              color:'#fff', fontSize:'0.92rem', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              fontFamily:'var(--font)', transition:'opacity 0.15s', opacity: loading ? 0.7 : 1,
              boxShadow:'0 2px 12px rgba(59,130,246,0.25)',
            }}>
              {loading
                ? <><div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite' }}/> Yuklanmoqda...</>
                : (mode === 'login' ? 'Kirish' : 'Hisob yaratish')
              }
            </button>
          </div>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'18px 0' }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
            <span style={{ fontSize:'0.72rem', color:'var(--text3)' }}>yoki</span>
            <div style={{ flex:1, height:1, background:'var(--border)' }} />
          </div>

          {/* Google */}
          <button onClick={doGoogle} disabled={gLoading} style={{
            width:'100%', padding:'12px 16px',
            background:'var(--card)', border:'1px solid var(--border)',
            borderRadius:11, color:'var(--text)',
            fontSize:'0.9rem', fontWeight:500, cursor: gLoading ? 'not-allowed':'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            opacity: gLoading ? 0.7 : 1, transition:'all 0.15s',
            fontFamily:'var(--font)',
          }}
          onMouseEnter={e => { if (!gLoading) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-accent)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}>
            {gLoading
              ? <><div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.15)', borderTopColor:'var(--accent2)', animation:'spin 0.7s linear infinite' }}/> Yuklanmoqda...</>
              : <>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Google orqali davom etish
                </>
            }
          </button>

          {/* Switch link */}
          <p style={{ textAlign:'center', fontSize:'0.75rem', color:'var(--text3)', marginTop:18 }}>
            {mode === 'login' ? 'Hisob yo\'qmi? ' : 'Hisob bormi? '}
            <span onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              style={{ color:'var(--accent2)', cursor:'pointer' }}>
              {mode === 'login' ? 'Ro\'yxatdan o\'ting' : 'Kiring'}
            </span>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
    </div>
  )
}
