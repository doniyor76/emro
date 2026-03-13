'use client'
// src/components/pages/LoginScreen.tsx
// 3 qism: Email/parol kirish → Google button → Ro'yxatdan o'tish

import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/hooks/useAppStore'

type Lang3 = 'uz' | 'en' | 'ru'
type Mode  = 'login' | 'register'

const T: Record<Lang3, {
  tagline: string; desc: string
  emailPlaceholder: string; passwordPlaceholder: string
  namePlaceholder: string; confirmPlaceholder: string
  loginBtn: string; registerBtn: string
  googleBtn: string; loading: string
  noAccount: string; hasAccount: string
  signupLink: string; loginLink: string
  orDivider: string
  errors: { required: string; short: string; badEmail: string; noMatch: string }
}> = {
  uz: {
    tagline:          'HAYOTINGIZNI SAQLANG · AI TARTIBLESIN',
    desc:             'Barcha xotiralaringiz bir joyda',
    emailPlaceholder: 'Email manzilingiz',
    passwordPlaceholder: 'Parolingiz',
    namePlaceholder:  'To\'liq ismingiz',
    confirmPlaceholder: 'Parolni tasdiqlang',
    loginBtn:         'Kirish',
    registerBtn:      'Ro\'yxatdan o\'tish',
    googleBtn:        'Google orqali davom etish',
    loading:          'Yuklanmoqda...',
    noAccount:        'Hisob yo\'qmi?',
    hasAccount:       'Hisob bormi?',
    signupLink:       'Ro\'yxatdan o\'ting',
    loginLink:        'Kiring',
    orDivider:        'yoki',
    errors: {
      required: 'Barcha maydonlarni to\'ldiring',
      short:    'Parol kamida 6 ta belgi',
      badEmail: 'Email noto\'g\'ri',
      noMatch:  'Parollar mos kelmadi',
    },
  },
  en: {
    tagline:          'SAVE YOUR LIFE · LET AI ORGANIZE',
    desc:             'All your memories in one place',
    emailPlaceholder: 'Your email address',
    passwordPlaceholder: 'Your password',
    namePlaceholder:  'Your full name',
    confirmPlaceholder: 'Confirm password',
    loginBtn:         'Sign In',
    registerBtn:      'Create Account',
    googleBtn:        'Continue with Google',
    loading:          'Loading...',
    noAccount:        'No account?',
    hasAccount:       'Have an account?',
    signupLink:       'Sign up',
    loginLink:        'Sign in',
    orDivider:        'or',
    errors: {
      required: 'Fill in all fields',
      short:    'Password min 6 characters',
      badEmail: 'Invalid email',
      noMatch:  'Passwords do not match',
    },
  },
  ru: {
    tagline:          'СОХРАНИ ЖИЗНЬ · ПУСТЬ AI ОРГАНИЗУЕТ',
    desc:             'Все ваши воспоминания в одном месте',
    emailPlaceholder: 'Ваш email',
    passwordPlaceholder: 'Ваш пароль',
    namePlaceholder:  'Ваше полное имя',
    confirmPlaceholder: 'Подтвердите пароль',
    loginBtn:         'Войти',
    registerBtn:      'Зарегистрироваться',
    googleBtn:        'Войти через Google',
    loading:          'Загрузка...',
    noAccount:        'Нет аккаунта?',
    hasAccount:       'Есть аккаунт?',
    signupLink:       'Зарегистрируйтесь',
    loginLink:        'Войдите',
    orDivider:        'или',
    errors: {
      required: 'Заполните все поля',
      short:    'Пароль минимум 6 символов',
      badEmail: 'Неверный email',
      noMatch:  'Пароли не совпадают',
    },
  },
}

// Input style helper
function inputStyle(focus: boolean, err: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '11px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: `1.5px solid ${err ? 'rgba(255,69,96,0.6)' : focus ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10, color: 'var(--text)',
    fontSize: '0.9rem', fontFamily: 'var(--font)',
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  }
}

