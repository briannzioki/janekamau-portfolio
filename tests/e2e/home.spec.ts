// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('home renders hero and CTAs', async ({ page }) => {
  await page.goto('/')

  const main = page.locator('#main')
  await expect(main.getByRole('heading', { name: 'Jane Kamau' })).toBeVisible()
  await expect(main.getByRole('link', { name: 'View Portfolio', exact: true })).toBeVisible()

  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Publications', exact: true })).toBeVisible()
})
