import Section from "@/components/Section"

export const metadata = { title: "Resume" }

export default function ResumePage() {
  const href = "/portfolio/resume/Graphic Design Resume.pdf"

  return (
    <div className="__container">
      <Section title="Resume" subtitle="View inside the site">
        <div className="rounded-2xl overflow-hidden border border-[color:var(--border)] bg-[var(--glass-elevated)] backdrop-blur-xl shadow-soft">
          <div className="w-full h-[78vh] min-h-[560px] max-h-[980px]">
            <embed
              src={`${href}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              type="application/pdf"
              className="h-full w-full"
            />
          </div>
        </div>
      </Section>
    </div>
  )
}
