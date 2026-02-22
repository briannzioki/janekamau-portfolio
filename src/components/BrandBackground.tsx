"use client"

import { CSSProperties, useEffect, useMemo, useRef } from "react"

type Orb = {
  left?: string
  right?: string
  top?: string
  bottom?: string
  size: string
  color: string
  opacity: number
  depth: number
  dur: number
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
}

export default function BrandBackground() {
  const nodes = useRef<Array<HTMLDivElement | null>>([])

  // Subtle parallax (pro)
  const PARALLAX = 48

  // Smoothed motion state
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const orbs: Orb[] = useMemo(() => {
    const c1 = "var(--primary)"
    const c2 = "var(--accent)"
    const c3 = "var(--accent-3)"

    return [
      { left: "-14%", top: "4%", size: "34vmax", color: c1, opacity: 0.10, depth: 0.28, dur: 30 },
      { right: "-12%", top: "-12%", size: "26vmax", color: c2, opacity: 0.09, depth: 0.22, dur: 34 },
      { left: "16%", bottom: "-16%", size: "30vmax", color: c3, opacity: 0.09, depth: 0.32, dur: 32 },
      { right: "18%", bottom: "-10%", size: "22vmax", color: c2, opacity: 0.07, depth: 0.24, dur: 28 },
    ]
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return

    let raf = 0

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      target.current.x = nx * PARALLAX
      target.current.y = ny * PARALLAX
    }

    const tick = () => {
      raf = window.requestAnimationFrame(tick)

      // Floaty smoothing (subtle)
      current.current.x += (target.current.x - current.current.x) * 0.08
      current.current.y += (target.current.y - current.current.y) * 0.08

      for (const el of nodes.current) {
        if (!el) continue
        const depth = Number(el.dataset.depth || "1")
        el.style.setProperty("--tx", `${current.current.x * depth}px`)
        el.style.setProperty("--ty", `${current.current.y * depth}px`)
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    raf = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("pointermove", onMove)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const setRef = (i: number) => (el: HTMLDivElement | null) => {
    nodes.current[i] = el
  }

  return (
    <div className="brand-bg pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="bg-mesh absolute inset-[-14%]" aria-hidden="true" />

      {orbs.map((o, i) => {
        const style: CSSProperties = {
          left: o.left,
          right: o.right,
          top: o.top,
          bottom: o.bottom,
          ["--size" as any]: o.size,
          ["--c" as any]: o.color,
          ["--opacity" as any]: String(o.opacity),
          ["--dur" as any]: `${o.dur}s`,
        }

        return (
          <div
            key={i}
            ref={setRef(i)}
            data-depth={o.depth}
            className="brand-orb"
            style={style}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}
