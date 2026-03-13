'use client'
// src/components/layout/Navbar.tsx
import { useAppStore } from '@/hooks/useAppStore'
import { showToast }   from '@/components/ui/Toast'

export default function Navbar() {
  const { user, lang, setLang, activeTab, setActiveTab, notifOpen, setNotifOpen, profileDDOpen, setProfileDDOpen, setSettingsOpen, setUser, setIsLoggedIn } = useAppStore()

  function doLogout() {
    setUser(null)
    setIsLoggedIn(false)
    showToast('Chiqildi')
    window.location.href = '/api/auth/logout'
  }

  const showBack = activeTab !== 'home'

  return (
    <nav style={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, background: 'rgba(6,8,12,0.95)', borderBottom: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(24px)', position: 'relative', zIndex: 100 }} className="desktop-only">

      {showBack && (
        <button onClick={() => setActiveTab('home')} style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--card)', border: '1px solid rgba(0,212,255,0.12)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text2)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
      )}

      <div onClick={() => setProfileDDOpen(!profileDDOpen)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 9px 4px 4px', borderRadius: 8 }}>
        <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', borderRadius: 8, display: 'grid', placeItems: 'center', boxShadow: '0 0 16px rgba(0,212,255,0.45)', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/><path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, background: 'linear-gradient(135deg,#fff,var(--cyan2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>LifeVault</span>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <button onClick={() => setLang(lang === 'uz' ? 'en' : 'uz')} style={{ height: 28, padding: '0 9px', borderRadius: 6, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: 'var(--text3)', fontSize: '0.66rem', fontWeight: 600, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>UZ / EN</button>
        <button onClick={() => setNotifOpen(!notifOpen)} style={{ width: 32, height: 32, borderRadius: 7, background: 'transparent', border: '1px solid transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text2)', position: 'relative' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span style={{ position: 'absolute', top: 6, right: 6, width: 5, height: 5, borderRadius: '50%', background: 'var(--cyan)', border: '1.5px solid var(--bg)' }} />
        </button>
        <button onClick={() => setSettingsOpen(true)} style={{ width: 32, height: 32, borderRadius: 7, background: 'transparent', border: '1px solid transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text2)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>

      {profileDDOpen && (
        <div style={{ position: 'absolute', top: 48, left: 16, background: 'rgba(7,9,18,0.97)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 16, padding: 14, width: 220, zIndex: 200, animation: 'dropIn 0.2s ease', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, marginBottom: 8, borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', display: 'grid', placeItems: 'center', fontWeight: 700, flexShrink: 0 }}>{user?.initial || 'U'}</div>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user?.name || 'Foydalanuvchi'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{user?.email}</div>
            </div>
          </div>
          {[
            { label: lang === 'uz' ? 'Profil' : 'Profile',       action: () => { setActiveTab('portfolio'); setProfileDDOpen(false) } },
            { label: lang === 'uz' ? 'Sozlamalar' : 'Settings',   action: () => { setSettingsOpen(true); setProfileDDOpen(false) } },
          ].map(item => (
            <div key={item.label} onClick={item.action} style={{ padding: '9px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text2)' }}>{item.label}</div>
          ))}
          <div style={{ height: 1, background: 'rgba(0,212,255,0.08)', margin: '6px 0' }} />
          <div onClick={doLogout} style={{ padding: '9px 10px', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--red)' }}>
            {lang === 'uz' ? 'Chiqish' : 'Sign Out'}
          </div>
        </div>
      )}

      {notifOpen && (
        <div style={{ position: 'absolute', top: 48, right: 50, background: 'rgba(7,9,18,0.97)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 16, padding: 14, width: 280, zIndex: 200, animation: 'dropIn 0.2s ease', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>{lang === 'uz' ? 'Bildirishnomalar' : 'Notifications'}</h4>
            <span onClick={() => setNotifOpen(false)} style={{ fontSize: '0.75rem', color: 'var(--text3)', cursor: 'pointer' }}>✓ {lang === 'uz' ? "O'qildi" : 'Read'}</span>
          </div>
          {[
            { text: lang === 'uz' ? "AI 3 ta xotirani tasniflab qo'ydi" : 'AI categorized 3 memories', time: lang === 'uz' ? '5 daqiqa' : '5 min ago' },
            { text: lang === 'uz' ? "2 yil oldin: \"Tog' safari\" xotirangiz" : '2 years ago: "Mountain trip"', time: lang === 'uz' ? '1 soat' : '1 hour ago' },
            { text: lang === 'uz' ? 'Portfolio yangilandi' : 'Portfolio updated', time: lang === 'uz' ? 'Kecha' : 'Yesterday' },
          ].map((n, i) => (
            <div key={i} style={{ padding: '9px 0', borderBottom: i < 2 ? '1px solid rgba(0,212,255,0.06)' : 'none' }}>
              <p style={{ fontSize: '0.82rem', marginBottom: 3 }}>{n.text}</p>
              <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{n.time}</span>
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
