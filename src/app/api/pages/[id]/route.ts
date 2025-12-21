import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

type RouteParams = {
  params: Promise<{ id: string }>
}

// Validation schema for page updates
const updatePageSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  content: z.string().optional(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  isPublished: z.boolean().optional(),
})

/**
 * GET /api/pages/[id]
 * Retrieve a single page
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        faqs: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    })

    if (!page) {
      return errorResponse('Page not found', 404)
    }

    // Check if user can view unpublished pages
    if (!page.isPublished) {
      const session = await auth()
      if (!session?.user || session.user.role !== 'admin') {
        return errorResponse('Page not found', 404)
      }
    }

    return successResponse(page)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/pages/[id]
 * Update a page (admin only)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    if (session.user.role !== 'admin') {
      return errorResponse('Forbidden: Admin access required', 403)
    }

    const { id } = await params
    const body = await request.json()

    // Validate input
    const data = updatePageSchema.parse(body)

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
    })

    if (!existingPage) {
      return errorResponse('Page not found', 404)
    }

    // Check for slug uniqueness if slug is being changed
    if (data.slug && data.slug !== existingPage.slug) {
      const slugExists = await prisma.page.findFirst({
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

    // Handle publishing
    if (data.isPublished === true && !existingPage.isPublished) {
      updateData.publishedAt = new Date()
    } else if (data.isPublished === false) {
      updateData.publishedAt = null
    }

    // Update the page
    const updatedPage = await prisma.page.update({
      where: { id },
      data: updateData,
    })

    return successResponse(updatedPage)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/pages/[id]
 * Soft delete a page (admin only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    if (session.user.role !== 'admin') {
      return errorResponse('Forbidden: Admin access required', 403)
    }

    const { id } = await params

    const page = await prisma.page.findUnique({
      where: { id },
    })

    if (!page) {
      return errorResponse('Page not found', 404)
    }

    // Soft delete
    await prisma.page.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return successResponse({ message: 'Page deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

