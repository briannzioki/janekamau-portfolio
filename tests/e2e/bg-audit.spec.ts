import { test } from "@playwright/test";
import fs from "fs/promises";

test("BG Audit: who paints the background on /", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const report = await page.evaluate(() => {
    const bodyCS = getComputedStyle(document.body);
    const rootCS = getComputedStyle(document.documentElement);

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("*"));
    const overlays: any[] = [];

    for (const el of nodes) {
      const cs = getComputedStyle(el);
      const pos = cs.position;
      const rect = el.getBoundingClientRect();

      const isCovering = rect.width >= vw * 0.9 && rect.height >= vh * 0.9;
      const hasGrad = /gradient\(/i.test(cs.backgroundImage || "");

      const opaqueBg = (() => {
        const c = cs.backgroundColor || "";
        if (!c || c === "transparent") return false;

        const m = c.match(/rgba?\(([^)]+)\)/i);
        if (!m) return true; // named color / hex / etc.

        const parts = m[1].split(",").map(s => s.trim());
        const a = parts.length === 4 ? parseFloat(parts[3]) : 1;
        return a > 0.01;
      })();

      if ((hasGrad || opaqueBg) && isCovering && (pos === "fixed" || pos === "absolute")) {
        overlays.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: el.className || null,
          pos,
          z: cs.zIndex,
          bgImg: cs.backgroundImage,
          bgCol: cs.backgroundColor,
          rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }
        });
      }
    }

    const heroCandidates = Array.from(
      document.querySelectorAll<HTMLElement>(".brand-gradient, [class*='brand-gradient']")
    ).map(el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        classes: el.className,
        pos: cs.position,
        bgImg: cs.backgroundImage,
        bgCol: cs.backgroundColor,
        rect: { x: r.x, y: r.y, w: r.width, h: r.height }
      };
    });

    return {
      vw,
      vh,
      rootVarBG: rootCS.getPropertyValue("--bg"),
      bodyBgImage: bodyCS.backgroundImage,
      bodyBgColor: bodyCS.backgroundColor,
      hasBrandMesh: !!document.querySelector(".bg-mesh"),
      hasBrandOrb: !!document.querySelector(".brand-orb"),
      overlays,
      heroCandidates
    };
  });

  await fs.mkdir("test-artifacts", { recursive: true });
  await fs.writeFile("test-artifacts/bg-audit.json", JSON.stringify(report, null, 2), "utf-8");
  await page.screenshot({ path: "test-artifacts/bg-audit.png", fullPage: true });

  // Hard signals that explain "why background didn't change"
  // 1) Abstract art still mounted somewhere
  if (report.hasBrandMesh || report.hasBrandOrb) {
    console.log("BG-AUDIT: Abstract-art classes detected (.bg-mesh or .brand-orb) - mounted somewhere.");
  }

  // 2) A full-viewport fixed/absolute overlay with gradient/opaque color on top
  if (report.overlays.length) {
    console.log("BG-AUDIT: Full-viewport overlays detected:");
    for (const o of report.overlays) console.log(o);
  }

  // 3) Hero block with brand-gradient spanning near full viewport
  const largeHero = report.heroCandidates.filter(
    (h: any) => h.rect.w > 0.9 * report.vw && h.rect.h > 0.9 * report.vh
  );

  if (largeHero.length) {
    console.log("BG-AUDIT: Hero candidate spans most of the viewport (could visually dominate):");
    for (const h of largeHero) console.log(h);
  }

  // Always pass; this is a diagnostic test. Read test-artifacts/bg-audit.json for details.
});
