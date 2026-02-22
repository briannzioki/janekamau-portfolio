// src/lib/cloudinary.ts
export function cld(src: string, w = 1600, h = 900, q = 'auto') {
  // Return non-Cloudinary sources untouched
  if (!src.includes('res.cloudinary.com')) return src

  // Helpers
  const inject = (marker: '/image/upload/' | '/video/upload/' | '/image/fetch/') =>
    src.replace(
      marker,
      `${marker}f_${q},c_fill,g_auto,w_${w},h_${h}/`,
    )

  // Already has a transform block like /upload/f_auto,.../
  const hasTransform = /\/(?:image|video)\/upload\/[a-z0-9_,]+\/?/i.test(src) || /\/image\/fetch\/[a-z0-9_,]+\/?/i.test(src)

  if (hasTransform) return src

  if (src.includes('/image/upload/')) return inject('/image/upload/')
  if (src.includes('/video/upload/')) return inject('/video/upload/')
  if (src.includes('/image/fetch/')) return inject('/image/fetch/')

  // Fallback for uncommon patterns
  return src
}