export default function LoginScreen() {
  const { setLang } = useAppStore()
  const [lang, setLang3] = useState<Lang3>('uz')
  const [mode, setMode]  = useState<Mode>('login')

  // Form fields
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [showCf,   setShowCf]   = useState(false)

  // Focus states
  const [focusName,  setFocusName]  = useState(false)
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPw,    setFocusPw]    = useState(false)
  const [focusCf,    setFocusCf]    = useState(false)

  // Submit state
  const [loading,  setLoading]  = useState(false)
  const [googleLd, setGoogleLd] = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)

  function changeLang(l: Lang3) {
    setLang3(l)
    setLang(l === 'ru' ? 'uz' : l)
  }

  // Stars background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let af: number
    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.004 + 0.001,
    }))
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      af = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.a += s.sp
        const alpha = (Math.sin(s.a) * 0.45 + 0.55) * 0.55 + 0.05
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,210,255,${alpha.toFixed(2)})`
        ctx.fill()
      })
    }
    draw()
    return () => { cancelAnimationFrame(af); window.removeEventListener('resize', resize) }
  }, [])

  // Clear error on mode switch
  function switchMode(m: Mode) {
    setMode(m)
    setError('')
    setSuccess('')
    setName(''); setEmail(''); setPassword(''); setConfirm('')
  }

  // Validate
  function validate(): string | null {
    const t = T[lang]
    if (mode === 'register' && !name.trim())         return t.errors.required
    if (!email.trim() || !password)                  return t.errors.required
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  return t.errors.badEmail
    if (password.length < 6)                          return t.errors.short
    if (mode === 'register' && password !== confirm)  return t.errors.noMatch
    return null
  }

  async function doSubmit() {
    if (loading) return
    setError('')
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const body     = mode === 'login'
      ? { email: email.trim(), password }
      : { name: name.trim(), email: email.trim(), password }

    try {
      const res  = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Xatolik yuz berdi')
      } else {
        // Success — reload page so App.tsx re-fetches session
        window.location.reload()
      }
    } catch {
      setError('Tarmoq xatosi. Qayta urinib ko\'ring.')
    } finally {
      setLoading(false)
    }
  }

  function doGoogle() {
    if (googleLd) return
    setGoogleLd(true)
    window.location.href = '/api/auth/google'
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') doSubmit()
  }

  const t = T[lang]

  // Eye icon SVG
  const EyeIcon = ({ show }: { show: boolean }) => show
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

  return (
    <div style={{ position:'fixed', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', overflow:'hidden' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:0 }} />

      {/* Glow orbs */}
      <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none' }}>
        <div style={{ position:'absolute', width:500, height:500, top:-180, left:-120, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 70%)', filter:'blur(60px)', animation:'orbFloat 9s ease-in-out infinite alternate' }} />
        <div style={{ position:'absolute', width:420, height:420, bottom:-120, right:-80, borderRadius:'50%', background:'radial-gradient(circle,rgba(79,142,247,0.08) 0%,transparent 70%)', filter:'blur(80px)', animation:'orbFloat 7s ease-in-out infinite alternate-reverse' }} />
      </div>

      {/* Scrollable container */}
      <div style={{ position:'relative', zIndex:10, width:'min(400px,94vw)', maxHeight:'96vh', overflowY:'auto', scrollbarWidth:'none' }}>

        {/* Rotating border wrapper */}
        <div style={{ position:'relative', padding:2, borderRadius:22 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:22, background:'conic-gradient(from var(--angle),#00d4ff,#4f8ef7,#7c4dff,#ff4d9e,#f0a500,#00e5a0,#00d4ff)', animation:'rotateBorder 3s linear infinite', zIndex:0 }} />

          <div style={{ position:'relative', zIndex:1, background:'rgba(6,8,16,0.97)', border:'1px solid rgba(0,212,255,0.08)', borderRadius:20, padding:'28px 26px 24px', backdropFilter:'blur(40px)', boxShadow:'0 40px 100px rgba(0,0,0,0.85)' }}>

            {/* Lang switcher */}
            <div style={{ position:'absolute', top:14, right:14, display:'flex', gap:3 }}>
              {(['uz','en','ru'] as Lang3[]).map(l => (
                <button key={l} onClick={() => changeLang(l)} style={{ background: lang===l ? 'rgba(0,212,255,0.15)':'rgba(255,255,255,0.05)', border:`1px solid ${lang===l ? 'rgba(0,212,255,0.4)':'rgba(255,255,255,0.1)'}`, borderRadius:5, color: lang===l ? 'var(--cyan)':'rgba(255,255,255,0.45)', fontSize:'0.58rem', fontWeight:700, fontFamily:'var(--font-mono)', padding:'3px 6px', cursor:'pointer', textTransform:'uppercase' }}>{l}</button>
              ))}
            </div>

            {/* Logo */}
            <div style={{ textAlign:'center', marginBottom:22 }}>
              <div style={{ width:52, height:52, margin:'0 auto 12px', background:'linear-gradient(135deg,var(--blue),var(--cyan))', borderRadius:15, display:'grid', placeItems:'center', boxShadow:'0 0 36px rgba(0,212,255,0.45)' }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5"/>
                  <path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', fontWeight:800, background:'linear-gradient(135deg,#fff 10%,var(--cyan2) 70%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:4 }}>LifeVault</h1>
              <p style={{ fontSize:'0.55rem', color:'var(--text3)', letterSpacing:'0.13em', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>{t.tagline}</p>
            </div>

            {/* ── MODE TABS ── */}
            <div style={{ display:'flex', gap:0, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:3, marginBottom:20 }}>
              {(['login','register'] as Mode[]).map(m => (
                <button key={m} onClick={() => switchMode(m)} style={{ flex:1, padding:'8px', borderRadius:7, border:'none', cursor:'pointer', fontSize:'0.82rem', fontWeight: mode===m ? 700 : 400, background: mode===m ? 'linear-gradient(135deg,var(--blue),var(--cyan))' : 'transparent', color: mode===m ? '#fff':'var(--text3)', transition:'all 0.2s', fontFamily:'var(--font)' }}>
                  {m === 'login' ? (lang === 'uz' ? 'Kirish' : lang === 'en' ? 'Sign In' : 'Войти') : (lang === 'uz' ? 'Ro\'yxatdan o\'tish' : lang === 'en' ? 'Register' : 'Регистрация')}
                </button>
              ))}
            </div>

            {/* ── EMAIL/PASSWORD FORM ── */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

              {/* Name (register only) */}
              {mode === 'register' && (
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input
                    type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusName(true)} onBlur={() => setFocusName(false)}
                    onKeyDown={onKey}
                    placeholder={t.namePlaceholder}
                    style={{ ...inputStyle(focusName, false), paddingLeft:38 }}
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)}
                  onKeyDown={onKey}
                  placeholder={t.emailPlaceholder}
                  style={{ ...inputStyle(focusEmail, false), paddingLeft:38 }}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusPw(true)} onBlur={() => setFocusPw(false)}
                  onKeyDown={onKey}
                  placeholder={t.passwordPlaceholder}
                  style={{ ...inputStyle(focusPw, false), paddingLeft:38, paddingRight:40 }}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button onClick={() => setShowPw(p => !p)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex', alignItems:'center', padding:4 }}>
                  <EyeIcon show={showPw} />
                </button>
              </div>

              {/* Confirm (register only) */}
              {mode === 'register' && (
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showCf ? 'text' : 'password'} value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onFocus={() => setFocusCf(true)} onBlur={() => setFocusCf(false)}
                    onKeyDown={onKey}
                    placeholder={t.confirmPlaceholder}
                    style={{ ...inputStyle(focusCf, confirm !== '' && confirm !== password), paddingLeft:38, paddingRight:40 }}
                    autoComplete="new-password"
                  />
                  <button onClick={() => setShowCf(p => !p)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex', alignItems:'center', padding:4 }}>
                    <EyeIcon show={showCf} />
                  </button>
                  {/* Password match indicator */}
                  {confirm.length > 0 && (
                    <span style={{ position:'absolute', right:38, top:'50%', transform:'translateY(-50%)', fontSize:13 }}>
                      {confirm === password ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ padding:'9px 12px', background:'rgba(255,69,96,0.08)', border:'1px solid rgba(255,69,96,0.25)', borderRadius:8, fontSize:'0.8rem', color:'#ff8099', display:'flex', alignItems:'center', gap:7 }}>
                  ⚠️ {error}
                </div>
              )}
              {success && (
                <div style={{ padding:'9px 12px', background:'rgba(0,229,160,0.08)', border:'1px solid rgba(0,229,160,0.25)', borderRadius:8, fontSize:'0.8rem', color:'var(--green)' }}>
                  ✅ {success}
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={doSubmit}
                disabled={loading}
                style={{ width:'100%', padding:'12px', background: loading ? 'rgba(0,212,255,0.15)' : 'linear-gradient(135deg,var(--blue),var(--cyan))', border:'none', borderRadius:11, color:'#fff', fontSize:'0.93rem', fontWeight:700, cursor: loading ? 'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'var(--font)', boxShadow: loading ? 'none':'0 0 24px rgba(0,212,255,0.3)', transition:'all 0.2s', opacity: loading ? 0.7:1 }}
              >
                {loading ? (
                  <><div style={{ width:18, height:18, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#fff', animation:'spin 0.7s linear infinite' }} />{t.loading}</>
                ) : (
                  mode === 'login' ? t.loginBtn : t.registerBtn
                )}
              </button>
            </div>

            {/* ── OR DIVIDER ── */}
            <div style={{ display:'flex', alignItems:'center', gap:10, margin:'18px 0' }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize:'0.72rem', color:'var(--text3)', letterSpacing:'0.06em' }}>{t.orDivider}</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
            </div>

            {/* ── GOOGLE BUTTON ── */}
            <button
              onClick={doGoogle}
              disabled={googleLd}
              style={{ width:'100%', padding:'12px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:11, color:'var(--text)', fontSize:'0.9rem', fontWeight:600, cursor: googleLd ? 'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:11, opacity: googleLd ? 0.7:1, transition:'all 0.2s', fontFamily:'var(--font)', boxShadow:'0 2px 10px rgba(0,0,0,0.25)' }}
              onMouseEnter={e => { if (!googleLd) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
            >
              {googleLd ? (
                <><div style={{ width:18, height:18, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.15)', borderTopColor:'var(--cyan)', animation:'spin 0.7s linear infinite' }} />{t.loading}</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  {t.googleBtn}
                </>
              )}
            </button>

            {/* Footer */}
            <p style={{ textAlign:'center', fontSize:'0.63rem', color:'var(--text3)', marginTop:18, lineHeight:1.5 }}>
              {mode === 'login' ? t.noAccount : t.hasAccount}{' '}
              <span onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} style={{ color:'var(--cyan)', cursor:'pointer', textDecoration:'underline' }}>
                {mode === 'login' ? t.signupLink : t.loginLink}
              </span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes rotateBorder { to { --angle: 360deg; } }
        @keyframes orbFloat { from{transform:translate(0,0)} to{transform:translate(30px,20px)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
