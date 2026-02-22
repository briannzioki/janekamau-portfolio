// src/app/providers.tsx
"use client"

import React from "react"
import { ThemeProvider } from "next-themes"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}