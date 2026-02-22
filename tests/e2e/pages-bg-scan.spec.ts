import { test } from "@playwright/test";
import fs from "fs/promises";
import path from "path";

type RouteInfo = { file: string; route: string; reasonSkip?: string };

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "api") continue;
      out.push(...(await walk(full)));
    } else {
      if (/^page\.(tsx|ts|jsx|js)$/.test(e.name)) out.push(full);
    }
  }
  return out;
}

function toRoute(appDir: string, pageFile: string): RouteInfo {
  const relDir = path.relative(appDir, path.dirname(pageFile));
  const partsRaw = relDir.split(path.sep).filter(Boolean);

  const parts: string[] = [];
  for (const p of partsRaw) {
    if (p.startsWith("(") && p.endsWith(")")) continue; // route groups
    if (p.startsWith("@")) continue; // parallel routes
    if (p.includes("[") && p.includes("]")) {
      return { file: pageFile, route: "/", reasonSkip: `dynamic segment "${p}"` };
    }
    parts.push(p);
  }

  const route = "/" + parts.join("/");
  return { file: pageFile, route: route === "/" ? "/" : route.replace(/\/+$/, "") };
}

test("Pages BG scan: find opaque panels/overlays hiding background art", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const appDir = path.join(process.cwd(), "src", "app");
  const pages = await walk(appDir);

  const routes: RouteInfo[] = [];
  const seen = new Set<string>();

  for (const f of pages) {
    const info = toRoute(appDir, f);
    if (info.reasonSkip) {
      routes.push(info);
      continue;
    }
    if (seen.has(info.route)) continue;
    seen.add(info.route);
    routes.push(info);
  }

  const results: any[] = [];
  await fs.mkdir("test-artifacts/pages", { recursive: true });

  for (const r of routes) {
    if (r.reasonSkip) {
      results.push({ route: r.route, file: r.file, skipped: true, reason: r.reasonSkip });
      continue;
    }

    try {
      await page.goto(r.route, { waitUntil: "networkidle" });
      await page.waitForTimeout(150);

      const rep = await page.evaluate(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const brandBg = document.querySelector<HTMLElement>(".brand-bg");
        const mesh = document.querySelector<HTMLElement>(".bg-mesh");
        const orbCount = document.querySelectorAll(".brand-orb").length;

        const bodyCS = getComputedStyle(document.body);
        const rootCS = getComputedStyle(document.documentElement);

        const alphaFromColor = (c: string): number => {
          if (!c || c === "transparent") return 0;

          // rgba(0,0,0,0.5) or rgb(0,0,0)
          let m = c.match(/rgba?\(([^)]+)\)/i);
          if (m) {
            const parts = m[1].split(",").map((s) => s.trim());
            return parts.length === 4 ? parseFloat(parts[3]) : 1;
          }

          // CSS Color 4: color(srgb r g b / a)
          // example: color(srgb 0.0784314 0.0745098 0.0666667 / 0.86)
          m = c.match(/color\(\s*srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\/\s*([0-9.]+)\s*\)/i);
          if (m) {
            return parseFloat(m[4]);
          }

          // CSS Color 4: rgb(r g b / a) (space-separated)
          m = c.match(/rgb\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\/\s*([0-9.]+)\s*\)/i);
          if (m) {
            return parseFloat(m[4]);
          }

          // named colors / hex -> treat as opaque
          return 1;
        };

        // Find BIG panels that likely hide the animated background (opaque bg, big rect)
        const blockers: any[] = [];
        const nodes = Array.from(document.querySelectorAll<HTMLElement>("*"));

        for (const el of nodes) {
          const cs = getComputedStyle(el);
          const rect = el.getBoundingClientRect();

          if (rect.width < vw * 0.5) continue;
          if (rect.height < 160) continue;

          // ignore our background art
          if (
            el.classList.contains("brand-bg") ||
            el.classList.contains("bg-mesh") ||
            el.classList.contains("brand-orb")
          ) {
            continue;
          }

          const bgImg = cs.backgroundImage || "";
          const bgCol = cs.backgroundColor || "";

          const hasGrad = /gradient\(/i.test(bgImg);
          const alpha = alphaFromColor(bgCol);

          // “opaque-ish” background will block the art
          const blocksBg = alpha > 0.92 || (hasGrad && alpha > 0.2);

          if (blocksBg) {
            blockers.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || null,
              classes: (el.className || "").toString() || null,
              pos: cs.position,
              z: cs.zIndex,
              bgCol,
              bgImg,
              alpha,
              rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
            });
          }
        }

        blockers.sort((a, b) => b.rect.w * b.rect.h - a.rect.w * a.rect.h);
        const topBlockers = blockers.slice(0, 12);

        return {
          url: location.href,
          rootVarBG: rootCS.getPropertyValue("--bg").trim(),
          bodyBgColor: bodyCS.backgroundColor,
          brandBgMounted: !!brandBg,
          meshMounted: !!mesh,
          orbCount,
          topBlockers,
        };
      });

      const slug = r.route === "/" ? "home" : r.route.replace(/\//g, "_").replace(/^_+/, "");
      await page.screenshot({ path: `test-artifacts/pages/${slug}.png`, fullPage: true });

      results.push({ route: r.route, file: r.file, ...rep });
    } catch (err: any) {
      results.push({ route: r.route, file: r.file, error: String(err?.message ?? err) });
    }
  }

  await fs.writeFile(
    "test-artifacts/pages-bg-scan.json",
    JSON.stringify({ routes, results }, null, 2),
    "utf-8"
  );

  console.log(`PAGES-BG-SCAN: wrote test-artifacts/pages-bg-scan.json with ${results.length} entries`);
});
