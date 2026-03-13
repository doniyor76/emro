'use client'
// src/components/ui/Toast.tsx
import { useEffect, useRef } from 'react'

let _show: ((msg: string) => void) | null = null
export function showToast(msg: string) { _show?.(msg) }

export default function Toast() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    _show = (msg: string) => {
      const el = ref.current
      if (!el) return
      el.textContent = msg
      el.classList.add('show')
      setTimeout(() => el.classList.remove('show'), 2800)
    }
    return () => { _show = null }
  }, [])

  return <div ref={ref} className="toast" />
}
