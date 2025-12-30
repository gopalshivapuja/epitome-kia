import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

const createAlertSchema = z.object({
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  modelSlug: z.string().optional(),
  alertType: z.enum(['price_drop', 'new_offer', 'availability']),
  threshold: z.number().optional(),
})

// POST /api/alerts - Create a new alert subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = createAlertSchema.parse(body)

    // Check if subscription already exists
    const existingAlert = await prisma.alertSubscription.findFirst({
      where: {
        email: data.email,
        modelSlug: data.modelSlug || null,
        alertType: data.alertType,
        isActive: true,
        deletedAt: null,
      },
    })

    if (existingAlert) {
      return successResponse({ id: existingAlert.id, message: 'Alert already exists' })
    }

    // Create new subscription
    const alert = await prisma.alertSubscription.create({
      data: {
        email: data.email,
        phone: data.phone,
        modelSlug: data.modelSlug,
        alertType: data.alertType,
        threshold: data.threshold,
        isActive: true,
      },
    })

    return successResponse({ id: alert.id, message: 'Alert created successfully' }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

// GET /api/alerts - Get alerts for an email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return errorResponse('Email is required', 400)
    }

    const alerts = await prisma.alertSubscription.findMany({
      where: {
        email,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(alerts)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/alerts - Delete an alert subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const email = searchParams.get('email')

    if (!id || !email) {
      return errorResponse('Alert ID and email are required', 400)
    }

    // Verify ownership before deleting
    const alert = await prisma.alertSubscription.findFirst({
      where: {
        id,
        email,
        deletedAt: null,
      },
    })

    if (!alert) {
      return errorResponse('Alert not found', 404)
    }

    await prisma.alertSubscription.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return successResponse({ message: 'Alert deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/alerts - Toggle alert active status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, email, isActive } = body

    if (!id || !email || typeof isActive !== 'boolean') {
      return errorResponse('Alert ID, email, and isActive status are required', 400)
    }

    // Verify ownership before updating
    const alert = await prisma.alertSubscription.findFirst({
      where: {
        id,
        email,
        deletedAt: null,
      },
    })

    if (!alert) {
      return errorResponse('Alert not found', 404)
    }

    const updatedAlert = await prisma.alertSubscription.update({
      where: { id },
      data: { isActive },
    })

    return successResponse(updatedAlert)
  } catch (error) {
    return handleApiError(error)
  }
}
