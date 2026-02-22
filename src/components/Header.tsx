import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="py-6 text-sm text-[var(--text-muted)]">
      <div className="flex items-center justify-between">
        {/* Home link: avatar only */}
        <Link
          href="/"
          aria-label="Home"
          className="relative h-10 w-10 overflow-hidden rounded-full border border-[color:var(--border)] shadow-soft hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
        >
          <Image
            src="/portfolio/placeholders/profile%20photo.png"
            alt="Jane Kamau"
            fill
            sizes="40px"
            className="object-cover"
            priority
          />
        </Link>

        <nav className="flex gap-4">
          <Link href="/work" className="hover:opacity-80">
            Portfolio
          </Link>
          <Link href="/publications" className="hover:opacity-80">
            Publications
          </Link>
          <Link href="/about" className="hover:opacity-80">
            About
          </Link>
          <Link href="/contact" className="hover:opacity-80">
            Work with me
          </Link>
        </nav>
      </div>
    </header>
  )
}
