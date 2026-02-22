import Section from "@/components/Section"
import SafeImage from "@/components/SafeImage"
import { allPublications } from "contentlayer/generated"

export const dynamicParams = false

function isPdf(u?: string | null) {
  return !!u && /\.pdf(\?.*)?$/i.test(u)
}

function deriveLink(p: any): string | null {
  return p?.link ?? p?.file ?? p?.url ?? null
}

export async function generateStaticParams() {
  return (allPublications || []).map((p) => ({ slug: p.slug }))
}

export default async function PublicationItem(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const p = (allPublications || []).find((x) => x.slug === slug)
  if (!p) return null

  const link = deriveLink(p)
  const preferPdf = isPdf(link)
  const cover = p.cover && p.cover.trim() ? p.cover : undefined

  return (
    <div className="__container">
      <Section title={p.title} subtitle={p.summary || ""}>
        <div className="rounded-2xl overflow-hidden border border-[color:var(--border)] bg-[var(--glass-elevated)] backdrop-blur-xl shadow-soft">
          {preferPdf ? (
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
          ) : (
            <div className="p-6 text-sm text-[var(--text-muted)]">No preview available.</div>
          )}
        </div>
      </Section>
    </div>
  )
}
