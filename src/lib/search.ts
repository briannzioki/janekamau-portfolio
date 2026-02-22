import { allProjects, allPublications } from "contentlayer/generated"
import type { Project, Publication } from "contentlayer/generated"

export type SearchItem = {
  type: "project" | "publication"
  title: string
  summary?: string
  tags?: string[]
  year?: number
  url: string
}

const projectItems: SearchItem[] = (allProjects as Project[]).map((p) => ({
  type: "project",
  title: p.title,
  summary: (p as any).summary as string | undefined,
  tags: (p as any).tags as string[] | undefined,
  year: p.year,
  url: (p as any).url as string,
}))

const publicationItems: SearchItem[] = (allPublications as Publication[]).map((p) => ({
  type: "publication",
  title: p.title,
  summary: p.summary,
  tags: (p.tags as string[] | undefined),
  year: p.year,
  url: `/publications/${p.slug}`,
}))

const base: SearchItem[] = [...projectItems, ...publicationItems]

export function search(q: string): SearchItem[] {
  const s = q.trim().toLowerCase()
  if (!s) return base.slice().sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
  return base
    .map((item) => {
      const hay = [item.title, item.summary, ...(item.tags || [])].join(" ").toLowerCase()
      const score =
        (hay.includes(s) ? 2 : 0) +
        (item.title.toLowerCase().startsWith(s) ? 1 : 0) +
        (item.tags?.some((t) => t.toLowerCase() === s) ? 1 : 0)
      return { item, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => (b.item.year ?? 0) - (a.item.year ?? 0) || b.score - a.score)
    .map((x) => x.item)
}