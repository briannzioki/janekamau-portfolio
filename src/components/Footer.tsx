import LogoStrip, { Logo } from "@/components/ui/LogoStrip"
import { logos as dataLogos } from "@/data/logos"

// Use only real logos; guard against empty/placeholder entries.
const liveLogos: Logo[] = (dataLogos || [])
  .filter((l) => l?.src && !/placeholder/i.test(l.src))
  .map((l) => ({ src: l.src, alt: l.alt }))

export default function Footer() {
  return (
    <footer className="py-10 text-sm text-[var(--text-muted)]">
      {/* Client logos strip */}
      {liveLogos.length > 0 && <LogoStrip logos={liveLogos} />}

      {/* Bottom bar: copyright only */}
      <div className="border-t border-[color:var(--border)] pt-6 text-xs">
        <div>© {new Date().getFullYear()} Jane Kamau. All rights reserved.</div>
      </div>
    </footer>
  )
}
