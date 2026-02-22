"use client"

import { logos } from "@/data/logos"

export default function LogoRail() {
  if (!logos.length) return null

  return (
    <div className="mt-12">
      <div className="text-sm text-[var(--text-muted)] mb-3">Clients &amp; partners</div>

      <div className="flex gap-6 overflow-x-auto py-3 px-1 scrollbar-thin">
        {logos.map((l, i) => (
          <div
            key={i}
            className={[
              "shrink-0 rounded-xl border border-[color:var(--border)]",
              "bg-[var(--glass)] backdrop-blur-lg shadow-soft",
              "px-4 py-3",
            ].join(" ")}
            style={{ height: 64 }}
            title={l.alt}
            aria-label={l.alt}
          >
            <img
              src={encodeURI(l.src)}
              alt={l.alt}
              loading="lazy"
              decoding="async"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
