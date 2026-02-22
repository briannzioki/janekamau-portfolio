// src/app/editor/page.tsx
'use client'

import Section from '@/components/Section'
import PhotoEditor from '@/components/PhotoEditor'

export default function EditorPage() {
  return (
    <Section title="Editor" subtitle="Adjust and export artwork to Cloudinary">
      <PhotoEditor />
    </Section>
  )
}
