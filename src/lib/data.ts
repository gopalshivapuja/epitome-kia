import { prisma } from './db'
import { unstable_cache } from 'next/cache'

// Cache tags for revalidation
export const CACHE_TAGS = {
  models: 'models',
  offers: 'offers',
  locations: 'locations',
} as const

// Type for model list item
export type ModelListItem = {
  id: string
  name: string
  slug: string
  modelYear: number
  description: string | null
  startingPrice: number | null
  hasActiveOffers: boolean
  variantCount: number
}

// Get all active car models with basic info
export const getModels = unstable_cache(
  async (): Promise<ModelListItem[]> => {
    try {
      const models = await prisma.carModel.findMany({
        where: {
          isActive: true,
          deletedAt: null,
        },
        include: {
          variants: {
            where: { isActive: true, deletedAt: null },
            orderBy: { basePrice: 'asc' },
            take: 1,
          },
          offers: {
            where: {
              isActive: true,
              deletedAt: null,
              startAt: { lte: new Date() },
              OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
            },
            take: 1,
          },
          _count: {
            select: { variants: true },
          },
        },
        orderBy: { name: 'asc' },
      })

      return models.map((model) => ({
        id: model.id,
        name: model.name,
        slug: model.slug,
        modelYear: model.modelYear,
        description: model.description,
        startingPrice: model.variants[0]?.basePrice
          ? Number(model.variants[0].basePrice)
          : null,
        hasActiveOffers: model.offers.length > 0,
        variantCount: model._count.variants,
      }))
    } catch (error) {
      console.error('Error fetching models:', error)
      return []
    }
  },
  ['models-list'],
  { tags: [CACHE_TAGS.models], revalidate: 3600 }
)

