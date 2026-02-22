import { allProjects, allPublications } from "contentlayer/generated"
import type { Project, Publication } from "contentlayer/generated"

export const runtime = "edge"

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://janekamau.site"

  const staticPaths = ["", "/work", "/publications", "/about", "/contact", "/editor", "/search"]
  const staticXml = staticPaths.map((p) => `<url><loc>${base}${p}</loc></url>`).join("")

  const proj = (allProjects as Project[])
    .map((p) => `<url><loc>${base}/work/${esc(p.slug)}</loc></url>`)
    .join("")

  const pubs = (allPublications as Publication[])
    .map((p) => `<url><loc>${base}/publications/${esc(p.slug)}</loc></url>`)
    .join("")

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    staticXml + proj + pubs +
    `</urlset>`

  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } })
}