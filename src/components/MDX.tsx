"use client"

import * as React from "react"
import { useMDXComponent } from "next-contentlayer2/hooks"

function isPdfHref(href?: string) {
  return !!href && /\.pdf(\?.*)?$/i.test(href)
}

const components = {
  h2: (props: any) => <h2 className="mt-8 text-2xl font-semibold text-[var(--text)]" {...props} />,
  h3: (props: any) => <h3 className="mt-6 text-xl font-semibold text-[var(--text)]" {...props} />,
  p: (props: any) => <p className="mt-4 leading-7 text-[var(--text-muted)]" {...props} />,
  ul: (props: any) => <ul className="mt-4 list-disc pl-6 text-[var(--text-muted)]" {...props} />,
  ol: (props: any) => <ol className="mt-4 list-decimal pl-6 text-[var(--text-muted)]" {...props} />,
  img: (props: any) => <img className="mt-4 rounded-xl border border-[color:var(--border)]" {...props} />,

  a: (props: any) => {
    const href = String(props?.href || "")
    if (isPdfHref(href)) {
      return (
        <div className="mt-4 rounded-2xl overflow-hidden border border-[color:var(--border)] bg-[var(--glass-elevated)] backdrop-blur-xl shadow-soft">
          <div className="w-full h-[72vh] min-h-[540px] max-h-[980px]">
            <embed
              src={`${href}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
              type="application/pdf"
              className="h-full w-full"
            />
          </div>
        </div>
      )
    }
    return <a className="underline underline-offset-4" {...props} />
  },

  code: (props: any) => (
    <code
      className={[
        "rounded px-1 py-0.5",
        "border border-[color:var(--border)]",
        "bg-[var(--glass)] backdrop-blur-sm",
        "text-[var(--text)]",
      ].join(" ")}
      {...props}
    />
  ),

  pre: (props: any) => (
    <pre
      className={[
        "overflow-x-auto rounded-xl p-4",
        "border border-[color:var(--border)]",
        "bg-[var(--glass-elevated)] backdrop-blur-xl shadow-soft",
      ].join(" ")}
      {...props}
    />
  ),
}

export default function MDX({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return (
    <article className="max-w-none">
      <Component components={components as any} />
    </article>
  )
}
