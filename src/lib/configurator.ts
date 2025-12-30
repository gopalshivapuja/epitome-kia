// Vehicle configurator data and utilities

export interface ColorOption {
  code: string
  name: string
  hex: string
  type: 'solid' | 'metallic' | 'dual_tone'
  premium?: number // Additional cost
}

export interface VariantOption {
  id: string
  name: string
  engine: string
  transmission: string
  price: number
  features: string[]
}

export interface AccessoryOption {
  id: string
  name: string
  description: string
  price: number
  category: 'exterior' | 'interior' | 'protection' | 'technology'
  imageUrl?: string
  compatibleModels: string[]
}

export interface ModelConfig {
  slug: string
  name: string
  tagline: string
  startingPrice: number
  colors: ColorOption[]
  variants: VariantOption[]
}

// Color options for each model
const COMMON_COLORS: ColorOption[] = [
  { code: 'IWP', name: 'Glacier White Pearl', hex: '#F5F5F5', type: 'solid' },
  { code: 'ABP', name: 'Aurora Black Pearl', hex: '#1a1a1a', type: 'metallic' },
  { code: 'C4S', name: 'Gravity Grey', hex: '#5a5a5a', type: 'metallic' },
  { code: 'KLG', name: 'Pewter Olive', hex: '#5a6a4a', type: 'metallic' },
]

