import { describe, it, expect } from 'vitest'
import {
  leadSchema,
  testDriveSchema,
  serviceBookingSchema,
  emiCalculationSchema,
  modelQuerySchema,
} from '@/lib/validations'

describe('leadSchema', () => {
  it('should accept valid lead with email', () => {
    const data = {
      fullName: 'John Doe',
      email: 'john@example.com',
    }
    const result = leadSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should accept valid lead with phone', () => {
    const data = {
      fullName: 'John Doe',
      phone: '+919876543210',
    }
    const result = leadSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should accept valid lead with both email and phone', () => {
    const data = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+919876543210',
      preferredContact: 'email',
      source: 'website',
      notes: 'Interested in Seltos',
    }
    const result = leadSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should reject lead without email or phone', () => {
    const data = {
      fullName: 'John Doe',
    }
    const result = leadSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Either email or phone is required')
    }
  })

  it('should reject name shorter than 2 characters', () => {
    const data = {
      fullName: 'J',
      email: 'john@example.com',
    }
    const result = leadSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be at least 2 characters')
    }
  })

  it('should reject invalid email format', () => {
    const data = {
      fullName: 'John Doe',
      email: 'not-an-email',
    }
    const result = leadSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('should reject invalid phone number', () => {
    const data = {
      fullName: 'John Doe',
      phone: 'abc123',
    }
    const result = leadSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid phone number')
    }
  })

  it('should accept various valid phone formats', () => {
    const validPhones = [
      '+919876543210',
      '9876543210',
      '+91-98765-43210',
      '(91) 98765-43210',
      '080-4736-3737',
    ]

    for (const phone of validPhones) {
      const data = { fullName: 'John Doe', phone }
      const result = leadSchema.safeParse(data)
      expect(result.success).toBe(true)
    }
  })
})

describe('testDriveSchema', () => {
  const validUUID = '550e8400-e29b-41d4-a716-446655440000'
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  it('should accept valid test drive request', () => {
    const data = {
      fullName: 'John Doe',
      email: 'john@example.com',
      carModelId: validUUID,
      preferredDate: tomorrowStr,
      preferredTime: '10:00 AM',
    }
    const result = testDriveSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should reject past date', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const data = {
      fullName: 'John Doe',
      email: 'john@example.com',
      carModelId: validUUID,
      preferredDate: yesterdayStr,
    }
    const result = testDriveSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some(i => i.message === 'Date must be today or in the future')).toBe(true)
    }
  })

  it('should reject invalid carModelId', () => {
    const data = {
      fullName: 'John Doe',
      email: 'john@example.com',
      carModelId: 'not-a-uuid',
      preferredDate: tomorrowStr,
    }
    const result = testDriveSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid model ID')
    }
  })
})

describe('serviceBookingSchema', () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  it('should accept valid service booking', () => {
    const data = {
      fullName: 'John Doe',
      phone: '+919876543210',
      serviceDate: tomorrowStr,
      serviceType: 'regular_service',
    }
    const result = serviceBookingSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should validate service type enum', () => {
    const data = {
      fullName: 'John Doe',
      phone: '+919876543210',
      serviceDate: tomorrowStr,
      serviceType: 'invalid_service',
    }
    const result = serviceBookingSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  const validServiceTypes = [
    'regular_service',
    'repair',
    'inspection',
    'oil_change',
    'tire_service',
    'battery',
    'ac_service',
    'body_work',
    'other',
  ]

  it.each(validServiceTypes)('should accept service type: %s', (serviceType) => {
    const data = {
      fullName: 'John Doe',
      phone: '+919876543210',
      serviceDate: tomorrowStr,
      serviceType,
    }
    const result = serviceBookingSchema.safeParse(data)
    expect(result.success).toBe(true)
  })
})

describe('emiCalculationSchema', () => {
  it('should accept valid EMI calculation input', () => {
    const data = {
      principal: 1000000,
      downPayment: 200000,
      interestRate: 8.5,
      tenure: 60,
    }
    const result = emiCalculationSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('should reject negative principal', () => {
    const data = {
      principal: -1000000,
      downPayment: 200000,
      interestRate: 8.5,
      tenure: 60,
    }
    const result = emiCalculationSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Principal must be positive')
    }
  })

  it('should reject down payment greater than principal', () => {
    const data = {
      principal: 1000000,
      downPayment: 1500000,
      interestRate: 8.5,
      tenure: 60,
    }
    const result = emiCalculationSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Down payment must be less than principal')
    }
  })

  it('should reject interest rate above 50%', () => {
    const data = {
      principal: 1000000,
      downPayment: 200000,
      interestRate: 55,
      tenure: 60,
    }
    const result = emiCalculationSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should reject tenure above 84 months', () => {
    const data = {
      principal: 1000000,
      downPayment: 200000,
      interestRate: 8.5,
      tenure: 120,
    }
    const result = emiCalculationSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe('modelQuerySchema', () => {
  it('should accept valid query params with defaults', () => {
    const data = {}
    const result = modelQuerySchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(10)
      expect(result.data.sortBy).toBe('name')
      expect(result.data.sortOrder).toBe('asc')
    }
  })

  it('should coerce string numbers to numbers', () => {
    const data = {
      page: '2',
      limit: '20',
      year: '2024',
    }
    const result = modelQuerySchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(2)
      expect(result.data.limit).toBe(20)
      expect(result.data.year).toBe(2024)
    }
  })

  it('should reject limit above 100', () => {
    const data = { limit: 150 }
    const result = modelQuerySchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('should transform isActive string to boolean', () => {
    const data = { isActive: 'true' }
    const result = modelQuerySchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isActive).toBe(true)
    }
  })
})
