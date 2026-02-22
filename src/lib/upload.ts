// src/lib/upload.ts
export async function uploadToCloudinary(file: File, folder = 'portfolio') {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', preset)
  fd.append('folder', folder)
  fd.append('resource_type', 'auto')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/auto/upload`, {
    method: 'POST',
    body: fd,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || 'Upload failed')
  return json as { secure_url: string; public_id: string }
}
