import { test, expect } from '@playwright/test'

test.describe('FAQ Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/faq')
    await page.waitForLoadState('networkidle')
  })

  test('should display FAQ page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible()
    await expect(page.getByText('Find answers to common questions')).toBeVisible()
  })

  test('should display FAQ accordion items', async ({ page }) => {
    // Check that FAQ items are present
    const accordionItems = page.locator('[data-state]')
    expect(await accordionItems.count()).toBeGreaterThan(0)

    // First question should be visible
    await expect(page.getByText('How can I book a test drive?')).toBeVisible()
  })

  test('should expand/collapse FAQ accordion on click', async ({ page }) => {
    // Find the first accordion trigger
    const firstTrigger = page.locator('button').filter({ hasText: 'How can I book a test drive?' })
    await expect(firstTrigger).toBeVisible()

    // Click to expand
    await firstTrigger.click()
    await page.waitForTimeout(300)

    // Answer should be visible
    await expect(page.getByText(/You can book a test drive through our website/i)).toBeVisible()

    // Click again to collapse
    await firstTrigger.click()
    await page.waitForTimeout(300)
  })

  test('should have contact section with call and email buttons', async ({ page }) => {
    // Scroll to contact section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    await expect(page.getByText('Still have questions?')).toBeVisible()
    await expect(page.getByRole('link', { name: /Call Us/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Email Us/i })).toBeVisible()
  })

  test('should have quick links section', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Book Test Drive' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'EMI Calculator' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Service Booking' })).toBeVisible()
  })

  test('should have breadcrumb navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByText('FAQ')).toBeVisible()
  })
})
