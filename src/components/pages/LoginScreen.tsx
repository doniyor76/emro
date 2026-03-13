'use client'
// src/components/pages/LoginScreen.tsx
import { useState, useEffect, useRef } from 'react'
import { showToast } from '@/components/ui/Toast'
import { useAppStore } from '@/hooks/useAppStore'

type Lang3 = 'uz' | 'en' | 'ru'

const T: Record<Lang3, { tagline: string; google: string; waiting: string; desc: string }> = {
  uz: {
    tagline: 'HAYOTINGIZNI SAQLANG · AI TARTIBLESIN',
    google:  'Google orqali kirish',
    waiting: 'Yuklanmoqda...',
    desc:    'Barcha xotiralaringiz, eslatmalaringiz va yutuqlaringiz bir joyda.',
  },
  en: {
    tagline: 'SAVE YOUR LIFE · LET AI ORGANIZE',
    google:  'Continue with Google',
    waiting: 'Loading...',
    desc:    'All your memories, notes and achievements in one place.',
  },
  ru: {
    tagline: 'СОХРАНИ ЖИЗНЬ · ПУСТЬ AI ОРГАНИЗУЕТ',
    google:  'Войти через Google',
    waiting: 'Загрузка...',
    desc:    'Все ваши воспоминания, заметки и достижения в одном месте.',
  },
}

export default function LoginScreen() {
  const { setLang } = useAppStore()
  const [lang, setLang3]   = useState<Lang3>('uz')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function changeLang(l: Lang3) {
    setLang3(l)
    setLang(l === 'ru' ? 'uz' : l)
  }

  // Animated stars background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let af: number
    const stars = Array.from({ length: 130 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.2,
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
        const alpha = (Math.sin(s.a) * 0.5 + 0.5) * 0.7 + 0.1
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,200,255,${alpha.toFixed(2)})`
        ctx.fill()
      })
    }
    draw()
    return () => { cancelAnimationFrame(af); window.removeEventListener('resize', resize) }
  }, [])

  function doGoogle() {
    if (loading) return
    setLoading(true)
    // /api/auth/google route Google ga yo'naltiradi
    window.location.href = '/api/auth/google'
  }

  const { tagline, google, waiting, desc } = T[lang]

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: -180, left: -120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%)', filter: 'blur(60px)', animation: 'orbFloat 9s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', width: 420, height: 420, bottom: -120, right: -80, borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,142,247,0.09) 0%,transparent 70%)', filter: 'blur(80px)', animation: 'orbFloat 7s ease-in-out infinite alternate-reverse' }} />
      </div>

      {/* Card */}
      <div style={{ position: 'relative', zIndex: 10, width: 'min(400px, 94vw)' }}>
        {/* Rotating border */}
        <div style={{
          position: 'absolute', inset: -2, borderRadius: 22,
          background: 'conic-gradient(from var(--angle), #00d4ff, #4f8ef7, #7c4dff, #ff4d9e, #f0a500, #00e5a0, #00d4ff)',
          animation: 'rotateBorder 3s linear infinite', zIndex: -1,
        }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'var(--bg)', zIndex: -1, filter: 'blur(8px)', opacity: 0.5 }} />

        <div style={{
          background: 'rgba(7,9,16,0.95)',
          border: '1px solid rgba(0,212,255,0.1)',
          borderRadius: 20, padding: '40px 30px',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.85)',
          position: 'relative',
        }}>
          {/* Lang switcher */}
          <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 4 }}>
            {(['uz', 'en', 'ru'] as Lang3[]).map(l => (
              <button key={l} onClick={() => changeLang(l)} style={{
                background: lang === l ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${lang === l ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 6, color: lang === l ? 'var(--cyan)' : 'rgba(255,255,255,0.5)',
                fontSize: '0.6rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                padding: '4px 7px', cursor: 'pointer', textTransform: 'uppercase',
              }}>{l}</button>
            ))}
          </div>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64, height: 64, margin: '0 auto 16px',
              background: 'linear-gradient(135deg,var(--blue),var(--cyan))',
              borderRadius: 18, display: 'grid', placeItems: 'center',
              boxShadow: '0 0 48px rgba(0,212,255,0.5)',
            }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z"
                  fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5"/>
                <path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800,
              background: 'linear-gradient(135deg,#fff 10%,var(--cyan2) 70%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>LifeVault</h1>
            <p style={{
              fontSize: '0.58rem', color: 'var(--text3)', marginTop: 8,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
            }}>{tagline}</p>
          </div>

          {/* Description */}
          <p style={{
            textAlign: 'center', fontSize: '0.86rem', color: 'var(--text2)',
            lineHeight: 1.6, marginBottom: 32,
          }}>{desc}</p>

          {/* Google Button */}
          <button
            onClick={doGoogle}
            disabled={loading}
            style={{
              width: '100%', padding: '14px 18px',
              background: loading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12, color: 'var(--text)',
              fontSize: '0.95rem', fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              fontFamily: 'var(--font)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = loading ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)' }}
          >
            {loading ? (
              <>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: 'var(--cyan)', animation: 'spin 0.8s linear infinite' }} />
                <span>{waiting}</span>
              </>
            ) : (
              <>
                {/* Google SVG icon */}
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>{google}</span>
              </>
            )}
          </button>

          {/* Footer note */}
          <p style={{
            textAlign: 'center', fontSize: '0.65rem',
            color: 'var(--text3)', marginTop: 20, lineHeight: 1.5,
          }}>
            Kirish orqali siz maxfiylik shartlariga rozilik bildirasiz.
            <br />Ma&apos;lumotlaringiz qurilmangizda saqlanadi.
          </p>
        </div>
      </div>

      <style>{`
        @property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes rotateBorder { to { --angle: 360deg; } }
        @keyframes orbFloat { from{transform:translate(0,0)} to{transform:translate(30px,20px)} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
