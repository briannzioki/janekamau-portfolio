// src/components/ui/LogoStrip.tsx
"use client"

import Image from "next/image"

export type Logo = { src: string; alt: string }
type Props = {
  logos: Logo[]
  title?: string
  height?: number // logo max height in px (default 56)
}

export default function LogoStrip({ logos, title = "Clients & partners", height = 56 }: Props) {
  const items = (logos || []).filter(l => l?.src)

  if (!items.length) return null

  return (
    <section aria-label={title} className="mb-8">
      <div className="text-xs uppercase tracking-wide text-[var(--text-muted)] mb-3">{title}</div>

      {/* Soft card wrapper */}
      <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface)]/60 backdrop-blur-[1px] p-4">
        {/* Even spacing on all screens */}
        <div className="
          grid items-center justify-items-center gap-6
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6
        ">
          {items.map((l, i) => (
            <div
              key={i}
              className="w-full flex items-center justify-center px-2 py-3
                         rounded-xl bg-[color:var(--bg-elevated)]/40
                         border border-[color:var(--border)] shadow-soft
                         transition will-change-transform hover:scale-[1.02]"
              title={l.alt}
              aria-label={l.alt}
            >
              <Image
                src={l.src}
                alt={l.alt}
                width={220}
                height={height}
                style={{ height, width: "auto" }}
                className="object-contain opacity-80 grayscale contrast-110
                           hover:opacity-100 hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
