// src/app/layout.tsx
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'LifeVault — Hayotingizni Saqlang',
  description: 'AI powered personal memory vault',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}
