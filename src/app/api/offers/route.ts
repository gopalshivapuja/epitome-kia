import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import {
  successResponse,
  handleApiError,
  buildPaginationMeta,
} from '@/lib/api-utils'
import { offerQuerySchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())

    // Validate query parameters
    const query = offerQuerySchema.parse(params)

    // Build where clause
    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (query.activeOnly) {
      where.isActive = true
      where.startAt = { lte: new Date() }
      where.OR = [{ endAt: null }, { endAt: { gte: new Date() } }]
    }

    if (query.carModelId) {
      where.carModelId = query.carModelId
    }

    if (query.variantId) {
      where.variantId = query.variantId
    }

    // Get total count
    const total = await prisma.offer.count({ where })

    // Get offers with pagination
    const skip = (query.page - 1) * query.limit

    const offers = await prisma.offer.findMany({
      where,
      include: {
        carModel: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
      skip,
      take: query.limit,
    })

    // Transform response
    const data = offers.map((offer) => ({
      id: offer.id,
      title: offer.title,
      slug: offer.slug,
      description: offer.description,
      startAt: offer.startAt,
      endAt: offer.endAt,
      isActive: offer.isActive,
      carModel: offer.carModel,
      variant: offer.variant,
      createdAt: offer.createdAt,
    }))

    return successResponse({
      offers: data,
      pagination: buildPaginationMeta(total, query.page, query.limit),
    })
  } catch (error) {
    return handleApiError(error)
  }
}