// Get featured models for homepage
export const getFeaturedModels = unstable_cache(
  async (limit = 3) => {
    try {
      const models = await prisma.carModel.findMany({
        where: {
          isActive: true,
          deletedAt: null,
        },
        include: {
          variants: {
            where: { isActive: true, deletedAt: null },
            orderBy: { basePrice: 'asc' },
            take: 1,
          },
          offers: {
            where: {
              isActive: true,
              deletedAt: null,
              startAt: { lte: new Date() },
              OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
            },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      return models.map((model) => ({
        id: model.id,
        name: model.name,
        slug: model.slug,
        modelYear: model.modelYear,
        description: model.description,
        startingPrice: model.variants[0]?.basePrice
          ? Number(model.variants[0].basePrice)
          : null,
        hasActiveOffers: model.offers.length > 0,
        offerTitle: model.offers[0]?.title || null,
      }))
    } catch (error) {
      console.error('Error fetching featured models:', error)
      return []
    }
  },
  ['featured-models'],
  { tags: [CACHE_TAGS.models], revalidate: 3600 }
)

// Get single model by slug with full details
export const getModelBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const model = await prisma.carModel.findFirst({
        where: {
          slug,
          isActive: true,
          deletedAt: null,
        },
        include: {
          variants: {
            where: { isActive: true, deletedAt: null },
            orderBy: { basePrice: 'asc' },
            include: {
              specifications: {
                where: { deletedAt: null },
                orderBy: { specKey: 'asc' },
              },
            },
          },
          offers: {
            where: {
              isActive: true,
              deletedAt: null,
              startAt: { lte: new Date() },
              OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (!model) return null

      // Group specifications by category
      const variantsWithGroupedSpecs = model.variants.map((variant) => {
        const specsByCategory: Record<
          string,
          Array<{ key: string; value: string; unit: string | null }>
        > = {}

        variant.specifications.forEach((spec) => {
          let category = 'General'
          if (
            ['engine', 'motor', 'power', 'torque', 'transmission', 'fuel_type'].includes(
              spec.specKey
            )
          ) {
            category = 'Engine & Performance'
          } else if (
            ['mileage', 'range', 'battery', 'charging_time', '0_to_100'].includes(spec.specKey)
          ) {
            category = 'Efficiency'
          } else if (
            ['seating_capacity', 'boot_space', 'sunroof', 'display'].includes(spec.specKey)
          ) {
            category = 'Comfort & Features'
          } else if (['drive_type', 'suspension', 'brakes'].includes(spec.specKey)) {
            category = 'Driving'
          }

          if (!specsByCategory[category]) {
            specsByCategory[category] = []
          }
          specsByCategory[category].push({
            key: spec.specKey,
            value: spec.specValue,
            unit: spec.unit,
          })
        })

        return {
          id: variant.id,
          name: variant.name,
          slug: variant.slug,
          trimLevel: variant.trimLevel,
          basePrice: variant.basePrice ? Number(variant.basePrice) : null,
          specifications: specsByCategory,
        }
      })

      return {
        id: model.id,
        name: model.name,
        slug: model.slug,
        modelYear: model.modelYear,
        description: model.description,
        variants: variantsWithGroupedSpecs,
        offers: model.offers.map((offer) => ({
          id: offer.id,
          title: offer.title,
          slug: offer.slug,
          description: offer.description,
          startAt: offer.startAt,
          endAt: offer.endAt,
        })),
        startingPrice: model.variants[0]?.basePrice
          ? Number(model.variants[0].basePrice)
          : null,
      }
    } catch (error) {
      console.error('Error fetching model by slug:', error)
      return null
    }
  },
  ['model-detail'],
  { tags: [CACHE_TAGS.models], revalidate: 3600 }
)

// Get all active offers
export const getOffers = unstable_cache(
  async () => {
    try {
      const offers = await prisma.offer.findMany({
        where: {
          isActive: true,
          deletedAt: null,
          startAt: { lte: new Date() },
          OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
        },
        include: {
          carModel: {
            select: { id: true, name: true, slug: true },
          },
          variant: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return offers.map((offer) => ({
        id: offer.id,
        title: offer.title,
        slug: offer.slug,
        description: offer.description,
        startAt: offer.startAt,
        endAt: offer.endAt,
        carModel: offer.carModel,
        variant: offer.variant,
      }))
    } catch (error) {
      console.error('Error fetching offers:', error)
      return []
    }
  },
  ['offers-list'],
  { tags: [CACHE_TAGS.offers], revalidate: 3600 }
)

// Get single offer by slug
export const getOfferBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const offer = await prisma.offer.findFirst({
        where: {
          slug,
          isActive: true,
          deletedAt: null,
          startAt: { lte: new Date() },
          OR: [{ endAt: null }, { endAt: { gte: new Date() } }],
        },
        include: {
          carModel: {
            select: {
              id: true,
              name: true,
              slug: true,
              modelYear: true,
              description: true,
            },
          },
          variant: {
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
            },
          },
        },
      })

      if (!offer) return null

      return {
        id: offer.id,
        title: offer.title,
        slug: offer.slug,
        description: offer.description,
        startAt: offer.startAt,
        endAt: offer.endAt,
        carModel: offer.carModel,
        variant: offer.variant
          ? {
              ...offer.variant,
              basePrice: offer.variant.basePrice ? Number(offer.variant.basePrice) : null,
            }
          : null,
      }
    } catch (error) {
      console.error('Error fetching offer by slug:', error)
      return null
    }
  },
  ['offer-detail'],
  { tags: [CACHE_TAGS.offers], revalidate: 3600 }
)

// Get dealer locations
export const getDealerLocations = unstable_cache(
  async () => {
    try {
      const locations = await prisma.dealerLocation.findMany({
        where: {
          isActive: true,
          deletedAt: null,
        },
        orderBy: { name: 'asc' },
      })

      return locations.map((loc) => ({
        id: loc.id,
        name: loc.name,
        slug: loc.slug,
        address: `${loc.addressLine1}${loc.addressLine2 ? ', ' + loc.addressLine2 : ''}, ${loc.city}, ${loc.state} ${loc.postalCode}`,
        city: loc.city,
        phone: loc.phone,
        email: loc.email,
        hours: loc.hours,
      }))
    } catch (error) {
      console.error('Error fetching dealer locations:', error)
      return []
    }
  },
  ['dealer-locations'],
  { tags: [CACHE_TAGS.locations], revalidate: 86400 }
)
