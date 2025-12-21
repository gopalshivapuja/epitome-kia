import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import {
  successResponse,
  handleApiError,
  buildPaginationMeta,
} from '@/lib/api-utils'
import { modelQuerySchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())

    // Validate query parameters
    const query = modelQuerySchema.parse(params)

    // Build where clause
    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive
    } else {
      where.isActive = true // Default to active only
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }

    if (query.year) {
      where.modelYear = query.year
    }

    // Get total count
    const total = await prisma.carModel.count({ where })

    // Get models with pagination
    const skip = (query.page - 1) * query.limit

    const models = await prisma.carModel.findMany({
      where,
      include: {
        variants: {
          where: { isActive: true, deletedAt: null },
          orderBy: { basePrice: 'asc' },
          take: 1, // Just get the base variant for listing
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
          select: { variants: true, offers: true },
        },
      },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip,
      take: query.limit,
    })

    // Transform response
    const data = models.map((model) => ({
      id: model.id,
      name: model.name,
      slug: model.slug,
      modelYear: model.modelYear,
      description: model.description,
      isActive: model.isActive,
      startingPrice: model.variants[0]?.basePrice
        ? Number(model.variants[0].basePrice)
        : null,
      hasActiveOffers: model.offers.length > 0,
      variantCount: model._count.variants,
      offerCount: model._count.offers,
      createdAt: model.createdAt,
    }))

    return successResponse({
      models: data,
      pagination: buildPaginationMeta(total, query.page, query.limit),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
