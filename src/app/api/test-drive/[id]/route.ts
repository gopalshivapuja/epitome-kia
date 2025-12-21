import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

type RouteParams = {
  params: Promise<{ id: string }>
}

// Validation schema for test drive status updates
const updateTestDriveSchema = z.object({
  status: z.enum(['pending', 'scheduled', 'completed', 'cancelled']).optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  locationNotes: z.string().max(500).optional(),
})

/**
 * GET /api/test-drive/[id]
 * Retrieve a single test drive request with full details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    const testDrive = await prisma.testDriveRequest.findUnique({
      where: { id },
      include: {
        customerLead: true,
        carModel: true,
        variant: true,
      },
    })

    if (!testDrive) {
      return errorResponse('Test drive request not found', 404)
    }

    return successResponse(testDrive)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/test-drive/[id]
 * Update test drive status or reschedule
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
    const data = updateTestDriveSchema.parse(body)

    // Check if test drive exists
    const existingTestDrive = await prisma.testDriveRequest.findUnique({
      where: { id },
    })

    if (!existingTestDrive) {
      return errorResponse('Test drive request not found', 404)
    }

    // Prepare update data - only include fields that exist in schema
    const updateData: Record<string, unknown> = {}

    if (data.status) updateData.status = data.status
    if (data.preferredDate) updateData.preferredDate = new Date(data.preferredDate)
    if (data.preferredTime !== undefined) updateData.preferredTime = data.preferredTime
    if (data.locationNotes !== undefined) updateData.locationNotes = data.locationNotes

    // Update the test drive request
    const updatedTestDrive = await prisma.testDriveRequest.update({
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
        carModel: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    return successResponse({
      id: updatedTestDrive.id,
      status: updatedTestDrive.status,
      preferredDate: updatedTestDrive.preferredDate,
      preferredTime: updatedTestDrive.preferredTime,
      customer: updatedTestDrive.customerLead,
      model: updatedTestDrive.carModel,
      updatedAt: updatedTestDrive.updatedAt,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/test-drive/[id]
 * Soft delete a test drive request
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    // Only admin and sales_manager can delete
    if (!['admin', 'sales_manager'].includes(session.user.role as string)) {
      return errorResponse('Forbidden: Insufficient permissions', 403)
    }

    const { id } = await params

    const testDrive = await prisma.testDriveRequest.findUnique({
      where: { id },
    })

    if (!testDrive) {
      return errorResponse('Test drive request not found', 404)
    }

    // Soft delete
    await prisma.testDriveRequest.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return successResponse({ message: 'Test drive request deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

