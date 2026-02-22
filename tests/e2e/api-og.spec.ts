// tests/e2e/api-og.spec.ts
import { test, expect } from '@playwright/test'

test('OG image endpoint returns PNG', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/og`)
  expect(res.ok()).toBeTruthy()
  expect(res.headers()['content-type']).toContain('image/png')
})
