'use client'
// src/components/layout/MobileTopbar.tsx
// Orqaga tugmasi → account chiqarmaydi, faqat tab ga qaytadi
import { useEffect, useState } from 'react'
import { useAppStore } from '@/hooks/useAppStore'

export default function MobileTopbar() {
  const {
    activeTab, setActiveTab, user,
    setSettingsOpen, setUser, setIsLoggedIn
  } = useAppStore()

  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const isHome = activeTab === 'home'

  // Android back button — faqat tab o'zgartiradi, accountdan chiqarmaydi
  useEffect(() => {
    const onBack = (e: PopStateEvent) => {
      e.preventDefault()
      if (!isHome) {
        setActiveTab('home')
        window.history.pushState(null, '', window.location.href)
      }
      // Home da esa hech narsa qilma (saytni yopma)
    }
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', onBack)
    return () => window.removeEventListener('popstate', onBack)
  }, [isHome, setActiveTab])

  function goBack() {
    setActiveTab('home')
    setMenuOpen(false)
    setAvatarOpen(false)
  }

  function doLogout() {
    setUser(null)
    setIsLoggedIn(false)
    setAvatarOpen(false)
    window.location.href = '/api/auth/logout'
  }

  const PAGE_TITLES: Record<string, string> = {
    home: '', notes: 'Eslatmalar', media: 'Media',
    library: 'Arxiv', portfolio: 'Profil', chat: 'AI Chat',
  }

  return (
    <div className="mobile-only" style={{
      height: 52, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px',
      background: 'rgba(8,12,20,0.98)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      position: 'relative', zIndex: 50,
    }}>

      {/* Left — back or menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 44 }}>
        {!isHome ? (
          <button onClick={goBack} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--card)', border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
            cursor: 'pointer', color: 'var(--text2)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
          </button>
        ) : (
          <button onClick={() => { setMenuOpen(p => !p); setAvatarOpen(false) }} style={{
            width: 36, height: 36, borderRadius: 10,
            background: menuOpen ? 'rgba(59,130,246,0.1)' : 'transparent',
            border: '1px solid ' + (menuOpen ? 'var(--border-accent)' : 'transparent'),
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 4, cursor: 'pointer',
          }}>
            <span style={{ display:'block', width:16, height:1.5, borderRadius:2, background: menuOpen ? 'var(--accent2)' : 'var(--text2)', transition:'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(5.5px)' : 'none' }} />
            <span style={{ display:'block', width:16, height:1.5, borderRadius:2, background: menuOpen ? 'var(--accent2)' : 'var(--text2)', transition:'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display:'block', width:16, height:1.5, borderRadius:2, background: menuOpen ? 'var(--accent2)' : 'var(--text2)', transition:'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-5.5px)' : 'none' }} />
          </button>
        )}
      </div>

      {/* Center — brand or page title */}
      <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', textAlign:'center' }}>
        {isHome ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', lineHeight:1 }}>
            <span style={{ fontSize:'0.52rem', fontWeight:600, letterSpacing:'0.2em', color:'var(--accent2)', textTransform:'uppercase', fontFamily:'var(--font-mono)', marginBottom:1 }}>pro</span>
            <span style={{ fontFamily:'var(--font)', fontSize:'1.05rem', fontWeight:800, color:'var(--text)', letterSpacing:'-0.01em' }}>Emro</span>
          </div>
        ) : (
          <span style={{ fontSize:'0.92rem', fontWeight:600, color:'var(--text)' }}>
            {PAGE_TITLES[activeTab] || ''}
          </span>
        )}
      </div>

      {/* Right — avatar */}
      <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:44, justifyContent:'flex-end' }}>
        <button onClick={() => { setAvatarOpen(p => !p); setMenuOpen(false) }} style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg,#3b82f6,#22d3ee)',
          border: avatarOpen ? '2px solid var(--accent2)' : '2px solid transparent',
          display: 'grid', placeItems: 'center',
          fontWeight: 700, fontSize: '0.85rem', color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
        }}>
          {user?.initial || 'U'}
        </button>
      </div>

      {/* Hamburger menu */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:98 }} />
          <div style={{
            position:'absolute', top:54, left:12,
            background:'var(--card)', border:'1px solid var(--border)',
            borderRadius:16, padding:8, width:200, zIndex:99,
            boxShadow:'0 16px 48px rgba(0,0,0,0.6)',
            animation:'slideDown 0.18s ease',
          }}>
            {[
              { tab:'home',      icon:'⌂', label:'Bosh sahifa' },
              { tab:'notes',     icon:'📝', label:'Eslatmalar'  },
              { tab:'media',     icon:'🖼', label:'Media'       },
              { tab:'library',   icon:'📚', label:'Arxiv'       },
              { tab:'portfolio', icon:'👤', label:'Profil'      },
            ].map(item => (
              <button key={item.tab} onClick={() => { setActiveTab(item.tab as any); setMenuOpen(false) }}
                style={{
                  width:'100%', padding:'10px 12px', borderRadius:9,
                  border:'none', background: activeTab===item.tab ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: activeTab===item.tab ? 'var(--accent2)' : 'var(--text2)',
                  fontSize:'0.86rem', fontWeight: activeTab===item.tab ? 600 : 400,
                  cursor:'pointer', display:'flex', alignItems:'center', gap:10,
                  fontFamily:'var(--font)', textAlign:'left',
                }}>
                <span style={{ fontSize:16 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
            <div style={{ height:1, background:'var(--border)', margin:'6px 4px' }} />
            <button onClick={() => { setSettingsOpen(true); setMenuOpen(false) }}
              style={{ width:'100%', padding:'10px 12px', borderRadius:9, border:'none', background:'transparent', color:'var(--text2)', fontSize:'0.86rem', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font)', textAlign:'left' }}>
              <span style={{ fontSize:16 }}>⚙</span> Sozlamalar
            </button>
          </div>
        </>
      )}

      {/* Avatar dropdown */}
      {avatarOpen && (
        <>
          <div onClick={() => setAvatarOpen(false)} style={{ position:'fixed', inset:0, zIndex:98 }} />
          <div style={{
            position:'absolute', top:54, right:12,
            background:'var(--card)', border:'1px solid var(--border)',
            borderRadius:16, padding:8, width:210, zIndex:99,
            boxShadow:'0 16px 48px rgba(0,0,0,0.6)',
            animation:'slideDown 0.18s ease',
          }}>
            <div style={{ padding:'10px 12px 12px', borderBottom:'1px solid var(--border)', marginBottom:4 }}>
              <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:2 }}>{user?.name || 'Foydalanuvchi'}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--text3)' }}>{user?.email}</div>
            </div>
            <button onClick={() => { setActiveTab('portfolio'); setAvatarOpen(false) }}
              style={{ width:'100%', padding:'10px 12px', borderRadius:9, border:'none', background:'transparent', color:'var(--text2)', fontSize:'0.86rem', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font)', textAlign:'left' }}>
              <span style={{ fontSize:16 }}>👤</span> Profilni ko'rish
            </button>
            <button onClick={() => { setSettingsOpen(true); setAvatarOpen(false) }}
              style={{ width:'100%', padding:'10px 12px', borderRadius:9, border:'none', background:'transparent', color:'var(--text2)', fontSize:'0.86rem', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font)', textAlign:'left' }}>
              <span style={{ fontSize:16 }}>⚙</span> Sozlamalar
            </button>
            <div style={{ height:1, background:'var(--border)', margin:'6px 4px' }} />
            <button onClick={doLogout}
              style={{ width:'100%', padding:'10px 12px', borderRadius:9, border:'none', background:'transparent', color:'var(--red)', fontSize:'0.86rem', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font)', textAlign:'left' }}>
              <span style={{ fontSize:16 }}>→</span> Chiqish
            </button>
          </div>
        </>
      )}
    </div>
  )
}
