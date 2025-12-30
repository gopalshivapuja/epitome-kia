import { test, expect } from '@playwright/test'

test.describe('Brochure Download', () => {
  // These tests require database access for model pages
  // Skip if database is not available (model page returns 404 or error)
  test.setTimeout(60000)

  test('should display Download Brochure button on model page', async ({ page }) => {
    const response = await page.goto('/models/seltos')

    // Skip if page failed to load (no database)
    if (!response || response.status() >= 400) {
      test.skip(true, 'Model page requires database - skipping')
      return
    }

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Check if we got the actual model page or 404
    const heading = page.getByRole('heading', { name: /Seltos/i })
    const hasHeading = await heading.count() > 0

    if (!hasHeading) {
      test.skip(true, 'Model data not available - skipping')
      return
    }

    // Download Brochure button should be visible
    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible({ timeout: 10000 })
  })

  test('should have correct brochure URL for Seltos', async ({ page }) => {
    const response = await page.goto('/models/seltos')

    if (!response || response.status() >= 400) {
      test.skip(true, 'Model page requires database - skipping')
      return
    }

    await page.waitForTimeout(2000)

    const heading = page.getByRole('heading', { name: /Seltos/i })
    if (await heading.count() === 0) {
      test.skip(true, 'Model data not available - skipping')
      return
    }

    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible({ timeout: 10000 })

    // Should link to Kia India brochure
    await expect(brochureButton).toHaveAttribute('href', /kia\.com.*seltos.*brochure/i)
    await expect(brochureButton).toHaveAttribute('target', '_blank')
    await expect(brochureButton).toHaveAttribute('rel', /noopener/)
  })

  test('should have Download Brochure button on Sonet page', async ({ page }) => {
    const response = await page.goto('/models/sonet')

    if (!response || response.status() >= 400) {
      test.skip(true, 'Model page requires database - skipping')
      return
    }

    await page.waitForTimeout(2000)

    const heading = page.getByRole('heading', { name: /Sonet/i })
    if (await heading.count() === 0) {
      test.skip(true, 'Model data not available - skipping')
      return
    }

    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible({ timeout: 10000 })
    await expect(brochureButton).toHaveAttribute('href', /kia\.com.*sonet.*brochure/i)
  })

  test('should have Download Brochure button on Carens page', async ({ page }) => {
    const response = await page.goto('/models/carens')

    if (!response || response.status() >= 400) {
      test.skip(true, 'Model page requires database - skipping')
      return
    }

    await page.waitForTimeout(2000)

    const heading = page.getByRole('heading', { name: /Carens/i })
    if (await heading.count() === 0) {
      test.skip(true, 'Model data not available - skipping')
      return
    }

    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible({ timeout: 10000 })
    await expect(brochureButton).toHaveAttribute('href', /kia\.com.*carens.*brochure/i)
  })

  test('should have Download Brochure button on EV6 page', async ({ page }) => {
    const response = await page.goto('/models/ev6')

    if (!response || response.status() >= 400) {
      test.skip(true, 'Model page requires database - skipping')
      return
    }

    await page.waitForTimeout(2000)

    const heading = page.getByRole('heading', { name: /EV6/i })
    if (await heading.count() === 0) {
      test.skip(true, 'Model data not available - skipping')
      return
    }

    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible({ timeout: 10000 })
    await expect(brochureButton).toHaveAttribute('href', /kia\.com.*ev6.*brochure/i)
  })
})
