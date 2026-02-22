"use client"

import { useEffect, useRef, useState } from "react"

type Aspect = "original" | "1:1" | "4:5" | "16:9"

function applyAspect(w: number, h: number, aspect: Aspect) {
  if (aspect === "original") return { cw: w, ch: h }
  const map: Record<Exclude<Aspect, "original">, number> = { "1:1": 1, "4:5": 4 / 5, "16:9": 16 / 9 }
  const target = map[aspect as Exclude<Aspect, "original">]
  const current = w / h
  if (current > target) {
    const cw = Math.round(h * target)
    return { cw, ch: h }
  } else {
    const ch = Math.round(w / target)
    return { cw: w, ch }
  }
}

export default function PhotoEditor() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [hue, setHue] = useState(0)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<Aspect>("original")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!imageUrl) return
    const i = new Image()
    i.crossOrigin = "anonymous"
    i.onload = () => setImg(i)
    i.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    if (!img) return
    const canvas = canvasRef.current
    if (!canvas) return

    const crop = applyAspect(img.naturalWidth, img.naturalHeight, aspect)
    const sx = Math.floor((img.naturalWidth - crop.cw) / 2)
    const sy = Math.floor((img.naturalHeight - crop.ch) / 2)

    const tmp = document.createElement("canvas")
    tmp.width = crop.cw
    tmp.height = crop.ch
    const tctx = tmp.getContext("2d")!
    tctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg)`
    tctx.drawImage(img, sx, sy, crop.cw, crop.ch, 0, 0, crop.cw, crop.ch)

    const rad = (rotate * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad))
    const cos = Math.abs(Math.cos(rad))
    const outW = Math.floor(crop.cw * cos + crop.ch * sin)
    const outH = Math.floor(crop.cw * sin + crop.ch * cos)

    canvas.width = outW
    canvas.height = outH
    const ctx = canvas.getContext("2d")!
    ctx.save()
    ctx.translate(outW / 2, outH / 2)
    ctx.rotate(rad)
    ctx.drawImage(tmp, -crop.cw / 2, -crop.ch / 2)
    ctx.restore()
  }, [img, brightness, contrast, saturation, hue, rotate, aspect])

  async function handleFile(file: File) {
    const url = URL.createObjectURL(file)
    setImageUrl(url)
  }

  async function exportCloudinary() {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    if (!cloud || !preset) {
      alert("Missing Cloudinary env vars")
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res as any, "image/jpeg", 0.92))
    if (!blob) return
    const body = new FormData()
    body.append("file", blob)
    body.append("upload_preset", preset)
    const r = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body })
    const json = await r.json()
    if (json.secure_url) {
      navigator.clipboard.writeText(json.secure_url).catch(() => {})
      alert("Uploaded. URL copied to clipboard")
    } else {
      alert("Upload failed")
    }
  }

  function downloadLocal() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement("a")
    a.href = canvas.toDataURL("image/jpeg", 0.92)
    a.download = "export.jpg"
    a.click()
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr,360px]">
      <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--glass)] backdrop-blur-lg p-3 shadow-soft">
        <canvas ref={canvasRef} className="max-h-[70vh] w-full rounded-xl bg-black/20" />
      </div>

      <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--glass)] backdrop-blur-lg p-4 shadow-soft">
        <div className="grid gap-3">
          <label className="text-sm text-[var(--text-muted)]">Load image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="rounded-xl border border-[color:var(--border)] bg-[var(--glass-elevated)] backdrop-blur-lg px-3 py-2"
          />
          <input
            type="url"
            placeholder="Paste image URL or Cloudinary URL"
            onBlur={(e) => e.target.value && setImageUrl(e.target.value)}
            className="rounded-xl border border-[color:var(--border)] bg-[var(--glass-elevated)] backdrop-blur-lg px-3 py-2"
          />

          <div className="mt-2 grid gap-2">
            <label className="text-sm text-[var(--text-muted)]">Brightness {brightness}%</label>
            <input type="range" min={0} max={200} value={brightness} onChange={(e) => setBrightness(+e.target.value)} />

            <label className="text-sm text-[var(--text-muted)]">Contrast {contrast}%</label>
            <input type="range" min={0} max={200} value={contrast} onChange={(e) => setContrast(+e.target.value)} />

            <label className="text-sm text-[var(--text-muted)]">Saturation {saturation}%</label>
            <input type="range" min={0} max={300} value={saturation} onChange={(e) => setSaturation(+e.target.value)} />

            <label className="text-sm text-[var(--text-muted)]">Hue {hue}°</label>
            <input type="range" min={-180} max={180} value={hue} onChange={(e) => setHue(+e.target.value)} />

            <label className="text-sm text-[var(--text-muted)]">Rotate {rotate}°</label>
            <input type="range" min={-180} max={180} value={rotate} onChange={(e) => setRotate(+e.target.value)} />

            <label className="text-sm text-[var(--text-muted)]">Aspect</label>
            <select
              className="rounded-xl border border-[color:var(--border)] bg-[var(--glass-elevated)] backdrop-blur-lg px-3 py-2"
              value={aspect}
              onChange={(e) => setAspect(e.target.value as Aspect)}
            >
              <option value="original">Original</option>
              <option value="1:1">1:1</option>
              <option value="4:5">4:5</option>
              <option value="16:9">16:9</option>
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={downloadLocal}
              className="rounded-xl border border-[color:var(--border)] bg-[var(--glass)] backdrop-blur-lg px-4 py-2 text-[var(--text)]"
            >
              Download
            </button>
            <button onClick={exportCloudinary} className="rounded-xl bg-primary px-4 py-2 text-white">
              Export to Cloudinary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
