"use client"

import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import { useRouter } from "next/navigation"

type Props = {
  title: string
  summary?: string
  cover?: string | null
  href: string
  link?: string | null
  category?: string | null
}

function isPdf(u?: string | null) {
  return !!u && /\.pdf(\?.*)?$/i.test(u)
}

export default function WorkCard({ title, summary, cover, href, link }: Props) {
  const router = useRouter()
  const preferPdf = isPdf(link)

  const cardClassName = [
    "group block overflow-hidden rounded-2xl border border-[color:var(--border)]",
    "bg-[var(--glass)] backdrop-blur-lg shadow-soft",
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring)]",
  ].join(" ")

  // Minimal params (don't hide toolbars)
  const pdfSrc = link ? `${link}#page=1&view=FitH` : ""

  // --- PDF CARD: interactive embed + click-to-open in-app (href) ---
  if (preferPdf && link) {
    return (
      <div className={cardClassName} data-testid="card-pdf">
        <div className="aspect-[4/5] overflow-hidden relative">
          <embed
            src={pdfSrc}
            type="application/pdf"
            className="h-full w-full"
            data-testid="pdf-embed"
          />

          {/* Click layer: opens the in-app page without blocking PDF interaction */}
          <Link
            href={href}
            aria-label={`Open ${title}`}
            className="absolute inset-0 z-10"
            onClick={(e) => {
              e.preventDefault()
              router.push(href)
            }}
            onMouseDown={(e) => {
              // avoid text selection drag behavior triggering oddities
              e.preventDefault()
            }}
            style={{
              // key trick: allow hover/scroll inside PDF, but still receive click
              pointerEvents: "auto",
              background: "transparent",
            }}
          />
        </div>

        <div className="p-4">
          <Link href={href} className="font-medium text-[var(--text)] hover:opacity-90">
            {title}
          </Link>
          {summary ? <div className="text-sm text-[var(--text-muted)] mt-1">{summary}</div> : null}
        </div>
      </div>
    )
  }

  // --- IMAGE CARD: keep full-card Link behavior ---
  return (
    <Link
      href={href}
      className={[
        "group block overflow-hidden rounded-2xl border border-[color:var(--border)]",
        "bg-[var(--glass)] backdrop-blur-lg shadow-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
      ].join(" ")}
      data-testid="card-image"
    >
      <div className="aspect-[4/5] overflow-hidden">
        {cover ? (
          <SafeImage
            src={cover}
            alt={title}
            width={1600}
            height={1200}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full bg-[var(--glass)]" aria-hidden />
        )}
      </div>

      <div className="p-4">
        <div className="font-medium text-[var(--text)]">{title}</div>
        {summary ? <div className="text-sm text-[var(--text-muted)] mt-1">{summary}</div> : null}
      </div>
    </Link>
  )
}
