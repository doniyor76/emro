'use client'
// src/components/pages/MediaPage.tsx
import { useState, useEffect, useRef } from 'react'
import { showToast } from '@/components/ui/Toast'
import { loadMedia, pushMedia } from '@/lib/sync'
import { getStats } from '@/lib/storage'
import { SEED_MEDIA } from '@/lib/data'
import { MediaItem } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'

type Filter = 'all' | 'rasm' | 'video'

export default function MediaPage() {
  const { setStats } = useAppStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [items, setItems]   = useState<MediaItem[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadMedia().then(saved => { setItems([...SEED_MEDIA, ...saved]) })
  }, [])

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    e.target.value = ''
    showToast(`📤 ${files.length} ta fayl saqlandi`)
    const newItems: MediaItem[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      emoji: file.type.startsWith('video') ? '🎬' : '🖼️',
      title: file.name,
      date:  new Date().toLocaleDateString(),
      type:  file.type.startsWith('video') ? 'video' : 'rasm',
      color: '#0f1b3a',
    }))
    newItems.forEach(pushMedia)
    setItems(prev => [...newItems, ...prev])
    setStats(getStats())
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter)

  const FILTERS: Array<{ id: Filter; label: string }> = [
    { id: 'all',   label: 'Barchasi'    },
    { id: 'rasm',  label: '📷 Rasmlar'  },
    { id: 'video', label: '🎬 Videolar' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 80px' }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font)', fontWeight: 800, marginBottom: 14, background: 'linear-gradient(135deg,#fff,var(--accent2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🖼️ Rasmlar & Videolar</h2>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid', borderColor: filter === f.id ? 'var(--accent2)' : 'rgba(59,130,246,0.15)', background: filter === f.id ? 'rgba(59,130,246,0.12)' : 'transparent', color: filter === f.id ? 'var(--accent2)' : 'var(--text3)', fontSize: '0.78rem', fontWeight: filter === f.id ? 600 : 400, cursor: 'pointer' }}>{f.label}</button>
            ))}
          </div>
        </div>

        <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed rgba(59,130,246,0.2)', borderRadius: 16, padding: '24px', textAlign: 'center', cursor: 'pointer', marginBottom: 20, background: 'rgba(59,130,246,0.02)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>☁️</div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 4 }}>Rasm yoki video yuklash</p>
          <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Bosing — JPG, PNG, MP4 qabul qilinadi</span>
        </div>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={onFiles} style={{ display: 'none' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12 }}>
          {filtered.map((item, i) => (
            <div key={item.id ?? i} onClick={() => showToast(`📖 ${item.title}`)} style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', background: item.color, border: '1px solid rgba(255,255,255,0.06)', aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative' }}>
              <span style={{ fontSize: 36 }}>{item.emoji}</span>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.8),transparent)', padding: '20px 10px 8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#fff' }}>{item.title}</div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>{item.date}</div>
              </div>
              {item.type === 'video' && (
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '2px 6px', fontSize: '0.6rem', color: '#fff' }}>▶ Video</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
