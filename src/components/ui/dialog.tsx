// src/components/ui/dialog.tsx
'use client'
import * as React from 'react'

export function Dialog({
  open,
  onClose,
  children,
  'aria-label': ariaLabel,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  'aria-label'?: string
}) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const closeOnEsc = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  React.useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', closeOnEsc)
    return () => document.removeEventListener('keydown', closeOnEsc)
  }, [open, closeOnEsc])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      <div
        ref={panelRef}
        className="max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
