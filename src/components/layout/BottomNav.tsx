'use client'
// src/components/layout/BottomNav.tsx
import { useAppStore } from '@/hooks/useAppStore'
import { Tab } from '@/types'

const NAV_ITEMS: Array<{ id: Tab; uz: string; en: string; icon: React.ReactNode }> = [
  { id: 'home',      uz: 'Bosh',      en: 'Home',    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'notes',     uz: 'Notes',     en: 'Notes',   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { id: 'media',     uz: 'Media',     en: 'Media',   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { id: 'library',   uz: 'Kutubxona', en: 'Library', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { id: 'portfolio', uz: 'Profil',    en: 'Profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
]

export default function BottomNav() {
  const { activeTab, setActiveTab, lang } = useAppStore()

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 'calc(62px + max(0px,env(safe-area-inset-bottom)))', background: 'rgba(6,8,14,0.97)', borderTop: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(24px)', zIndex: 90, display: 'flex', alignItems: 'flex-start', paddingTop: 4 }} className="mobile-only">
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', padding: '0 4px' }}>
        {NAV_ITEMS.map(item => {
          const active = activeTab === item.id
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer', color: active ? 'var(--cyan)' : 'var(--text3)', transition: 'color 0.2s', WebkitTapHighlightColor: 'transparent', position: 'relative' }}>
              {active && <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 40, height: 40, borderRadius: 12, background: 'rgba(0,212,255,0.08)', zIndex: 0 }} />}
              <span style={{ opacity: active ? 1 : 0.55, position: 'relative', zIndex: 1 }}>{item.icon}</span>
              <span style={{ fontSize: '0.6rem', fontWeight: active ? 600 : 400, position: 'relative', zIndex: 1 }}>{lang === 'uz' ? item.uz : item.en}</span>
              {active && <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