// Model configurations
export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  seltos: {
    slug: 'seltos',
    name: 'Seltos',
    tagline: 'The Badass SUV',
    startingPrice: 1099000,
    colors: [
      ...COMMON_COLORS,
      { code: 'IRR', name: 'Intense Red', hex: '#8B0000', type: 'metallic' },
      { code: 'SCB', name: 'Imperial Blue', hex: '#1a3a5c', type: 'metallic' },
      { code: 'DT1', name: 'Dual Tone White + Black', hex: '#F5F5F5', type: 'dual_tone', premium: 15000 },
      { code: 'DT2', name: 'Dual Tone Red + Black', hex: '#8B0000', type: 'dual_tone', premium: 15000 },
    ],
    variants: [
      {
        id: 'seltos-hte',
        name: 'HTE',
        engine: '1.5L Petrol',
        transmission: '6MT',
        price: 1099000,
        features: ['LED DRLs', 'Dual airbags', 'ABS with EBD', 'Rear AC vents'],
      },
      {
        id: 'seltos-htk',
        name: 'HTK',
        engine: '1.5L Petrol',
        transmission: '6MT',
        price: 1199000,
        features: ['8" touchscreen', 'Wireless Android Auto/Apple CarPlay', 'Rear camera', 'All HTE features'],
      },
      {
        id: 'seltos-htk-plus',
        name: 'HTK+',
        engine: '1.5L Petrol',
        transmission: 'IVT',
        price: 1399000,
        features: ['10.25" touchscreen', 'Sunroof', 'Wireless charger', 'All HTK features'],
      },
      {
        id: 'seltos-htx',
        name: 'HTX',
        engine: '1.5L Diesel',
        transmission: '6MT',
        price: 1599000,
        features: ['Ventilated front seats', 'Connected car tech', 'BOSE audio', 'All HTK+ features'],
      },
      {
        id: 'seltos-gtx-plus',
        name: 'GTX+',
        engine: '1.4L Turbo Petrol',
        transmission: '7DCT',
        price: 1899000,
        features: ['Panoramic sunroof', '360° camera', 'ADAS Level 2', 'All HTX features'],
      },
    ],
  },
  sonet: {
    slug: 'sonet',
    name: 'Sonet',
    tagline: 'The Wild Compact SUV',
    startingPrice: 799000,
    colors: [
      ...COMMON_COLORS,
      { code: 'IRR', name: 'Intense Red', hex: '#8B0000', type: 'metallic' },
      { code: 'GBF', name: 'Galaxy Blue', hex: '#0a2647', type: 'metallic' },
      { code: 'DT1', name: 'Dual Tone Orange + Black', hex: '#FF6B00', type: 'dual_tone', premium: 12000 },
    ],
    variants: [
      {
        id: 'sonet-hte',
        name: 'HTE',
        engine: '1.2L Petrol',
        transmission: '5MT',
        price: 799000,
        features: ['LED DRLs', 'Dual airbags', 'ABS with EBD'],
      },
      {
        id: 'sonet-htk',
        name: 'HTK',
        engine: '1.2L Petrol',
        transmission: '5MT',
        price: 899000,
        features: ['8" touchscreen', 'Wireless Android Auto/Apple CarPlay', 'All HTE features'],
      },
      {
        id: 'sonet-htk-plus',
        name: 'HTK+',
        engine: '1.0L Turbo',
        transmission: '6iMT',
        price: 1099000,
        features: ['Sunroof', 'Wireless charger', 'Rear camera', 'All HTK features'],
      },
      {
        id: 'sonet-htx-plus',
        name: 'HTX+',
        engine: '1.5L Diesel',
        transmission: '6AT',
        price: 1399000,
        features: ['Ventilated seats', 'BOSE audio', 'Connected car tech', 'All HTK+ features'],
      },
      {
        id: 'sonet-gtx-plus',
        name: 'GTX+',
        engine: '1.0L Turbo',
        transmission: '7DCT',
        price: 1599000,
        features: ['360° camera', 'ADAS', 'Digital cluster', 'All HTX+ features'],
      },
    ],
  },
  carens: {
    slug: 'carens',
    name: 'Carens',
    tagline: 'The Stylish Family Mover',
    startingPrice: 1099000,
    colors: [
      ...COMMON_COLORS,
      { code: 'SPG', name: 'Sparkling Silver', hex: '#C0C0C0', type: 'metallic' },
      { code: 'IRR', name: 'Intense Red', hex: '#8B0000', type: 'metallic' },
      { code: 'SCB', name: 'Imperial Blue', hex: '#1a3a5c', type: 'metallic' },
    ],
    variants: [
      {
        id: 'carens-premium',
        name: 'Premium',
        engine: '1.5L Petrol',
        transmission: '6MT',
        price: 1099000,
        features: ['LED headlamps', 'Dual airbags', '7 seats', 'Rear AC vents'],
      },
      {
        id: 'carens-prestige',
        name: 'Prestige',
        engine: '1.5L Petrol',
        transmission: 'IVT',
        price: 1399000,
        features: ['10.25" touchscreen', 'Sunroof', 'Wireless charger', '6 airbags'],
      },
      {
        id: 'carens-prestige-plus',
        name: 'Prestige Plus',
        engine: '1.5L Diesel',
        transmission: '6AT',
        price: 1699000,
        features: ['Ventilated seats', 'BOSE audio', '64-color ambient lighting', 'All Prestige features'],
      },
      {
        id: 'carens-luxury',
        name: 'Luxury',
        engine: '1.4L Turbo',
        transmission: '7DCT',
        price: 1899000,
        features: ['Powered driver seat', 'One-touch tumble seats', 'All Prestige Plus features'],
      },
      {
        id: 'carens-luxury-plus',
        name: 'Luxury Plus',
        engine: '1.5L Diesel',
        transmission: '6AT',
        price: 2099000,
        features: ['Smart pure air purifier', 'Second row captain seats', 'All Luxury features'],
      },
    ],
  },
}

