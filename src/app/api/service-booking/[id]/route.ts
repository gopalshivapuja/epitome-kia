import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

type RouteParams = {
  params: Promise<{ id: string }>
}

// Validation schema for service booking status updates
const updateServiceBookingSchema = z.object({
  status: z.enum(['pending', 'scheduled', 'completed', 'cancelled']).optional(),
  serviceDate: z.string().datetime().optional(),
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
  ]).optional(),
  notes: z.string().max(1000).optional(),
  estimatedCost: z.number().min(0).optional(),
  actualCost: z.number().min(0).optional(),
  vehicleRegistration: z.string().optional(),
  vehicleMileage: z.number().int().min(0).optional(),
})

/**
 * GET /api/service-booking/[id]
 * Retrieve a single service booking with full details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    const booking = await prisma.serviceBooking.findUnique({
      where: { id },
      include: {
        customerLead: true,
        dealerLocation: true,
        carModel: true,
        variant: true,
        pickupRequest: true,
      },
    })

    if (!booking) {
      return errorResponse('Service booking not found', 404)
    }

    return successResponse(booking)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/service-booking/[id]
 * Update service booking status or details
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const data = updateServiceBookingSchema.parse(body)

    // Check if booking exists
    const existingBooking = await prisma.serviceBooking.findUnique({
      where: { id },
    })

    if (!existingBooking) {
      return errorResponse('Service booking not found', 404)
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    }

    // If completing, set completedAt
    if (data.status === 'completed') {
      updateData.completedAt = new Date()
    }

    // If cancelling, set cancelledAt
    if (data.status === 'cancelled') {
      updateData.cancelledAt = new Date()
    }

    // Update the service booking
    const updatedBooking = await prisma.serviceBooking.update({
      where: { id },
      data: updateData,
      include: {
        customerLead: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
        dealerLocation: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    return successResponse({
      id: updatedBooking.id,
      status: updatedBooking.status,
      serviceDate: updatedBooking.serviceDate,
      serviceTime: updatedBooking.serviceTime,
      serviceType: updatedBooking.serviceType,
      completedAt: updatedBooking.completedAt,
      cancelledAt: updatedBooking.cancelledAt,
      customer: updatedBooking.customerLead,
      location: updatedBooking.dealerLocation,
      updatedAt: updatedBooking.updatedAt,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/service-booking/[id]
 * Soft delete a service booking
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    // Only admin and service_advisor can delete
    if (!['admin', 'service_advisor'].includes(session.user.role as string)) {
      return errorResponse('Forbidden: Insufficient permissions', 403)
    }

    const { id } = await params

    const booking = await prisma.serviceBooking.findUnique({
      where: { id },
    })

    if (!booking) {
      return errorResponse('Service booking not found', 404)
    }

    // Soft delete
    await prisma.serviceBooking.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return successResponse({ message: 'Service booking deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

