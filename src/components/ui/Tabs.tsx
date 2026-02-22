"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export type TabDef = { id: string; label: string }

type TabsProps = {
  tabs: TabDef[]
  initialId?: string
  initial?: string
  onChange?: (id: string) => void
  className?: string
}

export default function Tabs({ tabs, initialId, initial, onChange, className }: TabsProps) {
  const first = initialId ?? initial ?? (tabs[0]?.id ?? "")
  const [active, setActive] = React.useState<string>(first)

  React.useEffect(() => {
    if (initialId && initialId !== active) setActive(initialId)
  }, [initialId])

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map(t => {
        const is = t.id === active
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={is}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              is
                ? "bg-[var(--chip-bg-active)] text-[var(--chip-fg-active)] shadow-soft"
                : "bg-[var(--chip-bg)] text-[var(--chip-fg)] hover:bg-[var(--chip-bg-hover)]"
            )}
            onClick={() => {
              setActive(t.id)
              onChange?.(t.id)
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}