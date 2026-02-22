import Section from "@/components/Section"
import SafeImage from "@/components/SafeImage"
import Link from "next/link"

export const metadata = { title: "About" }

export default function AboutPage() {
  return (
    <div className="__container">
      <Section title="About me" subtitle="Designer & illustrator in Nairobi">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <p className="text-[var(--text)] whitespace-pre-line">
              I’m a self-taught graphic designer and illustrator based in Nairobi, Kenya. I have five years of proven experience working closely with local and international non-profit organizations on social impact projects focused on championing the rights of girls and women, gender equality, sexual and reproductive health, and human rights. I thrive on the belief that design is more than creating visuals. It’s the visual representation of impactful storytelling, awareness, and resource sharing.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/resume" className="btn secondary">
                Open Resume
              </Link>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[color:var(--border)] shadow-soft">
            <SafeImage
              src={"/portfolio/placeholders/profile photo.png"}
              alt="Jane Kamau"
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Section>
    </div>
  )
}
