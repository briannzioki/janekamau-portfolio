// src/components/UploadTest.tsx
'use client'
import { useState } from 'react'
import { uploadToCloudinary } from '@/lib/upload'

export default function UploadTest() {
  const [url, setUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  return (
    <div className="grid gap-3">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          if (!f) return
          setBusy(true)
          try {
            const r = await uploadToCloudinary(f, 'portfolio/posters')
            setUrl(r.secure_url)
          } finally {
            setBusy(false)
          }
        }}
      />
      {busy && <div>Uploading…</div>}
      {url && (
        <a className="text-accent underline" href={url} target="_blank" rel="noreferrer">
          View on Cloudinary
        </a>
      )}
    </div>
  )
}
