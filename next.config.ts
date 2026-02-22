// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the warning and use Turbopack by default
  turbopack: {},
  // No webpack overrides needed anymore
};

export default nextConfig;
