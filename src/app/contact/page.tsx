import Section from "@/components/Section"
import ContactForm from "@/components/ContactForm"

export const metadata = { title: "Work with me" }

export default function WorkWithMePage() {
  const fieldBase =
    "w-full rounded-lg border border-[color:var(--border)] bg-[var(--glass)] backdrop-blur-lg px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"

  return (
    <div className="__container">
      <Section
        title="Let’s work together!"
        subtitle="Tell me a bit about your project. I aim to reply within 24 hours."
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-2xl bg-[var(--glass-elevated)] backdrop-blur-xl border border-[color:var(--border)] p-6 shadow-glow">
            <ContactForm fieldBase={fieldBase} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl p-4 border border-[color:var(--border)] bg-[var(--glass)] backdrop-blur-lg shadow-soft">
              <div className="badge">Services</div>
              <ul className="mt-3 space-y-1 text-sm text-[var(--text-muted)]">
                <li>• Publication design</li>
                <li>• Illustration</li>
                <li>• Posters & campaigns</li>
                <li>• Social templates</li>
              </ul>
            </div>

            <div className="rounded-2xl p-4 border border-[color:var(--border)] bg-[var(--glass)] backdrop-blur-lg shadow-soft">
              <div className="badge">Selected clients</div>
              <p className="mt-3 text-sm text-[var(--text-muted)]">Logos appear above the footer.</p>
            </div>
          </aside>
        </div>
      </Section>
    </div>
  )
}