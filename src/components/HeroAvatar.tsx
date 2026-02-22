"use client"

import { useEffect, useMemo, useRef } from "react"
import SafeImage from "@/components/SafeImage"

type Topic = { id: string; label: string }

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
}

export default function HeroAvatar() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number>(0)

  const reduced = useRef(false)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  // Subtle pro motion
  const TILT = 9
  const BG_SHIFT = 14

  const topics: Topic[] = useMemo(
    () => [
      { id: "t1", label: "Graphic Designer" },
      { id: "t2", label: "Posters" },
      { id: "t3", label: "Illustrations" },
      { id: "t4", label: "Publications" },
    ],
    []
  )

  useEffect(() => {
    reduced.current = prefersReducedMotion()
    const el = wrapRef.current
    if (!el) return

    el.style.setProperty("--mx", "0")
    el.style.setProperty("--my", "0")
    el.style.setProperty("--bx", "0")
    el.style.setProperty("--by", "0")

    if (reduced.current) return

    const apply = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12
      current.current.y += (target.current.y - current.current.y) * 0.12

      const mx = current.current.x * TILT
      const my = current.current.y * TILT
      const bx = current.current.x * BG_SHIFT
      const by = current.current.y * BG_SHIFT

      el.style.setProperty("--mx", mx.toFixed(2))
      el.style.setProperty("--my", my.toFixed(2))
      el.style.setProperty("--bx", bx.toFixed(2))
      el.style.setProperty("--by", by.toFixed(2))
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
      target.current.x = Math.max(-1, Math.min(1, nx))
      target.current.y = Math.max(-1, Math.min(1, ny))

      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0
        apply()
      })
    }

    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0

      if (rafRef.current) return
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0
        apply()
      })
    }

    el.addEventListener("pointermove", onMove, { passive: true })
    el.addEventListener("pointerleave", onLeave)

    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const avatarSrc = "/portfolio/avatar/hero-avatar.jpg"

  return (
    <section
      ref={wrapRef}
      className={[
        "relative overflow-hidden rounded-2xl",
        "bg-[var(--glass-elevated)] backdrop-blur-xl shadow-soft",
        // BIGGER than sections below
        "p-7 sm:p-10 md:p-12",
        "min-h-[380px] md:min-h-[460px]",
      ].join(" ")}
      aria-label="Hero"
    >
      {/* base wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          transform: "translate3d(calc(var(--bx, 0px) * -1), calc(var(--by, 0px) * -1), 0)",
          transition: reduced.current ? "none" : "transform 160ms ease-out",
          background:
            "radial-gradient(980px 560px at 12% 8%, color-mix(in srgb, var(--primary) 7%, transparent), transparent 66%)," +
            "radial-gradient(880px 600px at 92% 10%, color-mix(in srgb, var(--accent) 6%, transparent), transparent 68%)," +
            "radial-gradient(940px 620px at 50% 110%, color-mix(in srgb, var(--accent-3) 6%, transparent), transparent 70%)",
        }}
      />

      {/* abstract contour lines (subtle, professional) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          transform: "translate3d(calc(var(--bx, 0px) * 0.45), calc(var(--by, 0px) * 0.45), 0)",
          transition: reduced.current ? "none" : "transform 160ms ease-out",
          background:
            "repeating-radial-gradient(circle at 18% 22%, rgba(0,0,0,0.08) 0 1px, rgba(0,0,0,0) 1px 22px)," +
            "repeating-radial-gradient(circle at 82% 18%, rgba(0,0,0,0.07) 0 1px, rgba(0,0,0,0) 1px 26px)," +
            "linear-gradient(120deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 44%)," +
            "linear-gradient(0deg, rgba(0,0,0,0.08), rgba(0,0,0,0))",
        }}
      />

      {/* Content */}
      <div className="relative z-10 grid gap-10 md:grid-cols-[1.25fr,0.95fr] md:items-center">
        {/* Left */}
        <div>
          <h1 className="text-[var(--text)] font-bold tracking-tight text-5xl sm:text-6xl md:text-7xl">
            Jane Kamau
          </h1>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {topics.map((t) => (
              <span
                key={t.id}
                className={[
                  "inline-flex items-center rounded-full",
                  "border border-[color:var(--border)]",
                  "bg-[var(--glass)] backdrop-blur-lg",
                  "px-3 py-1.5 text-sm text-[var(--text-muted)]",
                ].join(" ")}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: avatar stage */}
        <div className="relative mx-auto w-full max-w-[360px] md:max-w-[420px]">
          {/* distorted blob behind avatar (flare) */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              transform: "translate3d(calc(var(--bx, 0px) * 0.10), calc(var(--by, 0px) * 0.10), 0)",
              transition: reduced.current ? "none" : "transform 180ms ease-out",
              background:
                "radial-gradient(closest-side, color-mix(in srgb, var(--primary) 12%, transparent), transparent 62%)," +
                "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 10%, transparent), transparent 66%)," +
                "radial-gradient(closest-side, color-mix(in srgb, var(--accent-3) 9%, transparent), transparent 70%)",
              filter: "blur(18px)",
              borderRadius: "58% 42% 55% 45% / 44% 56% 40% 60%",
              opacity: 0.9,
            }}
          />

          {/* thin distorted ring for style */}
          <div
            aria-hidden
            className="absolute inset-[8%]"
            style={{
              transform: "translate3d(calc(var(--bx, 0px) * -0.06), calc(var(--by, 0px) * -0.06), 0) rotate(-6deg)",
              transition: reduced.current ? "none" : "transform 180ms ease-out",
              borderRadius: "62% 38% 58% 42% / 48% 52% 42% 58%",
              border: "1px solid rgba(0,0,0,0.10)",
              filter: "blur(0.2px)",
              opacity: 0.7,
            }}
          />

          {/* ground shadow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[88%] h-10 w-[72%] -translate-x-1/2 rounded-full"
            style={{
              background: "radial-gradient(closest-side, rgba(0,0,0,0.16), rgba(0,0,0,0))",
              filter: "blur(12px)",
            }}
          />

          <div
            className="relative aspect-square w-full"
            style={{
              transform:
                "perspective(900px) rotateX(calc(var(--my, 0) * -0.55deg)) rotateY(calc(var(--mx, 0) * 0.55deg))",
              transformStyle: "preserve-3d",
              transition: reduced.current ? "none" : "transform 160ms ease-out",
            }}
          >
            {/* halo */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(var(--glow-primary) / 0.10), transparent 62%)," +
                  "radial-gradient(closest-side, rgba(var(--glow-accent) / 0.06), transparent 66%)",
                filter: "blur(14px)",
              }}
            />

            {/* glass disc - keep background visible */}
            <div
              className="absolute inset-[6%] rounded-full overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid color-mix(in srgb, var(--border) 70%, transparent)",
                boxShadow: "0 22px 60px rgba(0,0,0,0.16)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <SafeImage
                src={avatarSrc}
                alt="Avatar illustration"
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
