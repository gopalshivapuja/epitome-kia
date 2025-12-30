import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Newsletter schema (same as in the route)
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

describe('Newsletter Validation', () => {
  it('should accept valid email', () => {
    const result = newsletterSchema.safeParse({ email: 'test@example.com' })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email format', () => {
    const result = newsletterSchema.safeParse({ email: 'invalid-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address')
    }
  })

  it('should reject empty email', () => {
    const result = newsletterSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
  })

  it('should reject missing email', () => {
    const result = newsletterSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('should accept various valid email formats', () => {
    const validEmails = [
      'user@domain.com',
      'user.name@domain.com',
      'user+tag@domain.co.in',
      'user123@subdomain.domain.org',
    ]

    validEmails.forEach((email) => {
      const result = newsletterSchema.safeParse({ email })
      expect(result.success).toBe(true)
    })
  })

  it('should reject various invalid email formats', () => {
    const invalidEmails = [
      'notanemail',
      '@nodomain.com',
      'no@',
      'spaces in@email.com',
      'double@@domain.com',
    ]

    invalidEmails.forEach((email) => {
      const result = newsletterSchema.safeParse({ email })
      expect(result.success).toBe(false)
    })
  })
})
