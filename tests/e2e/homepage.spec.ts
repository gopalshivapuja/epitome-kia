import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the header with logo and navigation', async ({ page, viewport }) => {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Check header exists
    const header = page.locator('header, [role="banner"]')
    await expect(header.first()).toBeVisible()

    // Check logo is visible (link to home with EPITOME text)
    const logoLink = page.getByRole('link', { name: /EPITOME/i }).first()
    await expect(logoLink).toBeVisible()

    // On desktop, check navigation links in header
    if (viewport && viewport.width >= 768) {
      const nav = page.locator('nav, [role="navigation"]').first()
      await expect(nav).toBeVisible()

      // Navigation should contain model links
      await expect(nav.getByRole('link', { name: 'Seltos' })).toBeVisible()
      await expect(nav.getByRole('link', { name: 'Sonet' })).toBeVisible()
    }
  })

  test('should display car sections', async ({ page }) => {
    // Check Seltos section (updated hero)
    await expect(page.getByRole('heading', { name: 'The All-New Seltos' })).toBeVisible()
    await expect(page.getByText('Badass. Forever.')).toBeVisible()

    // Check for Explore and Test Drive buttons (updated from Order Now)
    const exploreButtons = page.getByRole('link', { name: 'Explore' })
    expect(await exploreButtons.count()).toBeGreaterThan(0)

    const testDriveButtons = page.getByRole('button', { name: 'Test Drive' })
    expect(await testDriveButtons.count()).toBeGreaterThan(0)
  })

  test('should have working navigation links', async ({ page }) => {
    // Click on Seltos in nav
    await page.getByRole('link', { name: 'Seltos' }).first().click()
    await expect(page).toHaveURL(/\/models\/seltos/)
  })

  test('should display footer with contact information', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Check footer content
    await expect(page.getByText('Authorized sales, service & spares dealer')).toBeVisible()
    await expect(page.getByRole('link', { name: /Privacy Policy/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Terms of Service/i })).toBeVisible()
  })

  test('should have WhatsApp chat button', async ({ page }) => {
    const whatsappLink = page.getByRole('link', { name: /WhatsApp/i })
    await expect(whatsappLink).toBeVisible()
    await expect(whatsappLink).toHaveAttribute('href', /wa\.me/)
  })
})

test.describe('Homepage - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should display mobile menu button', async ({ page }) => {
    await page.goto('/')

    // Mobile menu button should be visible
    const menuButton = page.getByRole('button', { name: /menu/i })
    await expect(menuButton).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/')

    // Content should still be visible on mobile
    await expect(page.getByRole('heading', { name: 'New Seltos' })).toBeVisible()

    // Car image should be visible
    const carImage = page.locator('img[alt*="Seltos"]').first()
    await expect(carImage).toBeVisible()
  })
})
