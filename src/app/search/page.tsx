import Section from "@/components/Section"
import SearchClient from "./SearchClient"

export const dynamic = "force-dynamic"   // disable prerender for this route
export const revalidate = 0

type SP = { q?: string; page?: string }

// Next 15/16 can pass searchParams as a Promise — unwrap it safely.
export default async function SearchPage(
  props: { searchParams?: SP | Promise<SP> }
) {
  const maybePromise = props?.searchParams as any
  const sp: SP =
    maybePromise && typeof maybePromise === "object" && typeof maybePromise.then === "function"
      ? await maybePromise
      : (maybePromise || {})

  const q = typeof sp.q === "string" ? sp.q : ""

  return (
    <div className="__container">
      <Section title="Search" subtitle={q ? `Results for “${q}”` : "Type to search"}>
        {/* Keep all “runtime” behavior in the client */}
        <SearchClient q={q} />
      </Section>
    </div>
  )
}
