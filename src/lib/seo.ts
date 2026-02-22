// src/lib/seo.ts
import type { Metadata } from 'next'

const site = {
  name: 'Jane Kamau',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://janekamau.site',
  description:
    'Graphic designer portfolio showcasing brand identities, posters, print, and visual systems.',
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Portfolio`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Portfolio`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Portfolio`,
    description: site.description,
    images: ['/og.png'],
  },
}
