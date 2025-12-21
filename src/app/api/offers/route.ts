import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  successResponse,
  errorResponse,
  handleApiError,
  buildPaginationMeta,
} from '@/lib/api-utils'
import { offerQuerySchema } from '@/lib/validations'
import { z } from 'zod'

// Validation schema for creating offers
const createOfferSchema = z.object({
  carModelId: z.string().uuid().optional().nullable(),
  variantId: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(2000).optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
})

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

/**
 * POST /api/offers
 * Create a new offer (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    // Only admin and sales_manager can create offers
    if (!['admin', 'sales_manager'].includes(session.user.role as string)) {
      return errorResponse('Forbidden: Insufficient permissions', 403)
    }

    const body = await request.json()
    const data = createOfferSchema.parse(body)

    // Check for slug uniqueness
    const slugExists = await prisma.offer.findFirst({
      where: { slug: data.slug },
    })
    if (slugExists) {
      return errorResponse('Slug already exists', 400)
    }

    // Verify carModel exists if provided
    if (data.carModelId) {
      const model = await prisma.carModel.findUnique({ where: { id: data.carModelId } })
      if (!model) {
        return errorResponse('Car model not found', 400)
      }
    }

    // Verify variant exists if provided
    if (data.variantId) {
      const variant = await prisma.variant.findUnique({ where: { id: data.variantId } })
      if (!variant) {
        return errorResponse('Variant not found', 400)
      }
    }

    // Create the offer
    const offer = await prisma.offer.create({
      data: {
        carModelId: data.carModelId || null,
        variantId: data.variantId || null,
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        startAt: new Date(data.startAt),
        endAt: data.endAt ? new Date(data.endAt) : null,
        isActive: data.isActive,
      },
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
    })

    return successResponse(offer, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
