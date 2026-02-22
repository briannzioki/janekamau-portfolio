// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B0F17',
          color: '#E2E8F0',
          fontSize: 56,
          fontWeight: 700,
        }}
      >
        Jane Kamau Portfolio
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
