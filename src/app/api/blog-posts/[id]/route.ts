import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

type RouteParams = {
  params: Promise<{ id: string }>
}

// Validation schema for blog post updates
const updateBlogPostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  summary: z.string().max(500).optional().nullable(),
  content: z.string().optional(),
  authorName: z.string().max(100).optional(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
})

/**
 * GET /api/blog-posts/[id]
 * Retrieve a single blog post
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return errorResponse('Blog post not found', 404)
    }

    // Check if user can view unpublished posts
    if (!post.isPublished) {
      const session = await auth()
      if (!session?.user || session.user.role !== 'admin') {
        return errorResponse('Blog post not found', 404)
      }
    }

    return successResponse(post)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * PATCH /api/blog-posts/[id]
 * Update a blog post (admin only)
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
    const data = updateBlogPostSchema.parse(body)

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return errorResponse('Blog post not found', 404)
    }

    // Check for slug uniqueness if slug is being changed
    if (data.slug && data.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findFirst({
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
    if (data.isPublished === true && !existingPost.isPublished) {
      updateData.publishedAt = new Date()
    } else if (data.isPublished === false) {
      updateData.publishedAt = null
    }

    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    })

    return successResponse(updatedPost)
  } catch (error) {
    return handleApiError(error)
  }
}

/**
 * DELETE /api/blog-posts/[id]
 * Soft delete a blog post (admin only)
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

    const post = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!post) {
      return errorResponse('Blog post not found', 404)
    }

    // Soft delete
    await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return successResponse({ message: 'Blog post deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}

