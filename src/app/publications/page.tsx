import Section from "@/components/Section"
import WorkCard from "@/components/WorkCard"
import { allPublications, allProjects } from "contentlayer/generated"

export const metadata = { title: "Publications" }

function isPdf(u?: string | null) {
  return !!u && /\.pdf(\?.*)?$/i.test(u)
}

export default function PublicationsPage() {
  const candidates: any[] =
    (allPublications as any[])?.length
      ? (allPublications as any[])
      : ((allProjects as any[]) || []).filter((p) => {
          const cat = String(p.category || "").toLowerCase()
          return cat === "publication" || cat === "publications"
        })

  const pubs = candidates
    .map((p) => {
      const link: string | null = p.link ?? p.file ?? p.url ?? null
      return { p, link }
    })
    .filter(({ link }) => isPdf(link))

  return (
    <div className="__container">
      <Section title="Publications" subtitle="Layouts, spreads, and editorial work.">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pubs.map(({ p, link }: any) => (
            <div key={p._id}>
              <WorkCard
                title={p.title}
                summary={p.summary}
                cover={undefined}
                href={`/publications/${p.slug}`}
                link={link}
                category="publication"
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
