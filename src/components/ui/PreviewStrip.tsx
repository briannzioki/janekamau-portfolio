"use client"

import { ReactNode, useRef } from "react"
import { cn } from "@/lib/utils"

export type PreviewItem = { key: string; node: ReactNode }

export default function PreviewStrip({
  items,
  ariaLabel,
  className,
}: {
  items: PreviewItem[]
  ariaLabel?: string
  className?: string
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollerRef}
        role="list"
        aria-label={ariaLabel}
        className={cn(
          "flex gap-6 overflow-x-auto px-2 py-3 snap-x snap-mandatory",
          "scrollbar-thin",
          "rounded-2xl border border-[color:var(--border)] bg-[var(--glass)] backdrop-blur-lg"
        )}
      >
        {items.map((it) => (
          <div
            role="listitem"
            key={it.key}
            className={cn(
              "shrink-0 snap-start",
              "w-[85vw] sm:w-[360px] md:w-[380px] lg:w-[400px]"
            )}
          >
            {it.node}
          </div>
        ))}
      </div>
    </div>
  )
}
