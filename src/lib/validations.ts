import { z } from 'zod'

// Common validation patterns
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Base lead object (for extending)
const leadBaseSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(phoneRegex, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional(),
  source: z.string().max(50).optional(),
  notes: z.string().max(1000).optional(),
})

// Refinement for requiring either email or phone
const requireEmailOrPhone = <T extends { email?: string; phone?: string }>(
  schema: z.ZodType<T>
) =>
  schema.refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
  })

// Lead validation schema with refinement
export const leadSchema = requireEmailOrPhone(leadBaseSchema)

export type LeadInput = z.infer<typeof leadSchema>

// Test drive request validation
export const testDriveSchema = requireEmailOrPhone(
  leadBaseSchema.extend({
    carModelId: z.string().uuid('Invalid model ID'),
    variantId: z.string().uuid('Invalid variant ID').optional(),
    preferredDate: z.string().refine(
      (date) => {
        const parsed = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return parsed >= today
      },
      { message: 'Date must be today or in the future' }
    ),
    preferredTime: z.string().optional(),
    locationNotes: z.string().max(500).optional(),
  })
)

export type TestDriveInput = z.infer<typeof testDriveSchema>

// Service booking validation
export const serviceBookingSchema = requireEmailOrPhone(
  leadBaseSchema.extend({
    dealerLocationId: z.string().uuid('Invalid location ID').optional(),
    carModelId: z.string().uuid('Invalid model ID').optional(),
    variantId: z.string().uuid('Invalid variant ID').optional(),
    serviceDate: z.string().refine(
      (date) => {
        const parsed = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return parsed >= today
      },
      { message: 'Date must be today or in the future' }
    ),
    serviceTime: z.string().optional(),
    serviceType: z.enum([
      'regular_service',
      'repair',
      'inspection',
      'oil_change',
      'tire_service',
      'battery',
      'ac_service',
      'body_work',
      'other',
    ]),
  })
)

export type ServiceBookingInput = z.infer<typeof serviceBookingSchema>

// Pickup request validation
export const pickupRequestSchema = z.object({
  customerLeadId: z.string().uuid('Invalid customer ID'),
  dealerLocationId: z.string().uuid('Invalid location ID').optional(),
  pickupAddress: z.string().min(10, 'Please provide a complete address').max(500),
  pickupDate: z.string().refine(
    (date) => {
      const parsed = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return parsed >= today
    },
    { message: 'Date must be today or in the future' }
  ),
  pickupTime: z.string().optional(),
})

export type PickupRequestInput = z.infer<typeof pickupRequestSchema>

// Model query params validation
export const modelQuerySchema = z.object({
  search: z.string().optional(),
  year: z.coerce.number().int().min(1980).max(2100).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  isActive: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'modelYear', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export type ModelQueryParams = z.infer<typeof modelQuerySchema>

// Offer query params validation
export const offerQuerySchema = z.object({
  carModelId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional(),
  activeOnly: z.enum(['true', 'false']).transform((v) => v === 'true').default('true'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export type OfferQueryParams = z.infer<typeof offerQuerySchema>

// EMI calculation validation
export const emiCalculationSchema = z.object({
  principal: z.number().positive('Principal must be positive'),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
  interestRate: z.number().min(0).max(50, 'Interest rate must be between 0-50%'),
  tenure: z.number().int().min(1).max(84, 'Tenure must be between 1-84 months'),
}).refine(
  (data) => data.downPayment < data.principal,
  { message: 'Down payment must be less than principal', path: ['downPayment'] }
)

export type EMICalculationInput = z.infer<typeof emiCalculationSchema>
