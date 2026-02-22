import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        glow: "0 10px 30px rgba(28,20,38,.35), 0 40px 80px rgba(28,20,38,.45)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [],
}

export default config