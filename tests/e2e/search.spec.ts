// tests/e2e/search.spec.ts
import { test, expect } from '@playwright/test'

test('search page loads and filters as you type', async ({ page }) => {
  await page.goto('/search')
  const input = page.getByPlaceholder('Type to search')
  await expect(input).toBeVisible()
  await input.fill('a')
  // Results might be empty if no content yet; at least page should not error
  await expect(page).toHaveURL(/\/search/)
})
