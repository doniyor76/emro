// src/lib/i18n.ts
import { Lang } from '@/types'

export const T: Record<Lang, Record<string, string>> = {
  uz: {
    tagline: 'HAYOTINGIZNI SAQLANG · AI TARTIBLESIN',
    email: 'Email', password: 'Parol', login: 'Kirish',
    or: 'yoki', google: 'Google orqali kirish',
    register: 'Yangi hisob yaratish', fullname: 'Ism Familiya',
    create: 'Hisob yaratish', already: 'Allaqachon hisobingiz bormi?',
    back: 'Kirish', emailph: 'siz@email.com', passph: 'Kamida 8 belgi',
    nameph: "To'liq ismingiz", waiting: 'Kutilmoqda...',
    settings: 'Sozlamalar', language: 'Til', dark_theme: "Qorong'u tema",
    light_theme: "Yorug' tema", stars_anim: 'Yulduzli animatsiya',
    close: 'Yopish', logout: 'Hisobdan chiqish', profile: 'Profil',
    notifications: 'Bildirishnomalar', mark_read: "✓ O'qildi",
  },
  en: {
    tagline: 'SAVE YOUR LIFE · LET AI ORGANIZE',
    email: 'Email', password: 'Password', login: 'Sign In',
    or: 'or', google: 'Continue with Google',
    register: 'Create New Account', fullname: 'Full Name',
    create: 'Create Account', already: 'Already have an account?',
    back: 'Sign In', emailph: 'you@email.com', passph: 'At least 8 chars',
    nameph: 'Your full name', waiting: 'Loading...',
    settings: 'Settings', language: 'Language', dark_theme: 'Dark Theme',
    light_theme: 'Light Theme', stars_anim: 'Star Animation',
    close: 'Close', logout: 'Sign Out', profile: 'Profile',
    notifications: 'Notifications', mark_read: '✓ Mark Read',
  },
}

export const t = (lang: Lang, k: string) => T[lang]?.[k] ?? k
