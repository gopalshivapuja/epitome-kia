import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { leadSchema } from '@/lib/validations'
import { rateLimit, getClientIp, rateLimitConfigs } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for lead submissions
    const ip = getClientIp(request)
    const rateLimitResult = rateLimit(`leads:${ip}`, rateLimitConfigs.leadForm)
    
    if (!rateLimitResult.success) {
      return errorResponse(
        'Too many requests. Please try again later.',
        429,
        {
          'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimitResult.resetAt),
        }
      )
    }

    const body = await request.json()

    // Validate input
    const data = leadSchema.parse(body)

    // Create customer lead
    const lead = await prisma.customerLead.create({
      data: {
        fullName: data.fullName,
        email: data.email || null,
        phone: data.phone || null,
        preferredContact: data.preferredContact || null,
        source: data.source || 'website',
        notes: data.notes || null,
      },
    })

    return successResponse(
      {
        id: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        createdAt: lead.createdAt,
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

    const source = searchParams.get('source')
    const search = searchParams.get('search')

    // Build where clause
    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    if (source) {
      where.source = source
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.customerLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              testDriveRequests: true,
              serviceBookings: true,
            },
          },
        },
      }),
      prisma.customerLead.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse({
      leads: leads.map((lead) => ({
        id: lead.id,
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        preferredContact: lead.preferredContact,
        source: lead.source,
        testDriveCount: lead._count.testDriveRequests,
        serviceBookingCount: lead._count.serviceBookings,
        createdAt: lead.createdAt,
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
