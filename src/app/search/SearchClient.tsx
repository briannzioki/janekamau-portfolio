"use client"

import { useEffect, useState } from "react"

export default function SearchClient({ q }: { q: string }) {
  // If you have an auth hook/provider, it’s optional here.
  // No destructuring from undefined.
  // const { user } = useAuth?.() ?? {}

  const [results, setResults] = useState<Array<{ id: string; title: string }>>([])

  useEffect(() => {
    // TODO: plug your actual search here; this is a harmless placeholder.
    setResults(q ? [{ id: "demo", title: `Demo result for “${q}”` }] : [])
  }, [q])

  if (!q) return <div className="text-[var(--text-muted)]">Enter a query…</div>

  return (
    <ul className="space-y-2">
      {results.map(r => (
        <li key={r.id} className="rounded-lg border border-[color:var(--border)] bg-[var(--surface)] p-3">
          {r.title}
        </li>
      ))}
    </ul>
  )
}
