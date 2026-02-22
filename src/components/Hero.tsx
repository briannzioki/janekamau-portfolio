// src/components/Hero.tsx
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl bg-surface p-8 shadow-soft">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative z-10 grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl">Jane Kamau</h1>
          <p className="mt-3 text-lg text-muted">Graphic Designer</p>
          <div className="mt-6 flex gap-3">
            <a className="rounded-xl bg-primary px-5 py-3 text-white" href="/work">View Portfolio</a>
            <a className="rounded-xl border border-token px-5 py-3" href="/publications">Publications</a>
          </div>
        </div>
        <div className="justify-self-end">
          <Image src="/og.png" alt="Hero" width={480} height={320} className="rounded-2xl" />
        </div>
      </div>
    </section>
  )
}
