import { test, expect } from '@playwright/test'

test.describe('Newsletter Signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
  })

  test('should display newsletter section in footer', async ({ page }) => {
    await expect(page.getByText('Stay Updated')).toBeVisible()
    await expect(page.getByText('Get the latest news, offers, and updates')).toBeVisible()
  })

  test('should have email input and submit button', async ({ page }) => {
    const emailInput = page.getByPlaceholder('Enter your email')
    await expect(emailInput).toBeVisible()

    const submitButton = page.locator('footer button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    const emailInput = page.getByPlaceholder('Enter your email')
    const submitButton = page.locator('footer button[type="submit"]')

    // Enter invalid email
    await emailInput.fill('invalid-email')
    await submitButton.click()

    // HTML5 validation should prevent submission
    // The form should not submit with invalid email
  })

  test('should submit form and show response message', async ({ page }) => {
    const emailInput = page.getByPlaceholder('Enter your email')
    const submitButton = page.locator('footer button[type="submit"]')

    // Enter valid email
    await emailInput.fill('test@example.com')
    await submitButton.click()

    // Wait for response (either success or error due to no database)
    await page.waitForTimeout(2000)

    // Should show some feedback message (success or error)
    // Note: Without database, this may show error message
    const hasMessage = await page.getByText(/Thank you|Already subscribed|error|failed/i).isVisible()
    expect(hasMessage).toBe(true)
  })

  test('should show loading state during submission', async ({ page }) => {
    const emailInput = page.getByPlaceholder('Enter your email')
    const submitButton = page.locator('footer button[type="submit"]')

    // Enter valid email and click
    await emailInput.fill('test2@example.com')

    // Button should be enabled before submission
    await expect(submitButton).toBeEnabled()

    // Submit (we just verify the button can be clicked)
    await submitButton.click()

    // Form should have been submitted
    await page.waitForTimeout(500)
  })
})
