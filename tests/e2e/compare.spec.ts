import { test, expect } from '@playwright/test'

test.describe('Compare Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/compare')
    await page.waitForLoadState('domcontentloaded')
  })

  test('should display compare page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Compare Kia Models' })).toBeVisible()
    await expect(page.getByText('Select up to 3 models to compare')).toBeVisible()
  })

  test('should show empty state when no models selected', async ({ page }) => {
    await expect(page.getByText('Select at least 2 models to start comparing')).toBeVisible()
  })

  test('should display model selection dropdown', async ({ page }) => {
    // Add model selector should be visible
    await expect(page.getByText('Add a model to compare')).toBeVisible()

    // Dropdown should be present
    const dropdown = page.locator('select')
    await expect(dropdown).toBeVisible()
  })

  test('should display model selector dropdown', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000)

    // Dropdown should be present (may be disabled if no models loaded)
    const dropdown = page.locator('select').first()
    await expect(dropdown).toBeVisible()
  })

  test('should show instructions when less than 2 models', async ({ page }) => {
    // With no models selected, should show instruction
    await expect(page.getByText('Select at least 2 models to start comparing')).toBeVisible()
  })

  test('should have CTA section with test drive button', async ({ page }) => {
    // Scroll to bottom to ensure CTA is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Check for "Ready to Experience?" heading
    await expect(page.getByRole('heading', { name: /Ready to Experience/i })).toBeVisible({ timeout: 5000 })

    // Check that there's a link with Calendar icon and Test Drive text
    // The link text includes the icon, so use a more flexible selector
    const ctaSection = page.locator('.bg-gradient-to-r, [class*="gradient"]').filter({ hasText: /Ready to Experience/i })
    const testDriveButton = ctaSection.locator('a, button').filter({ hasText: /Test Drive/i })
    await expect(testDriveButton).toBeVisible({ timeout: 5000 })
  })

  test('should have breadcrumb navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByText('Compare Models')).toBeVisible()
  })
})
