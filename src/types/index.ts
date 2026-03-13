// src/types/index.ts

export type Lang  = 'uz' | 'en'
export type Tab   = 'home' | 'notes' | 'media' | 'library' | 'portfolio' | 'chat'
export type Theme = 'dark' | 'light'

export interface UserProfile {
  name:    string
  email:   string
  initial: string
  avatar?: string
  joined?: string
}

export interface Note {
  id:      string
  title:   string
  pre:     string
  tag:     string
  date:    string
  content: string
}

export interface MediaItem {
  id:    string
  emoji: string
  title: string
  date:  string
  type:  'rasm' | 'video'
  color: string
}

export interface BookItem {
  emoji: string
  name:  string
  count: string
  color: string
}

export interface MemoryItem {
  id?:    string
  label:  string
  date:   string
  color:  string
  accent: string
}

export interface StatsData {
  total:        number
  images:       number
  notes:        number
  achievements: number
  videos:       number
}
