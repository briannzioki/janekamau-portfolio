// tests/e2e/sitemap.spec.ts
import { test, expect } from '@playwright/test'

test('sitemap exists', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/sitemap.xml`)
  expect(res.ok()).toBeTruthy()
  const text = await res.text()
  expect(text).toContain('<urlset')
})
