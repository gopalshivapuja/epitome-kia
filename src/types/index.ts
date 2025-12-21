// Core entity types (matching Prisma schema)

export interface CarModel {
  id: string
  name: string
  slug: string
  modelYear: number
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  variants?: Variant[]
  offers?: Offer[]
}

export interface Variant {
  id: string
  carModelId: string
  name: string
  slug: string
  trimLevel: string | null
  basePrice: number | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  carModel?: CarModel
  specifications?: Specification[]
  offers?: Offer[]
}

export interface Specification {
  id: string
  variantId: string
  specKey: string
  specValue: string
  unit: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface Offer {
  id: string
  carModelId: string | null
  variantId: string | null
  title: string
  slug: string
  description: string | null
  startAt: Date
  endAt: Date | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  carModel?: CarModel
  variant?: Variant
}

export interface DealerLocation {
  id: string
  name: string
  slug: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string | null
  email: string | null
  latitude: number | null
  longitude: number | null
  hours: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface CustomerLead {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  preferredContact: string | null
  source: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface TestDriveRequest {
  id: string
  customerLeadId: string
  carModelId: string | null
  variantId: string | null
  preferredDate: Date
  preferredTime: string | null
  locationNotes: string | null
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  customerLead?: CustomerLead
  carModel?: CarModel
  variant?: Variant
}

export interface ServiceBooking {
  id: string
  customerLeadId: string
  dealerLocationId: string | null
  carModelId: string | null
  variantId: string | null
  serviceDate: Date
  serviceTime: string | null
  serviceType: string
  notes: string | null
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  customerLead?: CustomerLead
  dealerLocation?: DealerLocation
}

// Form types
export interface LeadFormData {
  fullName: string
  email?: string
  phone?: string
  preferredContact?: 'email' | 'phone' | 'whatsapp'
  source?: string
  notes?: string
}

export interface TestDriveFormData extends LeadFormData {
  carModelId: string
  variantId?: string
  preferredDate: string
  preferredTime?: string
  locationNotes?: string
}

export interface ServiceBookingFormData extends LeadFormData {
  dealerLocationId: string
  serviceDate: string
  serviceTime?: string
  serviceType: string
  notes?: string
}

// EMI Calculator types
export interface EMICalculation {
  principal: number
  downPayment: number
  loanAmount: number
  interestRate: number
  tenure: number // in months
  emi: number
  totalInterest: number
  totalPayment: number
}
