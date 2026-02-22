import Link from "next/link"
import type { Publication } from "contentlayer/generated"
import SafeImage from "@/components/SafeImage"

export default function PublicationCard({ pub }: { pub: Publication }) {
  return (
    <Link href={`/publications/${pub.slug}`} className="group block overflow-hidden rounded-2xl bg-surface shadow-soft">
      {pub.cover && (
        <div className="relative aspect-[16/10]">
          <SafeImage
            src={pub.cover}
            alt={pub.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg">{pub.title}</h3>
          <span className="text-xs text-muted">{pub.year}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{pub.summary}</p>
        {pub.venue && <div className="mt-2 text-xs text-muted">{pub.venue}</div>}
      </div>
    </Link>
  )
}