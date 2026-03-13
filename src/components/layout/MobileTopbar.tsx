'use client'
// src/components/layout/MobileTopbar.tsx
import { useState } from 'react'
import { useAppStore } from '@/hooks/useAppStore'
import { showToast }   from '@/components/ui/Toast'

export default function MobileTopbar() {
  const { activeTab, setActiveTab, user, notifOpen, setNotifOpen, lang, setSettingsOpen, setUser, setIsLoggedIn } = useAppStore()
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const showBack = activeTab !== 'home'

  function doLogout() {
    setUser(null)
    setIsLoggedIn(false)
    showToast('Chiqildi')
    setAvatarOpen(false)
    window.location.href = '/api/auth/logout'
  }

  return (
    <div style={{ height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', background: 'rgba(6,8,14,0.97)', borderBottom: '1px solid rgba(0,212,255,0.08)', backdropFilter: 'blur(24px)', position: 'relative', zIndex: 50 }} className="mobile-only">

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showBack ? (
          <button onClick={() => setActiveTab('home')} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,212,255,0.12)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text2)' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
          </button>
        ) : (
          <button onClick={() => setMenuOpen(p => !p)} style={{ width: 36, height: 36, borderRadius: 10, background: menuOpen ? 'rgba(0,212,255,0.08)' : 'transparent', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4.5, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: 18, height: 2, borderRadius: 2, background: menuOpen ? 'var(--cyan)' : 'var(--text2)', transition: 'background 0.2s' }} />
            ))}
          </button>
        )}
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(135deg,#fff,var(--cyan2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.01em' }}>
          LifeVault
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button onClick={() => setNotifOpen(!notifOpen)} style={{ width: 36, height: 36, borderRadius: 10, background: 'transparent', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--text2)', position: 'relative' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{ position: 'absolute', top: 6, right: 7, width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', border: '1.5px solid var(--bg)', boxShadow: '0 0 6px var(--cyan)' }} />
        </button>

        <button onClick={() => setAvatarOpen(p => !p)} style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', border: '2px solid rgba(0,212,255,0.3)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 0 12px rgba(0,212,255,0.25)' }}>
          {user?.initial || 'U'}
        </button>
      </div>

      {/* Hamburger menu */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
          <div style={{ position: 'absolute', top: 54, left: 14, background: 'rgba(7,9,18,0.98)', border: '1px solid rgba(0,212,255,0.18)', borderRadius: 16, padding: 8, width: 200, zIndex: 99, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', animation: 'dropIn 0.18s ease' }}>
            {[
              { label: lang === 'uz' ? '🏠 Bosh sahifa' : '🏠 Home',    tab: 'home'      },
              { label: lang === 'uz' ? '📝 Notes'       : '📝 Notes',   tab: 'notes'     },
              { label: lang === 'uz' ? '🖼️ Media'        : '🖼️ Media',   tab: 'media'     },
              { label: lang === 'uz' ? '📚 Kutubxona'   : '📚 Library', tab: 'library'   },
              { label: lang === 'uz' ? '👤 Profil'       : '👤 Profile', tab: 'portfolio' },
            ].map(item => (
              <div key={item.tab} onClick={() => { setActiveTab(item.tab as any); setMenuOpen(false) }}
                style={{ padding: '10px 12px', borderRadius: 9, cursor: 'pointer', fontSize: '0.85rem', color: activeTab === item.tab ? 'var(--cyan)' : 'var(--text2)', background: activeTab === item.tab ? 'rgba(0,212,255,0.08)' : 'transparent' }}>
                {item.label}
              </div>
            ))}
            <div style={{ height: 1, background: 'rgba(0,212,255,0.08)', margin: '6px 0' }} />
            <div onClick={() => { setSettingsOpen(true); setMenuOpen(false) }} style={{ padding: '10px 12px', borderRadius: 9, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text2)' }}>
              ⚙️ {lang === 'uz' ? 'Sozlamalar' : 'Settings'}
            </div>
          </div>
        </>
      )}

      {/* Avatar dropdown */}
      {avatarOpen && (
        <>
          <div onClick={() => setAvatarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
          <div style={{ position: 'absolute', top: 54, right: 14, background: 'rgba(7,9,18,0.98)', border: '1px solid rgba(0,212,255,0.18)', borderRadius: 14, padding: 8, width: 200, zIndex: 99, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', animation: 'dropIn 0.18s ease' }}>
            <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid rgba(0,212,255,0.08)', marginBottom: 4 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name || 'Foydalanuvchi'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>{user?.email}</div>
            </div>
            <div onClick={() => { setActiveTab('portfolio'); setAvatarOpen(false) }} style={{ padding: '9px 12px', borderRadius: 9, cursor: 'pointer', fontSize: '0.83rem', color: 'var(--text2)' }}>
              👤 {lang === 'uz' ? 'Profilni ko\'rish' : 'View Profile'}
            </div>
            <div style={{ height: 1, background: 'rgba(0,212,255,0.08)', margin: '4px 0' }} />
            <div onClick={doLogout} style={{ padding: '9px 12px', borderRadius: 9, cursor: 'pointer', fontSize: '0.83rem', color: 'var(--red)' }}>
              🚪 {lang === 'uz' ? 'Chiqish' : 'Sign Out'}
            </div>
          </div>
        </>
      )}

      {/* Notifications */}
      {notifOpen && (
        <>
          <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
          <div style={{ position: 'absolute', top: 54, right: 14, background: 'rgba(7,9,18,0.98)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 16, padding: 14, width: 280, zIndex: 99, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', animation: 'dropIn 0.18s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>{lang === 'uz' ? 'Bildirishnomalar' : 'Notifications'}</h4>
              <span onClick={() => setNotifOpen(false)} style={{ fontSize: '0.75rem', color: 'var(--text3)', cursor: 'pointer' }}>✓ {lang === 'uz' ? "O'qildi" : 'Read'}</span>
            </div>
            {[
              { text: lang === 'uz' ? "AI 3 ta xotirani tasniflab qo'ydi" : 'AI categorized 3 memories', time: '5 min' },
              { text: lang === 'uz' ? "2 yil oldin: \"Tog' safari\""       : '2 years ago: Mountain trip',  time: '1h'    },
              { text: lang === 'uz' ? 'Portfolio yangilandi'                : 'Portfolio updated',            time: lang === 'uz' ? 'Kecha' : 'Yesterday' },
            ].map((n, i) => (
              <div key={i} style={{ padding: '9px 0', borderBottom: i < 2 ? '1px solid rgba(0,212,255,0.06)' : 'none' }}>
                <p style={{ fontSize: '0.82rem', marginBottom: 3 }}>{n.text}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{n.time}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
