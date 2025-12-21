import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const model = await prisma.carModel.findFirst({
      where: {
        slug,
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

    if (!model) {
      return errorResponse('Model not found', 404)
    }

    // Group specifications by category for better organization
    const variantsWithGroupedSpecs = model.variants.map((variant) => {
      const specsByCategory: Record<string, Array<{
        key: string
        value: string
        unit: string | null
      }>> = {}

      variant.specifications.forEach((spec) => {
        // Derive category from spec key
        let category = 'General'
        if (['engine', 'motor', 'power', 'torque', 'transmission', 'fuel_type'].includes(spec.specKey)) {
          category = 'Engine & Performance'
        } else if (['mileage', 'range', 'battery', 'charging_time', '0_to_100'].includes(spec.specKey)) {
          category = 'Efficiency'
        } else if (['seating_capacity', 'boot_space', 'sunroof', 'display'].includes(spec.specKey)) {
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

    // Transform response
    const data = {
      id: model.id,
      name: model.name,
      slug: model.slug,
      modelYear: model.modelYear,
      description: model.description,
      isActive: model.isActive,
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
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }

    return successResponse(data)
  } catch (error) {
    return handleApiError(error)
  }
}
