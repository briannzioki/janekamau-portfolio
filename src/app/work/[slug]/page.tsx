import Section from "@/components/Section"
import SafeImage from "@/components/SafeImage"
import { allProjects } from "contentlayer/generated"

export const dynamicParams = false

export async function generateStaticParams() {
  return (allProjects || []).map((p) => ({ slug: p.slug }))
}

function isPdf(u?: string | null) {
  return !!u && /\.pdf(\?.*)?$/i.test(u)
}

export default async function WorkItem(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const p = (allProjects || []).find((x) => x.slug === slug)
  if (!p) return null

  const link = typeof p.link === "string" ? p.link : null
  const isBrandingPdf = String(p.category || "").toLowerCase() === "branding" && isPdf(link)

  const cover = p.cover && p.cover.trim() ? p.cover : undefined

  return (
    <div className="__container">
      <Section title={p.title} subtitle={p.summary || ""}>
        <div className="rounded-2xl overflow-hidden border border-[color:var(--border)] bg-[var(--glass-elevated)] backdrop-blur-xl shadow-soft">
          {isBrandingPdf ? (
            <div className="w-full h-[78vh] min-h-[560px] max-h-[980px]">
              <embed
                src={`${link as string}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                type="application/pdf"
                className="h-full w-full"
              />
            </div>
          ) : cover ? (
            <SafeImage
              src={cover}
              alt={p.title}
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      </Section>
    </div>
  )
}
