"use client"

import { useMemo, useState } from "react"
import Section from "@/components/Section"
import Tabs, { TabDef } from "@/components/ui/Tabs"
import WorkCard from "@/components/WorkCard"
import { allProjects } from "contentlayer/generated"

type Cat = "poster" | "illustration" | "branding"

const tabs: TabDef[] = [
  { id: "poster", label: "Posters" },
  { id: "illustration", label: "Illustrations" },
  { id: "branding", label: "Branding" },
]

export default function WorkIndexClient() {
  const cards = useMemo(() => {
    const seen = new Set<string>()
    return (allProjects || [])
      .filter(p => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true })
      .map((p: any) => ({
        id: p._id,
        cat: p.category as Cat,
        node: (
          <WorkCard title={p.title} summary={p.summary} cover={p.cover ?? undefined} href={`/work/${p.slug}`} link={p.link ?? null} category={p.category ?? null} />
        ),
      }))
  }, [])

  const [current, setCurrent] = useState<Cat>("poster")
  const visible = cards.filter(c => c.cat === current)

  return (
    <div className="__container">
      <Section title="Portfolio" subtitle="All work by category">
        <Tabs tabs={tabs} initialId="poster" onChange={(id) => setCurrent(id as Cat)} className="mb-5" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map(v => <div key={v.id}>{v.node}</div>)}
        </div>
      </Section>
    </div>
  )
}