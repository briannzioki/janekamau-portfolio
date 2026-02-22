// src/app/layout.tsx
import "./globals.css"
import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Providers from "./providers"
import BrandBackground from "@/components/BrandBackground"

export const metadata: Metadata = {
  title: "Jane Kamau  Graphic Designer",
  description: "Posters, illustrations, and publications.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased relative">
        <BrandBackground />

        <Providers>
          <div className="relative z-10">
            <div className="__container">
              <Header />
            </div>
            <main>{children}</main>
            <div className="__container">
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
