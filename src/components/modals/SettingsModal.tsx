'use client'
// src/components/modals/SettingsModal.tsx
import { useAppStore } from '@/hooks/useAppStore'

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width:40, height:22, borderRadius:11, cursor:'pointer', border:'none',
      background: on ? 'var(--accent)' : 'var(--card2)', position:'relative',
      transition:'background 0.2s', flexShrink:0,
    }}>
      <span style={{
        position:'absolute', width:16, height:16, borderRadius:'50%', background:'#fff',
        top:3, left: on ? 21 : 3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  )
}

export default function SettingsModal() {
  const { settingsOpen, setSettingsOpen, lang, setLang, theme, setTheme, setUser, setIsLoggedIn } = useAppStore()
  if (!settingsOpen) return null

  function doLogout() {
    setUser(null); setIsLoggedIn(false)
    setSettingsOpen(false)
    window.location.href = '/api/auth/logout'
  }

  const ROW: React.CSSProperties = {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'13px 0', borderBottom:'1px solid var(--border)',
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) setSettingsOpen(false) }}
      style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', padding:16 }}>
      <div style={{
        background:'var(--card)', border:'1px solid var(--border)',
        borderRadius:20, padding:24, width:'min(360px,92vw)',
        boxShadow:'0 24px 64px rgba(0,0,0,0.7)',
        animation:'slideDown 0.2s ease',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h3 style={{ fontWeight:700, fontSize:'1.05rem' }}>Sozlamalar</h3>
          <button onClick={() => setSettingsOpen(false)} style={{ width:30, height:30, borderRadius:8, background:'var(--card2)', border:'1px solid var(--border)', cursor:'pointer', color:'var(--text2)', display:'grid', placeItems:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={ROW}>
          <div>
            <div style={{ fontSize:'0.88rem', fontWeight:500 }}>Til</div>
            <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginTop:2 }}>Interfeys tili</div>
          </div>
          <div style={{ display:'flex', background:'var(--card2)', border:'1px solid var(--border)', borderRadius:8, padding:3, gap:2 }}>
            {(['uz','en'] as const).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding:'5px 12px', borderRadius:6, border:'none', cursor:'pointer',
                fontSize:'0.75rem', fontWeight:700, fontFamily:'var(--font-mono)',
                background: lang===l ? 'var(--accent)' : 'transparent',
                color: lang===l ? '#fff' : 'var(--text3)', transition:'all 0.15s',
              }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div style={ROW}>
          <div style={{ fontSize:'0.88rem', fontWeight:500 }}>Qorong'u tema</div>
          <Toggle on={theme==='dark'} onClick={() => setTheme(theme==='dark' ? 'light' : 'dark')} />
        </div>

        <div style={{ ...ROW, borderBottom:'none' }}>
          <div style={{ fontSize:'0.88rem', fontWeight:500 }}>Yorug' tema</div>
          <Toggle on={theme==='light'} onClick={() => setTheme(theme==='dark' ? 'light' : 'dark')} />
        </div>

        <button onClick={() => setSettingsOpen(false)} style={{ marginTop:20, width:'100%', padding:'11px', background:'var(--accent)', border:'none', borderRadius:11, color:'#fff', fontSize:'0.88rem', fontFamily:'var(--font)', fontWeight:600, cursor:'pointer' }}>
          Yopish
        </button>
        <button onClick={doLogout} style={{ marginTop:8, width:'100%', padding:'10px', background:'transparent', border:'1px solid rgba(239,68,68,0.25)', borderRadius:11, color:'var(--red)', fontSize:'0.84rem', fontFamily:'var(--font)', cursor:'pointer' }}>
          Hisobdan chiqish
        </button>
      </div>
    </div>
  )
}
