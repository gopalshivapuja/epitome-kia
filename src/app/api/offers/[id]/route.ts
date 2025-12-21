import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

type RouteParams = {
  params: Promise<{ id: string }>
}

// Validation schema for offer updates
const updateOfferSchema = z.object({
  carModelId: z.string().uuid().optional().nullable(),
  variantId: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(200).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(2000).optional(),
  terms: z.string().max(5000).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
})

/**
 * GET /api/offers/[id]
 * Retrieve a single offer with full details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const offer = await prisma.offer.findUnique({
      where: { id },
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

    if (!offer) {
      return errorResponse('Offer not found', 404)
    }

    return successResponse(offer)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/offers/[id]
 * Update an offer (admin only)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    // Only admin and sales_manager can update offers
    if (!['admin', 'sales_manager'].includes(session.user.role as string)) {
      return errorResponse('Forbidden: Insufficient permissions', 403)
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const data = updateOfferSchema.parse(body)

    // Check if offer exists
    const existingOffer = await prisma.offer.findUnique({
      where: { id },
    })

    if (!existingOffer) {
      return errorResponse('Offer not found', 404)
    }

    // Check for slug uniqueness if slug is being changed
    if (data.slug && data.slug !== existingOffer.slug) {
      const slugExists = await prisma.offer.findFirst({
        where: { slug: data.slug, id: { not: id } },
      })
      if (slugExists) {
        return errorResponse('Slug already exists', 400)
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    }

    // Convert date strings to Date objects
    if (data.startAt) updateData.startAt = new Date(data.startAt)
    if (data.endAt) updateData.endAt = new Date(data.endAt)

    // Update the offer
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: updateData,
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

    return successResponse(updatedOffer)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/offers/[id]
 * Soft delete an offer (admin only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    // Only admin can delete offers
    if (session.user.role !== 'admin') {
      return errorResponse('Forbidden: Admin access required', 403)
    }

    const { id } = await params

    const offer = await prisma.offer.findUnique({
      where: { id },
    })

    if (!offer) {
      return errorResponse('Offer not found', 404)
    }

    // Soft delete
    await prisma.offer.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return successResponse({ message: 'Offer deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

