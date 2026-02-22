"use client"

import { useMemo, useState } from "react"
import Section from "@/components/Section"
import WorkCard from "@/components/WorkCard"
import PreviewStrip from "@/components/ui/PreviewStrip"
import Tabs, { TabDef } from "@/components/ui/Tabs"
import Link from "next/link"
import Image from "next/image"
import { allProjects, allPublications } from "contentlayer/generated"

type Cat = "poster" | "illustration" | "branding" | "publication"

const tabs: TabDef[] = [
  { id: "poster", label: "Posters" },
  { id: "illustration", label: "Illustrations" },
  { id: "branding", label: "Branding" },
  { id: "publication", label: "Publications" },
]

function isPdf(u?: string | null) {
  return !!u && /\.pdf(\?.*)?$/i.test(u)
}
function firstPdfInBody(raw?: string | null): string | null {
  if (!raw) return null
  const m = raw.match(/\/portfolio\/pubs\/[^\s)"']+\.pdf/i)
  return m ? m[0] : null
}
function deriveLink(p: any): string | null {
  return p.link ?? p.file ?? p.url ?? firstPdfInBody(p?.body?.raw) ?? null
}

export default function HomePage() {
  const cards = useMemo(() => {
    const seenProj = new Set<string>()
    const proj = (allProjects || [])
      .filter((p) => {
        if (seenProj.has(p.slug)) return false
        seenProj.add(p.slug)
        return true
      })
      .map((p: any) => {
        const link = deriveLink(p)
        return {
          id: p._id,
          cat: p.category as Cat,
          node: (
            <WorkCard
              title={p.title}
              summary={p.summary}
              cover={p.cover && p.cover.trim() ? p.cover : undefined}
              href={`/work/${p.slug}`}
              link={link}
              category={p.category}
            />
          ),
        }
      })

    const seenFiles = new Set<string>()
    const pubs = (allPublications || [])
      .map((p: any) => {
        const link = deriveLink(p)
        return { p, link }
      })
      .filter(({ link }) => isPdf(link))
      .filter(({ p, link }) => {
        const key = link || p._id
        if (seenFiles.has(key)) return false
        seenFiles.add(key)
        return true
      })
      .map(({ p, link }) => {
        const cover =
          p.cover && !/\/cover\.svg$/i.test(p.cover) ? p.cover : (p.file as string | undefined)
        return {
          id: p._id,
          cat: "publication" as Cat,
          node: (
            <WorkCard
              title={p.title}
              summary={p.summary}
              cover={cover}
              href={`/publications/${p.slug}`}
              link={link as string}
              category={p.category}
            />
          ),
        }
      })

    return [...proj, ...pubs]
  }, [])

  const [current, setCurrent] = useState<Cat>("poster")
  const previewItems = cards.filter((c) => c.cat === current).map((it) => ({ key: it.id, node: it.node }))

  return (
    <div className="__container relative">
      <div className="relative z-10">
        {/* HERO */}
        <div className="mb-10 md:mb-12">
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[var(--bg)] shadow-glow-lg">
            <div className="relative w-full aspect-[3/1] min-h-[240px]">
              <Image
                src="/portfolio/ui/hero-pattern.png"
                alt=""
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 1100px"
              />

              {/* No glass, no big gradient. Only a tiny vignette for readability */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 pointer-events-none bg-black/10 dark:bg-black/25" />

                <div className="relative h-full px-6 py-8 md:px-12 md:py-12 flex items-center">
                  {/* group = lets hover affect children */}
                  <div className="max-w-4xl group">
                    {/* Name */}
                    <h1
                      className="
                        font-extrabold uppercase leading-[0.95]
                        text-5xl sm:text-6xl md:text-7xl lg:text-8xl
                        tracking-tight
                        text-white
                        transition-[transform,color] duration-200
                        group-hover:scale-[1.01]
                        group-hover:text-white
                      "
                      style={{
                        WebkitTextStroke: "1px rgba(0,0,0,0.35)",
                        textShadow:
                          "0 10px 26px rgba(0,0,0,0.45), 0 0 22px rgba(56,189,248,0.20)",
                      }}
                    >
                      JANE&nbsp;KAMAU
                    </h1>

                    {/* Subtopics row */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {/* pill */}
                      <span
                        className="
                          inline-flex items-center rounded-full
                          px-4 py-2
                          text-sm sm:text-base md:text-lg
                          font-semibold uppercase
                          tracking-[0.18em]
                          border
                          border-white/30 dark:border-white/20
                          bg-white/22 dark:bg-black/30
                          text-white
                          backdrop-blur
                          transition-[transform,color,border-color,background-color] duration-200
                          hover:-translate-y-0.5 hover:scale-[1.03]
                          hover:border-cyan-200/50
                          hover:bg-white/28 dark:hover:bg-black/36
                        "
                        style={{
                          WebkitTextStroke: "0.7px rgba(0,0,0,0.35)",
                          textShadow:
                            "0 10px 22px rgba(0,0,0,0.38), 0 0 18px rgba(56,189,248,0.22)",
                        }}
                      >
                        Graphic Designer
                      </span>

                      {/* pill */}
                      <span
                        className="
                          inline-flex items-center rounded-full
                          px-4 py-2
                          text-sm sm:text-base md:text-lg
                          font-semibold uppercase
                          tracking-[0.18em]
                          border
                          border-white/30 dark:border-white/20
                          bg-white/22 dark:bg-black/30
                          text-white
                          backdrop-blur
                          transition-[transform,color,border-color,background-color] duration-200
                          hover:-translate-y-0.5 hover:scale-[1.03]
                          hover:border-cyan-200/50
                          hover:bg-white/28 dark:hover:bg-black/36
                        "
                        style={{
                          WebkitTextStroke: "0.7px rgba(0,0,0,0.35)",
                          textShadow:
                            "0 10px 22px rgba(0,0,0,0.38), 0 0 18px rgba(56,189,248,0.22)",
                        }}
                      >
                        Illustrations
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FEATURED WORK */}
        <Section title="Featured Work" subtitle="Browse by category">
          <Tabs tabs={tabs} initialId="poster" onChange={(id) => setCurrent(id as Cat)} className="mb-5" />
          <PreviewStrip ariaLabel="Featured work preview" items={previewItems} />
          <div className="mt-8">
            <Link href="/work" className="text-[var(--text)] underline underline-offset-4">
              See all work
            </Link>
          </div>
        </Section>
      </div>
    </div>
  )
}
