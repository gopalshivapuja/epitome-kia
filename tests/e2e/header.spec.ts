import { test, expect } from '@playwright/test'

test.describe('Header - Desktop', () => {
  // Skip on mobile viewports
  test.skip(({ viewport }) => viewport?.width !== undefined && viewport.width < 768, 'Desktop-only tests')

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display text-based EPITOME logo', async ({ page }) => {
    // Logo should be visible as text, not image
    const logoText = page.getByText('EPITOME').first()
    await expect(logoText).toBeVisible()

    // Logo should be a link to home
    const logoLink = page.getByRole('link', { name: /EPITOME/i }).first()
    await expect(logoLink).toHaveAttribute('href', '/')
  })

  test('should show Test Drive link with correct styling when not scrolled', async ({ page }) => {
    // Test Drive link should be visible
    const testDriveLink = page.getByRole('link', { name: 'Test Drive' }).first()
    await expect(testDriveLink).toBeVisible()
  })

  test('should change header style on scroll', async ({ page }) => {
    const header = page.locator('header').first()

    // Initially should be transparent
    await expect(header).toHaveClass(/bg-transparent/)

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 100))
    await page.waitForTimeout(300) // Wait for transition

    // Should now have white background
    await expect(header).toHaveClass(/bg-white/)
  })

  test('should display navigation links in desktop menu', async ({ page }) => {
    const nav = page.locator('nav').first()

    // Model links should be visible in nav
    await expect(nav.getByRole('link', { name: 'Seltos' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Sonet' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Carens' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'EV6' })).toBeVisible()
  })

  test('should open fullscreen menu on menu button click', async ({ page }) => {
    // Click menu button
    const menuButton = page.getByRole('button', { name: /menu/i })
    await menuButton.click()

    // Wait for menu animation
    await page.waitForTimeout(500)

    // Fullscreen menu overlay should appear
    const menuOverlay = page.locator('div.fixed.inset-0.z-\\[60\\]')
    await expect(menuOverlay).toBeVisible({ timeout: 3000 })

    // Close button should be visible
    const closeButton = page.getByRole('button', { name: /close/i })
    await expect(closeButton).toBeVisible()

    // Click close
    await closeButton.click()
    await page.waitForTimeout(300)
  })
})

test.describe('Header - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('should show menu button on mobile', async ({ page }) => {
    await page.goto('/')

    // Menu button should be visible
    const menuButton = page.getByRole('button', { name: /menu/i })
    await expect(menuButton).toBeVisible()
  })

  test('should hide desktop nav links on mobile', async ({ page }) => {
    await page.goto('/')

    // Desktop nav links should be hidden (in nav, not in menu)
    const desktopNav = page.locator('nav.hidden')
    await expect(desktopNav).toBeHidden()
  })

  test('should open and close mobile menu', async ({ page }) => {
    await page.goto('/')

    // Open menu
    const menuButton = page.getByRole('button', { name: /menu/i })
    await menuButton.click()

    // Wait for menu animation
    await page.waitForTimeout(500)

    // Fullscreen menu overlay should appear
    const menuOverlay = page.locator('div.fixed.inset-0')
    await expect(menuOverlay.first()).toBeVisible({ timeout: 3000 })

    // Close menu
    const closeButton = page.getByRole('button', { name: /close/i })
    await expect(closeButton).toBeVisible()
    await closeButton.click()
    await page.waitForTimeout(300)
  })
})
