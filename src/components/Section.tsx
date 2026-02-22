"use client"

import React from "react"

export default function Section({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`py-10 ${className || ""}`}>
      <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--glass)] backdrop-blur-lg shadow-soft p-6 md:p-8">
        {(title || subtitle) && (
          <header className="mb-6">
            {title ? <h2 className="text-[var(--text)] text-2xl font-semibold">{title}</h2> : null}
            {subtitle ? <p className="text-[var(--text-muted)] mt-1 text-sm">{subtitle}</p> : null}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
