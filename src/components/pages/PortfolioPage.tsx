'use client'
import { showToast } from '@/components/ui/Toast'
// src/components/pages/PortfolioPage.tsx
import { useState, useEffect } from 'react'
import { useAppStore } from '@/hooks/useAppStore'

import { loadProfile, pushProfile } from '@/lib/sync'

type PfTab = 'skills' | 'ach' | 'projects'

export default function PortfolioPage() {
  const { user, setUser, setIsLoggedIn } = useAppStore()
  const [pfTab, setPfTab]       = useState<PfTab>('skills')
  const [skills, setSkillsState] = useState<string[]>([])
  const [editingBio, setEditingBio] = useState(false)
  const [bio, setBioState]      = useState('')

  useEffect(() => {
    loadProfile().then(p => { setSkillsState(p.skills); setBioState(p.bio) })
  }, [])

  function addSkill() {
    const s = prompt('Yangi skill kiriting:')
    if (s?.trim()) {
      const updated = [...skills, s.trim()]
      setSkillsState(updated)
      pushProfile({ skills: updated })
    }
  }

  function removeSkill(s: string) {
    const updated = skills.filter(x => x !== s)
    setSkillsState(updated)
    pushProfile({ skills: updated })
  }

  function saveBioLocal() {
    pushProfile({ bio })
    setEditingBio(false)
  }

  function doLogout() {
    setUser(null)
    setIsLoggedIn(false)
    window.location.href = '/api/auth/logout'
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* Cover */}
      <div style={{ height: 140, background: 'var(--bg2)', position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
      </div>

      <div style={{ padding: '0 20px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -36, marginBottom: 14 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', display: 'grid', placeItems: 'center', fontSize: '1.8rem', fontWeight: 700, border: '3px solid var(--bg)', boxShadow: '0 0 30px rgba(59,130,246,0.3)', color: '#fff', cursor: 'pointer' }}>
            {user?.initial || 'U'}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => showToast('🔗 Link nusxalandi!')} style={{ padding: '7px 14px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--text2)', fontSize: '0.8rem', cursor: 'pointer' }}>🔗 Ulashish</button>
            <button onClick={() => setEditingBio(!editingBio)} style={{ padding: '7px 14px', borderRadius: 8, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', border: 'none', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>✏️ Tahrirlash</button>
          </div>
        </div>

        <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font)', fontWeight: 800, marginBottom: 4 }}>{user?.name || 'Foydalanuvchi'}</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 10 }}>@{user?.name?.toLowerCase().replace(' ', '') || 'user'} · emro.pro</div>

        {editingBio ? (
          <div>
            <textarea value={bio} onChange={e => setBioState(e.target.value)} autoFocus style={{ width: '100%', background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)', fontSize: '0.86rem', fontFamily: 'var(--font)', outline: 'none', resize: 'none', marginBottom: 8 }} rows={3} />
            <button onClick={saveBioLocal} style={{ padding: '6px 14px', borderRadius: 8, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', border: 'none', color: '#fff', fontSize: '0.8rem', cursor: 'pointer' }}>Saqlash</button>
          </div>
        ) : (
          <p style={{ fontSize: '0.86rem', color: 'var(--text2)', marginBottom: 14, lineHeight: 1.6 }}>{bio}</p>
        )}

        <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: '0.78rem', color: 'var(--text3)' }}>
          <span>📍 Toshkent</span>
          <span>📅 {user?.joined || new Date().getFullYear()} yildan beri</span>
        </div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 20, padding: '14px 0', borderTop: '1px solid var(--border2)', borderBottom: '1px solid var(--border2)' }}>
          {[{ n: '0', l: 'Xotira' }, { n: '4', l: 'Yutuq' }, { n: `${skills.length}`, l: 'Skill' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font)', background: 'linear-gradient(135deg,#fff,var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.n}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div onClick={() => showToast('🤖 AI rezyume tayyorlanmoqda...')} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', cursor: 'pointer', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'grid', placeItems: 'center' }}>📄</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>AI Professional Rezyume yaratish</p>
            <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Barcha yutuq va skilllardan avtomatik tuziladi</span>
          </div>
          <span style={{ color: 'var(--text3)' }}>→</span>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(59,130,246,0.04)', border: '1px solid var(--border2)', borderRadius: 10, padding: 4 }}>
          {(['skills', 'ach', 'projects'] as PfTab[]).map(tab => (
            <button key={tab} onClick={() => setPfTab(tab)} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: pfTab === tab ? 600 : 400, background: pfTab === tab ? 'linear-gradient(135deg,var(--accent),var(--accent2))' : 'transparent', color: pfTab === tab ? '#fff' : 'var(--text3)', transition: 'all 0.2s' }}>
              {tab === 'skills' ? '💡 Skilllar' : tab === 'ach' ? '🏆 Yutuqlar' : '💼 Loyihalar'}
            </button>
          ))}
        </div>

        {pfTab === 'skills' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skills.map(s => (
              <span key={s} onClick={() => removeSkill(s)} style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent2)', fontSize: '0.82rem', cursor: 'pointer' }} title="O'chirish uchun bosing">{s} ×</span>
            ))}
            <span onClick={addSkill} style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(59,130,246,0.04)', border: '1px dashed rgba(59,130,246,0.2)', color: 'var(--text3)', fontSize: '0.82rem', cursor: 'pointer' }}>+ Skill qo&apos;shish</span>
          </div>
        )}

        {pfTab === 'ach' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🥇', title: 'Birinchi freelance loyiha — $500 topdim', date: '2024 yil Mart' },
              { icon: '🎓', title: 'TUIT bakalavr diplomi — GPA 3.8',         date: '2023 yil Iyun' },
              { icon: '🚀', title: 'Birinchi React ilovam App Store da',       date: '2024 yil Sentyabr' },
              { icon: '🏅', title: "Toshkent Hackathon — 2-o'rin",            date: '2023 yil Noyabr' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.1)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 3 }}>{a.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pfTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🤖', title: 'Emro — Personal AI Memory App',        tech: 'React · Node.js · Claude API' },
              { icon: '🛒', title: 'E-commerce Platform — 500+ foydalanuvchi', tech: 'Next.js · Stripe · MongoDB'    },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59,130,246,0.08)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 3 }}>{p.tech}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logout */}
        <button onClick={doLogout} style={{ marginTop: 28, width: '100%', padding: '11px', background: 'transparent', border: '1px solid rgba(255,69,96,0.2)', borderRadius: 12, color: 'var(--red)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font)' }}>
          🚪 Hisobdan chiqish
        </button>
      </div>
    </div>
  )
}
