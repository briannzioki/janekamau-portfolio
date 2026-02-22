"use client"
import { useMDXComponent } from "next-contentlayer2/hooks"
import Image from "next/image"
import Link from "next/link"
import type { ComponentProps, HTMLAttributes } from "react"

const components = {
  a: (props: ComponentProps<typeof Link>) => (
    <Link {...props} className="underline underline-offset-4 text-[var(--text)] hover:text-[var(--accent)]" />
  ),
  img: (props: HTMLAttributes<HTMLImageElement> & { src: string; alt?: string }) => (
    <Image src={props.src} alt={props.alt || ""} width={1600} height={900} className="h-auto w-full rounded-xl border border-[color:var(--border)]" />
  ),
} as const

export default function MDX({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <Component components={components as any} />
    </div>
  )
}
