import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { testDriveSchema } from '@/lib/validations'
import { sendTestDriveConfirmation, notifySalesTeam } from '@/lib/email'
import { rateLimit, getClientIp, rateLimitConfigs } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for test drive submissions
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(`test-drive:${ip}`, rateLimitConfigs.leadForm)
    
    if (!rateLimitResult.success) {
      return errorResponse(
        'Too many requests. Please try again later.',
        429,
        { 'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)) }
      )
    }

    const body = await request.json()

    // Validate input
    const data = testDriveSchema.parse(body)

    // Verify car model exists
    const carModel = await prisma.carModel.findUnique({
      where: { id: data.carModelId },
    })

    if (!carModel) {
      return successResponse({ error: 'Car model not found' }, 400)
    }

    // Create or find customer lead
    let customerLead = null

    if (data.email) {
      customerLead = await prisma.customerLead.findFirst({
        where: { email: data.email, deletedAt: null },
      })
    }

    if (!customerLead && data.phone) {
      customerLead = await prisma.customerLead.findFirst({
        where: { phone: data.phone, deletedAt: null },
      })
    }

    if (!customerLead) {
      customerLead = await prisma.customerLead.create({
        data: {
          fullName: data.fullName,
          email: data.email || null,
          phone: data.phone || null,
          preferredContact: data.preferredContact || null,
          source: 'test_drive',
          notes: data.notes || null,
        },
      })
    }

    // Create test drive request
    const testDrive = await prisma.testDriveRequest.create({
      data: {
        customerLeadId: customerLead.id,
        carModelId: data.carModelId,
        variantId: data.variantId || null,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime || null,
        locationNotes: data.locationNotes || null,
        status: 'pending',
      },
      include: {
        carModel: {
          select: { name: true, slug: true },
        },
        variant: {
          select: { name: true },
        },
      },
    })

    // Send confirmation email to customer (async, don't block response)
    if (customerLead.email) {
      sendTestDriveConfirmation({
        customerName: customerLead.fullName,
        customerEmail: customerLead.email,
        customerPhone: customerLead.phone || '',
        modelName: testDrive.carModel?.name || 'Kia Vehicle',
        variantName: testDrive.variant?.name,
        preferredDate: new Date(data.preferredDate).toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        preferredTime: data.preferredTime || 'Any time',
      }).catch(console.error)

      // Notify sales team
      notifySalesTeam({
        customerName: customerLead.fullName,
        customerEmail: customerLead.email,
        customerPhone: customerLead.phone || undefined,
        subject: `Test Drive - ${testDrive.carModel?.name || 'Vehicle'}`,
        message: `New test drive request for ${testDrive.carModel?.name || 'a vehicle'} on ${new Date(data.preferredDate).toLocaleDateString()}`,
        source: 'Test Drive Form',
      }).catch(console.error)
    }

    return successResponse(
      {
        id: testDrive.id,
        customerName: customerLead.fullName,
        carModel: testDrive.carModel?.name,
        variant: testDrive.variant?.name,
        preferredDate: testDrive.preferredDate,
        preferredTime: testDrive.preferredTime,
        status: testDrive.status,
        message: 'Test drive request submitted successfully. Our team will contact you shortly.',
        createdAt: testDrive.createdAt,
      },
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const skip = (page - 1) * limit

    const status = searchParams.get('status')
    const carModelId = searchParams.get('carModelId')

    // Build where clause
    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (status) {
      where.status = status
    }

    if (carModelId) {
      where.carModelId = carModelId
    }

    const [requests, total] = await Promise.all([
      prisma.testDriveRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          customerLead: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          carModel: {
            select: { id: true, name: true, slug: true },
          },
          variant: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.testDriveRequest.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      testDrives: requests.map((td) => ({
        id: td.id,
        customer: td.customerLead,
        carModel: td.carModel,
        variant: td.variant,
        preferredDate: td.preferredDate,
        preferredTime: td.preferredTime,
        locationNotes: td.locationNotes,
        status: td.status,
        createdAt: td.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
