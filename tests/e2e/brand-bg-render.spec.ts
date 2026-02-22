import { test } from "@playwright/test";
import fs from "fs/promises";

test("BrandBackground audit: mounted, visible, animating, not covered", async ({ page }) => {
  // Ensure the test environment isn't disabling motion
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.goto("/", { waitUntil: "networkidle" });

  // Wait a moment so CSS animations have a chance to tick
  await page.waitForTimeout(200);

  const base = await page.evaluate(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const brandBg = document.querySelector<HTMLElement>(".brand-bg");
    const mesh = document.querySelector<HTMLElement>(".bg-mesh");
    const orbs = Array.from(document.querySelectorAll<HTMLElement>(".brand-orb"));

    const csOf = (el: Element | null) => {
      if (!el) return null;
      const cs = getComputedStyle(el as Element);
      return {
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        position: cs.position,
        zIndex: cs.zIndex,
        pointerEvents: cs.pointerEvents,
        backgroundImage: cs.backgroundImage,
        backgroundColor: cs.backgroundColor,
        filter: cs.filter,
        transform: cs.transform,
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
        animationPlayState: cs.animationPlayState,
      };
    };

    const rectOf = (el: Element | null) => {
      if (!el) return null;
      const r = (el as HTMLElement).getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    };

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // Scan stylesheets for rules that mention these selectors (to catch display:none, background:none, !important, etc.)
    const ruleHits: Array<{ href: string | null; text: string }> = [];
    const want = [".bg-mesh", ".brand-orb", ".brand-bg"];

    const scanRules = (rules: CSSRuleList, href: string | null) => {
      for (const r of Array.from(rules)) {
        // Style rules
        if ((r as any).selectorText) {
          const sel = String((r as any).selectorText);
          if (want.some((w) => sel.includes(w))) {
            ruleHits.push({ href, text: (r as CSSStyleRule).cssText });
          }
        }
        // Media rules (recurse)
        if ((r as any).cssRules) {
          try {
            scanRules((r as any).cssRules as CSSRuleList, href);
          } catch {
            // ignore
          }
        }
      }
    };

    for (const ss of Array.from(document.styleSheets)) {
      try {
        const href = (ss as CSSStyleSheet).href ?? null;
        const rules = (ss as CSSStyleSheet).cssRules;
        if (rules) scanRules(rules, href);
      } catch {
        // ignore blocked sheets
      }
    }

    // Overlay scan: find fixed/absolute full-viewport elements with gradient/opaque bg
    // BUT also compute "foreign overlays" that are NOT your background art.
    const overlaysAll: any[] = [];
    const overlaysForeign: any[] = [];

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("*"));
    for (const el of nodes) {
      const cs = getComputedStyle(el);
      const pos = cs.position;
      const r = el.getBoundingClientRect();

      const isCovering = r.width >= vw * 0.9 && r.height >= vh * 0.9;
      const hasGrad = /gradient\(/i.test(cs.backgroundImage || "");

      const opaqueBg = (() => {
        const c = cs.backgroundColor || "";
        if (!c || c === "transparent") return false;
        const m = c.match(/rgba?\(([^)]+)\)/i);
        if (!m) return true;
        const parts = m[1].split(",").map((s) => s.trim());
        const a = parts.length === 4 ? parseFloat(parts[3]) : 1;
        return a > 0.01;
      })();

      if ((hasGrad || opaqueBg) && isCovering && (pos === "fixed" || pos === "absolute")) {
        const classes = (el.className || "").toString();
        const entry = {
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: classes || null,
          pos,
          z: cs.zIndex,
          bgImg: cs.backgroundImage,
          bgCol: cs.backgroundColor,
          rect: { x: r.x, y: r.y, w: r.width, h: r.height },
        };

        overlaysAll.push(entry);

        const isOurBg =
          el.classList.contains("brand-bg") ||
          el.classList.contains("bg-mesh") ||
          el.classList.contains("brand-orb") ||
          classes.includes("brand-bg") ||
          classes.includes("bg-mesh") ||
          classes.includes("brand-orb");

        if (!isOurBg) overlaysForeign.push(entry);
      }
    }

    // What is actually on top at a point near the corner (where mesh/orbs should be visible)?
    const probePoints = [
      { name: "topLeft", x: Math.floor(vw * 0.12), y: Math.floor(vh * 0.12) },
      { name: "topRight", x: Math.floor(vw * 0.88), y: Math.floor(vh * 0.12) },
      { name: "bottomLeft", x: Math.floor(vw * 0.12), y: Math.floor(vh * 0.88) },
      { name: "bottomRight", x: Math.floor(vw * 0.88), y: Math.floor(vh * 0.88) },
    ];

    const topAt = probePoints.map((p) => {
      const el = document.elementFromPoint(p.x, p.y) as HTMLElement | null;
      if (!el) return { ...p, top: null };
      const cs = getComputedStyle(el);
      return {
        ...p,
        top: {
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: (el.className || "").toString() || null,
          pos: cs.position,
          z: cs.zIndex,
          bgImg: cs.backgroundImage,
          bgCol: cs.backgroundColor,
        },
      };
    });

    return {
      url: location.href,
      viewport: { vw, vh },
      reducedMotion,
      exists: {
        brandBg: !!brandBg,
        mesh: !!mesh,
        orbCount: orbs.length,
      },
      brandBg: { rect: rectOf(brandBg), computed: csOf(brandBg) },
      mesh: { rect: rectOf(mesh), computed: csOf(mesh) },
      orb0: {
        rect: rectOf(orbs[0] ?? null),
        computed: csOf(orbs[0] ?? null),
        vars: orbs[0]
          ? {
              c: getComputedStyle(orbs[0]).getPropertyValue("--c").trim(),
              size: getComputedStyle(orbs[0]).getPropertyValue("--size").trim(),
              opacity: getComputedStyle(orbs[0]).getPropertyValue("--opacity").trim(),
              dur: getComputedStyle(orbs[0]).getPropertyValue("--dur").trim(),
              tx: getComputedStyle(orbs[0]).getPropertyValue("--tx").trim(),
              ty: getComputedStyle(orbs[0]).getPropertyValue("--ty").trim(),
            }
          : null,
      },
      overlaysAll,
      overlaysForeign,
      topAt,
      ruleHits,
    };
  });

  // Probe animation: do transforms change over time?
  const animProbe = async () => {
    const snap = async () =>
      page.evaluate(() => {
        const mesh = document.querySelector<HTMLElement>(".bg-mesh");
        const orb = document.querySelector<HTMLElement>(".brand-orb");
        const csMesh = mesh ? getComputedStyle(mesh) : null;
        const csOrb = orb ? getComputedStyle(orb) : null;
        return {
          mesh: mesh
            ? {
                transform: csMesh?.transform,
                animationName: csMesh?.animationName,
                animationDuration: csMesh?.animationDuration,
                animationPlayState: csMesh?.animationPlayState,
              }
            : null,
          orb: orb
            ? {
                transform: csOrb?.transform,
                animationName: csOrb?.animationName,
                animationDuration: csOrb?.animationDuration,
                animationPlayState: csOrb?.animationPlayState,
                tx: csOrb?.getPropertyValue("--tx").trim(),
                ty: csOrb?.getPropertyValue("--ty").trim(),
              }
            : null,
        };
      });

    const a = await snap();
    await page.waitForTimeout(1200);
    const b = await snap();

    // Also test pointer-parallax is updating vars
    const vp = base.viewport;
    await page.mouse.move(vp.vw * 0.2, vp.vh * 0.2);
    await page.waitForTimeout(50);
    await page.mouse.move(vp.vw * 0.8, vp.vh * 0.8);
    await page.waitForTimeout(50);
    const c = await snap();

    return {
      t0: a,
      t1: b,
      afterPointer: c,
      meshTransformChanged: a.mesh?.transform !== b.mesh?.transform,
      orbTransformChanged: a.orb?.transform !== b.orb?.transform,
      orbVarsChanged: a.orb?.tx !== c.orb?.tx || a.orb?.ty !== c.orb?.ty,
    };
  };

  const probe = await animProbe();

  const hints: string[] = [];

  if (!base.exists.brandBg) hints.push("No .brand-bg -> BrandBackground is NOT mounted on /.");
  if (!base.exists.mesh) hints.push("No .bg-mesh -> mesh element not rendered.");
  if (base.exists.orbCount === 0) hints.push("No .brand-orb -> orbs not rendered.");

  if (base.mesh?.computed) {
    if (base.mesh.computed.display === "none") hints.push(".bg-mesh display:none -> CSS is disabling it.");
    if (base.mesh.computed.backgroundImage === "none") hints.push(".bg-mesh background-image:none -> CSS override is killing gradients.");
    if (base.mesh.computed.animationName === "none") hints.push(".bg-mesh animationName=none -> animations disabled (CSS or reduced motion).");
  }

  if (base.orb0?.computed) {
    if (base.orb0.computed.display === "none") hints.push(".brand-orb display:none -> CSS is disabling orbs.");
    if (base.orb0.computed.animationName === "none") hints.push(".brand-orb animationName=none -> animations disabled (CSS or reduced motion).");
  }

  if (base.reducedMotion) {
    hints.push("prefers-reduced-motion: reduce is ON in the browser -> your CSS will stop animations.");
  }

  // Only warn about overlays if they are NOT our background art
  if (base.overlaysForeign.length) {
    hints.push("Foreign full-viewport overlay(s) detected -> likely covering your background art. See overlaysForeign[].");
  }

  if (base.exists.mesh && base.exists.orbCount > 0) {
    if (!probe.meshTransformChanged && base.mesh?.computed?.animationName !== "none") {
      hints.push("Mesh animationName is set but transform didn't change over time -> animation may be paused.");
    }
    if (!probe.orbTransformChanged && base.orb0?.computed?.animationName !== "none") {
      hints.push("Orb animationName is set but transform didn't change over time -> animation may be paused.");
    }
    if (!probe.orbVarsChanged) {
      hints.push("Pointer-parallax vars (--tx/--ty) did not change -> your pointermove handler isn't firing.");
    }
  }

  const out = { ...base, animationProbe: probe, hints };

  await fs.mkdir("test-artifacts", { recursive: true });
  await fs.writeFile("test-artifacts/brand-bg-audit.json", JSON.stringify(out, null, 2), "utf-8");
  await page.screenshot({ path: "test-artifacts/brand-bg-audit.png", fullPage: true });

  if (hints.length) {
    console.log("BRAND-BG-AUDIT HINTS:");
    for (const h of hints) console.log(" -", h);
  } else {
    console.log("BRAND-BG-AUDIT: No obvious blockers detected.");
  }

  if (base.overlaysForeign.length) {
    console.log("BRAND-BG-AUDIT: overlaysForeign (top 5):");
    for (const o of base.overlaysForeign.slice(0, 5)) console.log(o);
  }
});
