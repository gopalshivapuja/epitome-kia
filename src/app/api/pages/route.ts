import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

// Validation schema for creating pages
const createPageSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.string(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  isPublished: z.boolean().default(false),
})

/**
 * GET /api/pages
 * List all pages (public pages or all for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const isAdmin = session?.user?.role && ['admin', 'staff'].includes(session.user.role as string)
    
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    // Non-admin users can only see published pages
    if (!isAdmin) {
      where.isPublished = true
    }

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.page.count({ where }),
    ])

    return successResponse({
      pages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * POST /api/pages
 * Create a new page (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    // Only admin can create pages
    if (session.user.role !== 'admin') {
      return errorResponse('Forbidden: Admin access required', 403)
    }

    const body = await request.json()
    const data = createPageSchema.parse(body)

    // Check for slug uniqueness
    const slugExists = await prisma.page.findFirst({
      where: { slug: data.slug },
    })
    if (slugExists) {
      return errorResponse('Slug already exists', 400)
    }

    // Create the page
    const page = await prisma.page.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
    })

    return successResponse(page, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

