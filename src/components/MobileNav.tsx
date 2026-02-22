"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"

type Item = { href: string; label: string }

export default function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    closeBtnRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a,button,[tabindex]:not([tabindex="-1"])'
        )
        if (!focusables || focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      prev?.focus()
    }
  }, [open])

  return (
    <div>
      <button
        aria-label="Open menu"
        className={[
          "inline-flex items-center gap-2 rounded-xl border border-[color:var(--border)]",
          "bg-[var(--glass)] backdrop-blur-lg shadow-soft",
          "px-3 py-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        ].join(" ")}
        onClick={() => setOpen(true)}
      >
        <Menu size={16} /> <span className="text-[var(--text)]">Menu</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        >
          <div
            ref={panelRef}
            className={[
              "absolute right-0 top-0 h-full w-80",
              "border-l border-[color:var(--border)]",
              "bg-[var(--glass-elevated)] backdrop-blur-xl shadow-soft",
              "p-6",
            ].join(" ")}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="font-heading text-[var(--text)]">Menu</div>
              <button
                ref={closeBtnRef}
                onClick={() => setOpen(false)}
                className={[
                  "inline-flex items-center gap-1 rounded-xl border border-[color:var(--border)]",
                  "bg-[var(--glass)] backdrop-blur-lg",
                  "px-3 py-2 text-sm",
                  "text-[var(--text-muted)] hover:text-[var(--text)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                ].join(" ")}
              >
                <X size={16} /> Close
              </button>
            </div>

            <nav className="mt-6 grid gap-2">
              {items.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className={[
                    "rounded-xl px-3 py-2 text-lg text-[var(--text)]",
                    "border border-transparent",
                    "hover:border-[color:var(--border)] hover:bg-[var(--glass)] hover:backdrop-blur-lg",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  ].join(" ")}
                  onClick={() => setOpen(false)}
                >
                  {i.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
