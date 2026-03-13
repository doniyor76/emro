'use client'
// src/components/App.tsx
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/hooks/useAppStore'
import { setLocalUser } from '@/lib/storage'
import LoginScreen   from './pages/LoginScreen'
import AppScreen     from './pages/AppScreen'
import Toast         from './ui/Toast'
import SettingsModal from './modals/SettingsModal'

export default function App() {
  const { isLoggedIn, setIsLoggedIn, setUser, theme } = useAppStore()
  const initialized = useRef(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const params = new URLSearchParams(window.location.search)
    if (params.get('auth_error')) window.history.replaceState(null, '', '/')

    fetch('/api/auth/session')
      .then(r => r.json())
      .then(({ user }) => {
        if (user) { setUser(user); setIsLoggedIn(true); setLocalUser(user) }
        else      { setIsLoggedIn(false); setLocalUser(null) }
        setChecking(false)
      })
      .catch(() => {
        try {
          const cached = localStorage.getItem('lv_user')
          if (cached) { const u = JSON.parse(cached); setUser(u); setIsLoggedIn(true) }
        } catch {}
        setChecking(false)
      })
  }, [setIsLoggedIn, setUser])

  if (checking) {
    return (
      <div style={{ position:'fixed', inset:0, background:'var(--bg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, zIndex:9999 }}>
        <div style={{ width:64, height:64, background:'linear-gradient(135deg,var(--blue),var(--cyan))', borderRadius:18, display:'grid', placeItems:'center', boxShadow:'0 0 48px rgba(0,212,255,0.45)', animation:'pulse 1.8s ease-in-out infinite' }}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
            <path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:800, background:'linear-gradient(135deg,#fff,var(--cyan2))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>LifeVault</div>
        <div style={{ width:28, height:28, borderRadius:'50%', border:'2.5px solid rgba(0,212,255,0.15)', borderTopColor:'var(--cyan)', animation:'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{box-shadow:0 0 48px rgba(0,212,255,0.45)}50%{box-shadow:0 0 72px rgba(0,212,255,0.75)}}`}</style>
      </div>
    )
  }

  return (
    <>
      {isLoggedIn ? <AppScreen /> : <LoginScreen />}
      <SettingsModal />
      <Toast />
    </>
  )
}