// Accessories data
export const ACCESSORIES: AccessoryOption[] = [
  // Exterior
  {
    id: 'acc-roof-rails',
    name: 'Roof Rails',
    description: 'Sturdy aluminum roof rails for luggage carriers',
    price: 8500,
    category: 'exterior',
    compatibleModels: ['seltos', 'sonet', 'carens'],
  },
  {
    id: 'acc-side-steps',
    name: 'Side Steps',
    description: 'Premium aluminum side steps for easy entry',
    price: 12000,
    category: 'exterior',
    compatibleModels: ['seltos', 'carens', 'carnival'],
  },
  {
    id: 'acc-mud-flaps',
    name: 'Mud Flaps',
    description: 'Durable mud flaps for all-weather protection',
    price: 1500,
    category: 'exterior',
    compatibleModels: ['seltos', 'sonet', 'carens', 'carnival'],
  },
  {
    id: 'acc-door-visor',
    name: 'Door Visor Set',
    description: 'Smoke-tinted door visors for rain protection',
    price: 2500,
    category: 'exterior',
    compatibleModels: ['seltos', 'sonet', 'carens', 'carnival'],
  },
  // Interior
  {
    id: 'acc-floor-mats',
    name: '3D Floor Mats',
    description: 'Premium 3D floor mats with anti-skid backing',
    price: 3500,
    category: 'interior',
    compatibleModels: ['seltos', 'sonet', 'carens', 'carnival'],
  },
  {
    id: 'acc-seat-covers',
    name: 'Premium Seat Covers',
    description: 'Custom-fit leatherette seat covers',
    price: 12000,
    category: 'interior',
    compatibleModels: ['seltos', 'sonet', 'carens'],
  },
  {
    id: 'acc-boot-organizer',
    name: 'Boot Organizer',
    description: 'Collapsible boot organizer with multiple compartments',
    price: 2000,
    category: 'interior',
    compatibleModels: ['seltos', 'sonet', 'carens', 'carnival'],
  },
  // Protection
  {
    id: 'acc-body-cover',
    name: 'Body Cover',
    description: 'Water-resistant car body cover with mirror pockets',
    price: 3000,
    category: 'protection',
    compatibleModels: ['seltos', 'sonet', 'carens', 'carnival'],
  },
  {
    id: 'acc-bumper-protector',
    name: 'Bumper Protector',
    description: 'Front and rear bumper protector set',
    price: 4500,
    category: 'protection',
    compatibleModels: ['seltos', 'sonet', 'carens'],
  },
  {
    id: 'acc-paint-protection',
    name: 'Paint Protection Film',
    description: 'Transparent PPF for high-impact zones',
    price: 15000,
    category: 'protection',
    compatibleModels: ['seltos', 'sonet', 'carens', 'carnival', 'ev6', 'ev9'],
  },
  // Technology
  {
    id: 'acc-dash-cam',
    name: 'Dash Camera',
    description: 'HD front and rear dash camera with parking mode',
    price: 8000,
    category: 'technology',
    compatibleModels: ['seltos', 'sonet', 'carens', 'carnival', 'ev6', 'ev9'],
  },
  {
    id: 'acc-tpms',
    name: 'TPMS Sensors',
    description: 'Tire pressure monitoring system',
    price: 5000,
    category: 'technology',
    compatibleModels: ['seltos', 'sonet', 'carens'],
  },
]

// Helper functions
export function getAccessoriesForModel(modelSlug: string): AccessoryOption[] {
  return ACCESSORIES.filter((acc) => acc.compatibleModels.includes(modelSlug))
}

export function getModelConfig(modelSlug: string): ModelConfig | undefined {
  return MODEL_CONFIGS[modelSlug]
}

export function formatPrice(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`
  } else {
    return `₹${amount.toLocaleString('en-IN')}`
  }
}

export function generateShareCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export interface ConfigurationSummary {
  modelSlug: string
  modelName: string
  variant: VariantOption
  color: ColorOption
  accessories: AccessoryOption[]
  basePrice: number
  colorPremium: number
  accessoriesTotal: number
  totalPrice: number
}

export function calculateConfiguration(
  modelSlug: string,
  variantId: string,
  colorCode: string,
  accessoryIds: string[]
): ConfigurationSummary | null {
  const config = MODEL_CONFIGS[modelSlug]
  if (!config) return null

  const variant = config.variants.find((v) => v.id === variantId)
  if (!variant) return null

  const color = config.colors.find((c) => c.code === colorCode)
  if (!color) return null

  const accessories = accessoryIds
    .map((id) => ACCESSORIES.find((a) => a.id === id))
    .filter((a): a is AccessoryOption => a !== undefined)

  const colorPremium = color.premium || 0
  const accessoriesTotal = accessories.reduce((sum, acc) => sum + acc.price, 0)
  const totalPrice = variant.price + colorPremium + accessoriesTotal

  return {
    modelSlug,
    modelName: config.name,
    variant,
    color,
    accessories,
    basePrice: variant.price,
    colorPremium,
    accessoriesTotal,
    totalPrice,
  }
}
