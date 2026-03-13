'use client'
// src/hooks/useAppStore.ts
import { create } from 'zustand'
import { Tab, Lang, Theme, UserProfile, StatsData } from '@/types'

interface AppState {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void

  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isLoggedIn: boolean
  setIsLoggedIn: (v: boolean) => void

  lang: Lang
  setLang: (l: Lang) => void
  theme: Theme
  setTheme: (t: Theme) => void
  showStars: boolean
  setShowStars: (v: boolean) => void

  settingsOpen: boolean
  setSettingsOpen: (v: boolean) => void
  notifOpen: boolean
  setNotifOpen: (v: boolean) => void
  profileDDOpen: boolean
  setProfileDDOpen: (v: boolean) => void

  stats: StatsData
  setStats: (s: StatsData) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  user: null,
  setUser: (user) => set({ user }),
  isLoggedIn: false,
  setIsLoggedIn: (v) => set({ isLoggedIn: v }),

  lang: 'uz',
  setLang: (l) => set({ lang: l }),
  theme: 'dark',
  setTheme: (t) => set({ theme: t }),
  showStars: true,
  setShowStars: (v) => set({ showStars: v }),

  settingsOpen: false,
  setSettingsOpen: (v) => set({ settingsOpen: v }),
  notifOpen: false,
  setNotifOpen: (v) => set({ notifOpen: v }),
  profileDDOpen: false,
  setProfileDDOpen: (v) => set({ profileDDOpen: v }),

  stats: { total: 0, images: 0, notes: 0, achievements: 0, videos: 0 },
  setStats: (s) => set({ stats: s }),
}))
