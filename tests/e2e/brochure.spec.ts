import { test, expect } from '@playwright/test'

test.describe('Brochure Download', () => {
  test('should display Download Brochure button on model page', async ({ page }) => {
    await page.goto('/models/seltos')
    await page.waitForLoadState('networkidle')

    // Download Brochure button should be visible
    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible()
  })

  test('should have correct brochure URL for Seltos', async ({ page }) => {
    await page.goto('/models/seltos')
    await page.waitForLoadState('networkidle')

    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })

    // Should link to Kia India brochure
    await expect(brochureButton).toHaveAttribute('href', /kia\.com.*seltos.*brochure\.pdf/)

    // Should open in new tab
    await expect(brochureButton).toHaveAttribute('target', '_blank')
    await expect(brochureButton).toHaveAttribute('rel', /noopener/)
  })

  test('should have Download Brochure button on Sonet page', async ({ page }) => {
    await page.goto('/models/sonet')
    await page.waitForLoadState('networkidle')

    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible()
    await expect(brochureButton).toHaveAttribute('href', /kia\.com.*sonet.*brochure\.pdf/)
  })

  test('should have Download Brochure button on Carens page', async ({ page }) => {
    await page.goto('/models/carens')
    await page.waitForLoadState('networkidle')

    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible()
    await expect(brochureButton).toHaveAttribute('href', /kia\.com.*carens.*brochure\.pdf/)
  })

  test('should have Download Brochure button on EV6 page', async ({ page }) => {
    await page.goto('/models/ev6')
    await page.waitForLoadState('networkidle')

    const brochureButton = page.getByRole('link', { name: /Download Brochure/i })
    await expect(brochureButton).toBeVisible()
    await expect(brochureButton).toHaveAttribute('href', /kia\.com.*ev6.*brochure\.pdf/)
  })
})
