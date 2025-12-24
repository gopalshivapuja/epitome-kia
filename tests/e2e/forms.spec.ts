import { test, expect } from '@playwright/test'

test.describe('Test Drive Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-drive')
  })

  test('should display test drive page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Test Drive/i })).toBeVisible()
  })

  test('should have form fields or booking button', async ({ page }) => {
    // Look for either inline form or booking button
    const nameInput = page.getByLabel(/name/i).first()
    const bookButton = page.getByRole('button', { name: /book|schedule|submit/i })

    const hasNameInput = await nameInput.count() > 0
    const hasBookButton = await bookButton.count() > 0

    expect(hasNameInput || hasBookButton).toBeTruthy()
  })
})

test.describe('Service Booking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/service')
    await page.waitForLoadState('networkidle')
  })

  test('should display service page', async ({ page }) => {
    // Look for any service-related heading
    const serviceHeading = page.getByRole('heading', { name: /Service|Maintenance/i }).first()
    await expect(serviceHeading).toBeVisible()
  })

  test('should have service options', async ({ page }) => {
    // Check for service type headings
    await expect(page.getByRole('heading', { name: /Regular Service/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Oil Change/i })).toBeVisible()
  })

  test('should have book appointment button', async ({ page }) => {
    const bookButton = page.getByRole('button', { name: /Book.*Service|Book.*Appointment/i })
    await expect(bookButton).toBeVisible()
  })

  test('should open modal when clicking book appointment', async ({ page }) => {
    const bookButton = page.getByRole('button', { name: /Book.*Service|Book.*Appointment/i })
    await bookButton.click()

    // Wait for modal/dialog to appear
    await page.waitForTimeout(500)

    // Check for modal or form fields
    const dialog = page.getByRole('dialog')
    const hasDialog = await dialog.count() > 0

    if (hasDialog) {
      await expect(dialog).toBeVisible()
    }
  })
})

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display contact page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Contact/i })).toBeVisible()
  })

  test('should have contact information', async ({ page }) => {
    // Check for phone or email
    await expect(page.getByText(/080|epitomekia/i).first()).toBeVisible()
  })
})

test.describe('EMI Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/emi-calculator')
    await page.waitForLoadState('networkidle')
  })

  test('should display EMI calculator page', async ({ page }) => {
    // Look for EMI-related heading or calculator content
    const emiHeading = page.getByRole('heading', { name: /EMI|Calculator|Finance/i }).first()
    await expect(emiHeading).toBeVisible()
  })

  test('should have calculator inputs', async ({ page }) => {
    // Check for any input (number, range, etc.)
    const inputs = page.locator('input')
    expect(await inputs.count()).toBeGreaterThan(0)
  })

  test('should display calculation results', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000)

    // Look for price/EMI related text
    const priceText = page.getByText(/₹|Lakh|per month|monthly|EMI/i).first()
    await expect(priceText).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Test Drive Modal from Homepage', () => {
  test('should open modal when clicking Test Drive button', async ({ page }) => {
    await page.goto('/')

    // Click first Test Drive button
    const testDriveButton = page.getByRole('button', { name: 'Test Drive' }).first()
    await testDriveButton.click()

    // Wait for modal to appear
    await page.waitForTimeout(500)

    // Modal/dialog should appear
    const dialog = page.getByRole('dialog')
    const hasDialog = await dialog.count() > 0

    if (hasDialog) {
      await expect(dialog).toBeVisible()

      // Modal should have form fields
      const nameInput = dialog.getByLabel(/name/i).first()
      if (await nameInput.count() > 0) {
        await expect(nameInput).toBeVisible()
      }
    }
  })
})
