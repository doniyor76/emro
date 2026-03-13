'use client'
// src/components/modals/SettingsModal.tsx
import { useAppStore } from '@/hooks/useAppStore'

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ width: 42, height: 23, borderRadius: 12, background: on ? 'var(--blue)' : 'rgba(99,102,241,0.15)', border: `1px solid ${on ? 'var(--blue)' : 'rgba(99,102,241,0.2)'}`, position: 'relative', cursor: 'pointer', transition: 'all 0.25s', flexShrink: 0, boxShadow: on ? '0 0 12px rgba(99,102,241,0.4)' : 'none' }}>
      <span style={{ position: 'absolute', width: 17, height: 17, borderRadius: '50%', background: '#fff', top: 2, left: on ? 21 : 2, transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} />
    </button>
  )
}

export default function SettingsModal() {
  const { settingsOpen, setSettingsOpen, lang, setLang, theme, setTheme, showStars, setShowStars, setUser, setIsLoggedIn } = useAppStore()

  if (!settingsOpen) return null

  function doLogout() {
    setUser(null)
    setIsLoggedIn(false)
    setSettingsOpen(false)
    window.location.href = '/api/auth/logout'
  }

  const ROW: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 0', borderBottom: '1px solid rgba(99,102,241,0.08)',
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) setSettingsOpen(false) }} style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', padding: 16 }}>
      <div style={{ background: 'rgba(7,9,16,0.97)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 22, padding: 26, width: 'min(380px,92vw)', maxHeight: '88vh', overflowY: 'auto', animation: 'dropIn 0.2s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 30px 90px rgba(0,0,0,0.9)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, marginBottom: 20 }}>
          ⚙️ {lang === 'uz' ? 'Sozlamalar' : 'Settings'}
        </h3>

        <div style={ROW}>
          <div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text2)' }}>🌐 {lang === 'uz' ? 'Til' : 'Language'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 2 }}>{lang === 'uz' ? 'Interfeys tili' : 'Interface language'}</div>
          </div>
          <div style={{ display: 'flex', gap: 4, background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: 8, padding: 3 }}>
            {(['uz', 'en'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', background: lang === l ? 'linear-gradient(135deg,var(--blue),var(--cyan))' : 'transparent', color: lang === l ? '#fff' : 'var(--text3)' }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div style={ROW}>
          <div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text2)' }}>🌙 {lang === 'uz' ? "Qorong'u tema" : 'Dark Theme'}</div>
          </div>
          <Toggle on={theme === 'dark'} onClick={() => setTheme('dark')} />
        </div>

        <div style={ROW}>
          <div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text2)' }}>☀️ {lang === 'uz' ? "Yorug' tema" : 'Light Theme'}</div>
          </div>
          <Toggle on={theme === 'light'} onClick={() => setTheme('light')} />
        </div>

        <div style={{ ...ROW, borderBottom: 'none' }}>
          <div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text2)' }}>⭐ {lang === 'uz' ? 'Yulduzli animatsiya' : 'Star Animation'}</div>
          </div>
          <Toggle on={showStars} onClick={() => setShowStars(!showStars)} />
        </div>

        <button onClick={() => setSettingsOpen(false)} style={{ marginTop: 20, width: '100%', padding: 12, background: 'linear-gradient(135deg,var(--blue),var(--violet))', border: 'none', borderRadius: 12, color: '#fff', fontSize: '0.88rem', fontFamily: 'var(--font)', fontWeight: 600, cursor: 'pointer' }}>
          {lang === 'uz' ? 'Yopish' : 'Close'}
        </button>
        <button onClick={doLogout} style={{ marginTop: 8, width: '100%', padding: 10, background: 'transparent', border: '1px solid rgba(255,69,96,0.25)', borderRadius: 12, color: 'var(--red)', fontSize: '0.82rem', fontFamily: 'var(--font)', cursor: 'pointer' }}>
          {lang === 'uz' ? 'Hisobdan chiqish' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}
