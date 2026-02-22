// tests/e2e/nav.spec.ts
import { test, expect } from '@playwright/test'

test('header navigation works', async ({ page }) => {
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Primary' })

  await Promise.all([
    page.waitForURL('**/work'),
    nav.getByRole('link', { name: 'Portfolio', exact: true }).click(),
  ])
  await expect(page).toHaveURL(/\/work/)

  await Promise.all([
    page.waitForURL('**/publications'),
    nav.getByRole('link', { name: 'Publications', exact: true }).click(),
  ])
  await expect(page).toHaveURL(/\/publications/)
})
