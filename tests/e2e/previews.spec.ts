// tests/e2e/previews.spec.ts
import { test, expect, Page, TestInfo } from "@playwright/test"

async function resolveAbsolute(page: Page, url: string) {
  return new URL(url, page.url()).href
}

test.describe("Preview rendering", () => {
  test("Publications: PDF preview uses native <embed>", async ({ page }) => {
    await page.goto("/publications")

    // at least one PDF card renders an <embed>
    const embed = page.locator('embed[type="application/pdf"]').first()
    await expect(embed).toBeVisible({ timeout: 15000 })

    // the embed is actually laid out (non-zero size)
    const bbox = await embed.boundingBox()
    expect(bbox && bbox.width > 10 && bbox.height > 10).toBe(true)

    // the embed src points to a real PDF that returns 200 with a PDF-ish content-type
    const src = await embed.getAttribute("src")
    expect(src).toBeTruthy()
    const absolute = await resolveAbsolute(page, src!)
    const clean = absolute.split("#")[0]
    const res = await page.request.get(clean)
    expect(res.status(), "PDF response should be 200").toBe(200)
    const ct = (res.headers()["content-type"] || "").toLowerCase()
    expect(ct.includes("pdf") || ct.includes("application/octet-stream")).toBe(true)
  })

  test("Branding/Work: image cards load actual images", async ({ page }) => {
    await page.goto("/work")
    const img = page.locator("img").first()
    await expect(img).toBeVisible({ timeout: 10000 })
    const loaded = await img.evaluate((el: HTMLImageElement) => Number(el.naturalWidth) > 0 && Number(el.naturalHeight) > 0)
    expect(loaded).toBe(true)
  })
})

test.afterEach(async ({ page }, testInfo: TestInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `test-artifacts/${testInfo.title.replace(/\s+/g, "_")}.png`,
      fullPage: true,
    })
  }
})
