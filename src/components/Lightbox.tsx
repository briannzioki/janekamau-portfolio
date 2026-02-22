"use client"

import { useEffect, useRef, useState } from "react"

export default function Lightbox({
  thumb,
  full,
  alt,
}: {
  thumb: React.ReactNode
  full: React.ReactNode
  alt?: string
}) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    closeRef.current?.focus()
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        {thumb}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              className={[
                "absolute right-2 top-2 rounded-md border border-[color:var(--border)]",
                "bg-[var(--glass)] backdrop-blur-lg px-2 py-1 text-sm text-[var(--text)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              ].join(" ")}
            >
              Close
            </button>
            {full}
          </div>
        </div>
      )}
    </>
  )
}
