// src/lib/data.ts
import { MemoryItem, MediaItem, BookItem, Note } from '@/types'

export const SEED_NOTES: Note[] = [
  { id: 'seed-1', title: "Python — O'rganish rejasi", pre: '1-hafta: Asoslar, sintaksis...', tag: 'Reja',   date: 'Bugun',  content: "# Python O'rganish Rejasi\n\n## 1-hafta: Asoslar\n- Sintaksis va o'zgaruvchilar\n- Funksiyalar va looplar\n\n## 2-hafta: OOP\n- Klasslar va ob'ektlar\n- Meros (inheritance)" },
  { id: 'seed-2', title: 'Hayot maqsadlarim 2025',   pre: "Sog'lom turmush, yangi til...",  tag: 'Maqsad', date: 'Kecha',  content: "## 2025 yil maqsadlarim\n\n1. Sog'lom turmush tarzi\n2. Yangi til o'rganish\n3. Loyihani yakunlash" },
  { id: 'seed-3', title: "Emro loyiha g'oyalari", pre: 'AI xotira, portfolio, resume...', tag: 'Loyiha', date: '3 kun', content: "## G'oyalar\n\n- AI xotira vault\n- Portfolio generator\n- Resume builder" },
  { id: 'seed-4', title: 'Kitob tavsiyalari',         pre: 'Atomic Habits, Deep Work...',   tag: 'Kitob',  date: '1 hafta', content: "## Kitoblar\n\n- Atomic Habits\n- Deep Work\n- The Lean Startup" },
]

export const SEED_MEDIA: MediaItem[] = [
  { id: 'sm-1', emoji: '🏔️', title: "Tog' safari",     date: 'Mar 2024', type: 'rasm',  color: '#0f1b3a' },
  { id: 'sm-2', emoji: '🌊', title: "Dengiz qirg'og'i", date: 'Avg 2023', type: 'rasm',  color: '#0a1f30' },
  { id: 'sm-3', emoji: '🎂', title: "Tug'ilgan kun",    date: 'Apr 2024', type: 'rasm',  color: '#1a0f2e' },
  { id: 'sm-4', emoji: '🎬', title: 'Sayohat vlog',     date: 'Jul 2023', type: 'video', color: '#1e0f2e' },
  { id: 'sm-5', emoji: '🌅', title: 'Tong quyoshi',     date: 'Jan 2024', type: 'rasm',  color: '#1a100f' },
  { id: 'sm-6', emoji: '🎬', title: 'Hovuz bazmi',      date: 'Jun 2023', type: 'video', color: '#0f2a1a' },
]

export const BOOKS: BookItem[] = [
  { emoji: '📸', name: 'Rasmlar',    count: '142', color: '#1a2a5a' },
  { emoji: '📝', name: 'Eslatmalar', count: '67',  color: '#1a3a2a' },
  { emoji: '🏆', name: 'Yutuqlar',   count: '32',  color: '#3a2a0a' },
  { emoji: '🎬', name: 'Videolar',   count: '28',  color: '#2a1a3a' },
  { emoji: '⚡', name: 'Skilllar',   count: '14',  color: '#0a2a3a' },
  { emoji: '📅', name: 'Rejalar',    count: '18',  color: '#3a1a1a' },
  { emoji: '💡', name: "G'oyalar",   count: '45',  color: '#1a0a3a' },
  { emoji: '🌍', name: 'Sayohatlar', count: '11',  color: '#0a3a1a' },
]

export const RIBBON_ITEMS = [
  { emoji: '🏔️', label: "Tog' safari",   color: '#1a3a5c', accent: '#3b82f6' },
  { emoji: '🎂', label: "Tug'ilgan kun", color: '#3a1a2c', accent: '#f74f8e' },
  { emoji: '🎬', label: 'Kino kechasi',  color: '#1a2a3a', accent: '#4fc3f7' },
  { emoji: '🏆', label: 'Olimpiada',     color: '#3a2a0a', accent: '#f7c34f' },
  { emoji: '✈️', label: 'Sayohat',       color: '#0a2a3a', accent: '#4ff7c3' },
  { emoji: '👨‍💻', label: 'Hackathon', color: '#1a1a3a', accent: '#8e4ff7' },
  { emoji: '🌊', label: 'Dengiz',        color: '#0a2a3a', accent: '#4fc3f7' },
  { emoji: '🌸', label: 'Bahor',         color: '#2a1a2a', accent: '#f74fc3' },
  { emoji: '🎵', label: 'Konsert',       color: '#1a0a2a', accent: '#c34ff7' },
  { emoji: '🌅', label: 'Tong',          color: '#2a1a0a', accent: '#f7944f' },
]
