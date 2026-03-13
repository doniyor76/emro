'use client'
// src/components/layout/BottomNav.tsx
import { useAppStore } from '@/hooks/useAppStore'
import { Tab } from '@/types'

const ITEMS: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
  { id: 'home', label: 'Bosh', icon:
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  },
  { id: 'notes', label: 'Eslatma', icon:
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  },
  { id: 'media', label: 'Media', icon:
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  },
  { id: 'library', label: 'Arxiv', icon:
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  },
  { id: 'portfolio', label: 'Profil', icon:
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  },
]

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav className="mobile-only" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(8,12,20,0.98)',
      borderTop: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <div style={{ display: 'flex', height: 58 }}>
        {ITEMS.map(item => {
          const on = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 3,
                background: 'none', border: 'none', cursor: 'pointer',
                color: on ? 'var(--accent2)' : 'var(--text3)',
                transition: 'color 0.15s',
                position: 'relative',
              }}
            >
              {on && (
                <span style={{
                  position: 'absolute', top: 6, width: 32, height: 32,
                  borderRadius: 10, background: 'rgba(59,130,246,0.1)',
                }} />
              )}
              <span style={{ position: 'relative', opacity: on ? 1 : 0.6, transition: 'opacity 0.15s' }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: '0.58rem', fontWeight: on ? 600 : 400,
                letterSpacing: '0.01em',
                position: 'relative',
              }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
