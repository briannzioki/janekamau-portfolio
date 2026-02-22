// src/components/ThemeToggle.tsx
'use client'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isLight = (theme ?? resolvedTheme) === 'light'
  const label = isLight ? 'Switch to dark' : 'Switch to light'

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="rounded-xl border border-token px-3 py-2 text-sm"
        disabled
      >
        Theme
      </button>
    )
  }

  return (
    <button
      aria-label="Toggle theme"
      aria-pressed={isLight ? 'false' : 'true'}
      title={label}
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className="rounded-xl border border-token px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      {isLight ? 'Dark' : 'Light'}
    </button>
  )
}
