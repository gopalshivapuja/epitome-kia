// Karnataka-specific pricing rules for on-road price calculation
// Based on Karnataka Motor Vehicles Taxation Act

export const KARNATAKA_PRICING = {
  // Road Tax (Life Time Tax - LTT) - Karnataka RTO
  // Rates vary by vehicle price bracket
  roadTax: {
    below5L: 0.13,      // 13% for vehicles below ₹5 lakh
    below10L: 0.14,     // 14% for ₹5-10 lakh
    below15L: 0.17,     // 17% for ₹10-15 lakh
    below20L: 0.18,     // 18% for ₹15-20 lakh
    above20L: 0.20,     // 20% for above ₹20 lakh
  },

  // Fixed RTO charges
  registration: {
    basic: 600,              // Basic registration fee
    smartCard: 200,          // Smart card fee
    hypothecation: 1500,     // If financed (HP endorsement)
    hsrp: 600,               // High Security Registration Plate (car)
    fastag: 500,             // FASTag (mandatory)
  },

  // Insurance rates (approximate first-year premiums as % of ex-showroom)
  insurance: {
    comprehensive: {
      below10L: 0.032,       // ~3.2% for vehicles below ₹10L
      below20L: 0.028,       // ~2.8% for ₹10-20L
      above20L: 0.025,       // ~2.5% for above ₹20L (higher value, lower %)
    },
    thirdParty: {
      petrol: 2094,          // Fixed TP premium for petrol cars (>1500cc)
      diesel: 2094,          // Fixed TP premium for diesel cars (>1500cc)
      ev: 1650,              // Lower for EVs
    },
    // Personal Accident cover (mandatory)
    paCover: 750,
  },

  // Other charges
  handling: 3000,            // Dealer handling/logistics charges
  tempRegistration: 150,     // Temporary registration

  // TCS (Tax Collected at Source) - 1% on vehicles above ₹10L
  tcsThreshold: 1000000,
  tcsRate: 0.01,
}

export interface PricingOptions {
  includeInsurance?: boolean
  insuranceType?: 'comprehensive' | 'thirdParty'
  fuelType?: 'petrol' | 'diesel' | 'ev'
  isFinanced?: boolean
  includeAccessories?: number
  includeTCS?: boolean
}

export interface PriceBreakdown {
  exShowroom: number
  roadTax: number
  registration: number
  insurance: number
  fastag: number
  hsrp: number
  handling: number
  hypothecation: number
  accessories: number
  tcs: number
}

export interface PricingResult {
  breakdown: PriceBreakdown
  total: number
  savings?: number
}

function getRoadTaxRate(price: number): number {
  if (price < 500000) return KARNATAKA_PRICING.roadTax.below5L
  if (price < 1000000) return KARNATAKA_PRICING.roadTax.below10L
  if (price < 1500000) return KARNATAKA_PRICING.roadTax.below15L
  if (price < 2000000) return KARNATAKA_PRICING.roadTax.below20L
  return KARNATAKA_PRICING.roadTax.above20L
}

function getInsuranceRate(price: number): number {
  if (price < 1000000) return KARNATAKA_PRICING.insurance.comprehensive.below10L
  if (price < 2000000) return KARNATAKA_PRICING.insurance.comprehensive.below20L
  return KARNATAKA_PRICING.insurance.comprehensive.above20L
}

function getTPPremium(fuelType: 'petrol' | 'diesel' | 'ev'): number {
  return KARNATAKA_PRICING.insurance.thirdParty[fuelType]
}

export function calculateOnRoadPrice(
  exShowroomPrice: number,
  options: PricingOptions = {}
): PricingResult {
  const {
    includeInsurance = true,
    insuranceType = 'comprehensive',
    fuelType = 'petrol',
    isFinanced = false,
    includeAccessories = 0,
    includeTCS = true,
  } = options

  // Road Tax calculation
  const roadTaxRate = getRoadTaxRate(exShowroomPrice)
  const roadTax = Math.round(exShowroomPrice * roadTaxRate)

  // Registration charges
  const registration = KARNATAKA_PRICING.registration.basic +
                       KARNATAKA_PRICING.registration.smartCard +
                       KARNATAKA_PRICING.tempRegistration

  const hsrp = KARNATAKA_PRICING.registration.hsrp
  const fastag = KARNATAKA_PRICING.registration.fastag
  const hypothecation = isFinanced ? KARNATAKA_PRICING.registration.hypothecation : 0

  // Insurance calculation
  let insurance = 0
  if (includeInsurance) {
    if (insuranceType === 'comprehensive') {
      const comprehensiveRate = getInsuranceRate(exShowroomPrice)
      const odPremium = Math.round(exShowroomPrice * comprehensiveRate)
      const tpPremium = getTPPremium(fuelType)
      insurance = odPremium + tpPremium + KARNATAKA_PRICING.insurance.paCover
    } else {
      insurance = getTPPremium(fuelType) + KARNATAKA_PRICING.insurance.paCover
    }
  }

  // Handling charges
  const handling = KARNATAKA_PRICING.handling

  // TCS (only applicable on vehicles > ₹10L)
  let tcs = 0
  if (includeTCS && exShowroomPrice > KARNATAKA_PRICING.tcsThreshold) {
    tcs = Math.round(exShowroomPrice * KARNATAKA_PRICING.tcsRate)
  }

  const breakdown: PriceBreakdown = {
    exShowroom: exShowroomPrice,
    roadTax,
    registration,
    insurance,
    fastag,
    hsrp,
    handling,
    hypothecation,
    accessories: includeAccessories,
    tcs,
  }

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  return { breakdown, total }
}

// Format breakdown for display
export function formatPriceBreakdownLabels(): Record<keyof PriceBreakdown, string> {
  return {
    exShowroom: 'Ex-Showroom Price',
    roadTax: 'Road Tax (Karnataka)',
    registration: 'RTO Registration',
    insurance: 'Insurance (1st Year)',
    fastag: 'FASTag',
    hsrp: 'HSRP (Number Plate)',
    handling: 'Handling Charges',
    hypothecation: 'Hypothecation (Loan)',
    accessories: 'Accessories',
    tcs: 'TCS (1%)',
  }
}

// Get tax percentage for display
export function getRoadTaxPercentage(price: number): string {
  const rate = getRoadTaxRate(price)
  return `${(rate * 100).toFixed(0)}%`
}
