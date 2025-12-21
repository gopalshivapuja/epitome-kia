import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

type RouteParams = {
  params: Promise<{ id: string }>
}

// Validation schema for lead updates
const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
  notes: z.string().max(1000).optional(),
  assignedTo: z.string().uuid().optional(),
  fullName: z.string().min(2).max(100).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).optional(),
})

/**
 * GET /api/leads/[id]
 * Retrieve a single lead with full details
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    const { id } = await params

    const lead = await prisma.customerLead.findUnique({
      where: { id },
      include: {
        testDriveRequests: {
          include: {
            carModel: true,
            variant: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        serviceBookings: {
          include: {
            dealerLocation: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        pickupRequests: {
          orderBy: { createdAt: 'desc' },
        },
        chatSessions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!lead) {
      return errorResponse('Lead not found', 404)
    }

    return successResponse(lead)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/leads/[id]
 * Update lead status, notes, assignment, or other fields
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
    const data = updateLeadSchema.parse(body)

    // Check if lead exists
    const existingLead = await prisma.customerLead.findUnique({
      where: { id },
    })

    if (!existingLead) {
      return errorResponse('Lead not found', 404)
    }

    // Update the lead
    const updatedLead = await prisma.customerLead.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    return successResponse({
      id: updatedLead.id,
      status: updatedLead.status,
      fullName: updatedLead.fullName,
      email: updatedLead.email,
      phone: updatedLead.phone,
      notes: updatedLead.notes,
      updatedAt: updatedLead.updatedAt,
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/leads/[id]
 * Soft delete a lead
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    // Only admin can delete leads
    if (session.user.role !== 'admin') {
      return errorResponse('Forbidden: Admin access required', 403)
    }

    const { id } = await params

    const lead = await prisma.customerLead.findUnique({
      where: { id },
    })

    if (!lead) {
      return errorResponse('Lead not found', 404)
    }

    // Soft delete
    await prisma.customerLead.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return successResponse({ message: 'Lead deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

