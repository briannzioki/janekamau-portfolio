"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"
import clsx from "clsx"

type Props = Omit<ImageProps, "alt"> & {
  alt: string
  fallbackBoxClassName?: string
}

export default function SafeImage({
  className,
  fallbackBoxClassName,
  alt,
  src,
  ...rest
}: Props) {
  const [failed, setFailed] = useState(false)

  const srcStr = typeof src === "string" ? src.trim() : (src as any)
  const isPdf = typeof srcStr === "string" && /\.pdf($|\?)/i.test(srcStr)
  const showImg = !!srcStr && !failed && !isPdf

  if (!showImg) {
    return (
      <div
        className={clsx(
          // glass by default so background art can show through
          "bg-[var(--glass)] backdrop-blur-lg",
          "border border-[color:var(--border)]",
          "text-[var(--text-muted)]",
          "flex items-center justify-center",
          fallbackBoxClassName,
          className
        )}
        aria-hidden
      />
    )
  }

  return (
    <Image
      {...rest}
      src={src as any}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
