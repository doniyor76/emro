'use client'
// src/components/layout/Navbar.tsx — desktop only
import { useAppStore } from '@/hooks/useAppStore'

export default function Navbar() {
  const {
    user, activeTab, setActiveTab,
    setSettingsOpen, setUser, setIsLoggedIn,
    profileDDOpen, setProfileDDOpen,
  } = useAppStore()
  const isHome = activeTab === 'home'

  function doLogout() {
    setUser(null); setIsLoggedIn(false)
    setProfileDDOpen(false)
    window.location.href = '/api/auth/logout'
  }

  const NAV_TABS = [
    { id: 'home',      label: 'Bosh'      },
    { id: 'notes',     label: 'Eslatmalar'},
    { id: 'media',     label: 'Media'     },
    { id: 'library',   label: 'Arxiv'     },
    { id: 'portfolio', label: 'Profil'    },
  ]

  return (
    <nav className="desktop-only" style={{
      height: 52, flexShrink: 0,
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 8,
      background: 'rgba(8,12,20,0.98)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      position: 'relative', zIndex: 100,
    }}>

      {/* Brand */}
      <div onClick={() => setActiveTab('home')} style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', cursor:'pointer', marginRight:12, lineHeight:1 }}>
        <span style={{ fontSize:'0.5rem', fontWeight:600, letterSpacing:'0.22em', color:'var(--accent2)', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>pro</span>
        <span style={{ fontFamily:'var(--font)', fontSize:'1.05rem', fontWeight:800, color:'var(--text)', letterSpacing:'-0.01em' }}>Emro</span>
      </div>

      {/* Nav tabs */}
      <div style={{ display:'flex', gap:2 }}>
        {NAV_TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{
            padding:'6px 12px', borderRadius:8, border:'none',
            background: activeTab===t.id ? 'rgba(59,130,246,0.1)' : 'transparent',
            color: activeTab===t.id ? 'var(--accent2)' : 'var(--text3)',
            fontSize:'0.82rem', fontWeight: activeTab===t.id ? 600 : 400,
            cursor:'pointer', transition:'all 0.15s', fontFamily:'var(--font)',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ flex:1 }} />

      {/* Settings */}
      <button onClick={() => setSettingsOpen(true)} style={{
        width:34, height:34, borderRadius:9,
        background:'transparent', border:'1px solid var(--border)',
        display:'grid', placeItems:'center',
        cursor:'pointer', color:'var(--text3)',
        transition:'all 0.15s',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      {/* Avatar */}
      <div style={{ position:'relative' }}>
        <button onClick={() => setProfileDDOpen(!profileDDOpen)} style={{
          width:32, height:32, borderRadius:9,
          background:'linear-gradient(135deg,#3b82f6,#22d3ee)',
          border: profileDDOpen ? '2px solid var(--accent2)' : '2px solid transparent',
          fontWeight:700, fontSize:'0.85rem', color:'#fff',
          cursor:'pointer', display:'grid', placeItems:'center',
          boxShadow:'0 2px 8px rgba(59,130,246,0.3)',
        }}>
          {user?.initial || 'U'}
        </button>

        {profileDDOpen && (
          <>
            <div onClick={() => setProfileDDOpen(false)} style={{ position:'fixed', inset:0, zIndex:98 }} />
            <div style={{
              position:'absolute', top:42, right:0,
              background:'var(--card)', border:'1px solid var(--border)',
              borderRadius:14, padding:8, width:210, zIndex:99,
              boxShadow:'0 16px 48px rgba(0,0,0,0.6)',
              animation:'slideDown 0.18s ease',
            }}>
              <div style={{ padding:'8px 12px 10px', borderBottom:'1px solid var(--border)', marginBottom:4 }}>
                <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{user?.name}</div>
                <div style={{ fontSize:'0.7rem', color:'var(--text3)', marginTop:1 }}>{user?.email}</div>
              </div>
              {[
                { label:'Profil', action:()=>{ setActiveTab('portfolio'); setProfileDDOpen(false) } },
                { label:'Sozlamalar', action:()=>{ setSettingsOpen(true); setProfileDDOpen(false) } },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'none', background:'transparent', color:'var(--text2)', fontSize:'0.84rem', cursor:'pointer', fontFamily:'var(--font)', textAlign:'left' }}>
                  {item.label}
                </button>
              ))}
              <div style={{ height:1, background:'var(--border)', margin:'6px 4px' }} />
              <button onClick={doLogout} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'none', background:'transparent', color:'var(--red)', fontSize:'0.84rem', cursor:'pointer', fontFamily:'var(--font)', textAlign:'left' }}>
                Chiqish
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
