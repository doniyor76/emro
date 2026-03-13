'use client'
// src/components/pages/ChatPage.tsx
import { useState, useRef, useEffect } from 'react'
import { saveNote, getStats } from '@/lib/storage'
import { useAppStore } from '@/hooks/useAppStore'

interface Message { type: 'ai' | 'user'; text: string; time: string }

function nowTime() {
  return new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' })
}

const AI_RESPONSES = [
  '✅ Yozganingiz saqlandi! AI tasnif qilmoqda...',
  "💡 Bu juda yaxshi g'oya! Xotirangizga qo'shildi.",
  '📝 Eslatma sifatida saqlandi.',
  '🎯 Maqsadingiz belgilandi! Kuzatib boraman.',
  "⭐ Ajoyib! Bu yutuqni portfolio'ngizga qo'shaylikmi?",
]

export default function ChatPage() {
  const { setStats } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([
    { type: 'ai', text: "Salom! Men LifeVault AI yordamchisiman. Xotiralaringiz, rejalaringiz yoki istalgan savol bo'yicha yordam bera olaman. 🌟", time: nowTime() }
  ])
  const [input, setInput]     = useState('')
  const [sending, setSending] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  function sendMsg() {
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setMessages(prev => [...prev, { type: 'user', text, time: nowTime() }])
    setSending(true)

    // Save to localStorage
    saveNote({
      id:      Date.now().toString(),
      title:   text.slice(0, 60),
      pre:     text.slice(0, 80),
      tag:     'Eslatma',
      date:    'Hozir',
      content: text,
    })
    setStats(getStats())

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)], time: nowTime() }])
      setSending(false)
    }, 700 + Math.random() * 800)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(5,7,14,0.98)' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b1)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', display: 'grid', placeItems: 'center', boxShadow: '0 0 16px rgba(0,212,255,0.4)' }}>
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/><path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>LifeVault AI</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} /> Online
          </div>
        </div>
      </div>

      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: m.type === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.type === 'ai' && (
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 2 }}>
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/><path d="M11 16l3.5 3.5L21 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            <div>
              <div style={{ maxWidth: 320, padding: '10px 14px', borderRadius: m.type === 'ai' ? '4px 16px 16px 16px' : '16px 4px 16px 16px', background: m.type === 'ai' ? 'rgba(15,19,35,0.95)' : 'linear-gradient(135deg,var(--blue),var(--cyan))', border: m.type === 'ai' ? '1px solid rgba(0,212,255,0.1)' : 'none', fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--text)' }}>{m.text}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginTop: 4, textAlign: m.type === 'user' ? 'right' : 'left' }}>{m.time}</div>
            </div>
          </div>
        ))}
        {sending && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--blue),var(--cyan))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><path d="M16 3L4 9v8c0 6.6 5.1 12.8 12 14 6.9-1.2 12-7.4 12-14V9L16 3z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/></svg>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', background: 'rgba(15,19,35,0.95)', border: '1px solid rgba(0,212,255,0.1)', fontSize: '0.78rem', color: 'var(--text3)' }}>AI yozmoqda...</div>
          </div>
        )}
      </div>

      <div style={{ padding: '10px 12px 14px', borderTop: '1px solid var(--b1)', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="AI ga savol bering yoki xotira yozing..." rows={1} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 20, padding: '10px 16px', color: 'var(--text)', fontSize: '0.88rem', fontFamily: 'var(--font)', outline: 'none', resize: 'none', maxHeight: 100, lineHeight: 1.4 }} />
        <button onClick={sendMsg} disabled={sending || !input.trim()} style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() ? 'linear-gradient(135deg,var(--blue),var(--cyan))' : 'rgba(0,212,255,0.1)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'grid', placeItems: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
        </button>
      </div>
    </div>
  )
}
