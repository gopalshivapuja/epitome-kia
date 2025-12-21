import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, handleApiError } from '@/lib/api-utils'
import { serviceBookingSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const data = serviceBookingSchema.parse(body)

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
          source: 'service_booking',
          notes: data.notes || null,
        },
      })
    }

    // Create service booking
    const serviceBooking = await prisma.serviceBooking.create({
      data: {
        customerLeadId: customerLead.id,
        dealerLocationId: data.dealerLocationId || null,
        carModelId: data.carModelId || null,
        variantId: data.variantId || null,
        serviceDate: new Date(data.serviceDate),
        serviceTime: data.serviceTime || null,
        serviceType: data.serviceType,
        notes: data.notes || null,
        status: 'requested',
      },
      include: {
        dealerLocation: {
          select: { name: true, addressLine1: true, city: true },
        },
        carModel: {
          select: { name: true },
        },
      },
    })

    return successResponse(
      {
        id: serviceBooking.id,
        customerName: customerLead.fullName,
        serviceType: serviceBooking.serviceType,
        serviceDate: serviceBooking.serviceDate,
        serviceTime: serviceBooking.serviceTime,
        location: serviceBooking.dealerLocation?.name,
        status: serviceBooking.status,
        message: 'Service booking submitted successfully. We will confirm your appointment shortly.',
        createdAt: serviceBooking.createdAt,
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
    const serviceType = searchParams.get('serviceType')

    // Build where clause
    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (status) {
      where.status = status
    }

    if (serviceType) {
      where.serviceType = serviceType
    }

    const [bookings, total] = await Promise.all([
      prisma.serviceBooking.findMany({
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
          dealerLocation: {
            select: { id: true, name: true, city: true },
          },
          carModel: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.serviceBooking.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      bookings: bookings.map((booking) => ({
        id: booking.id,
        customer: booking.customerLead,
        location: booking.dealerLocation,
        carModel: booking.carModel,
        serviceType: booking.serviceType,
        serviceDate: booking.serviceDate,
        serviceTime: booking.serviceTime,
        notes: booking.notes,
        status: booking.status,
        createdAt: booking.createdAt,
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
