import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { z } from 'zod'

// Validation schema for creating blog posts
const createBlogPostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().max(500).optional(),
  content: z.string(),
  authorName: z.string().max(100).optional(),
  isPublished: z.boolean().default(false),
})

/**
 * GET /api/blog-posts
 * List blog posts (public or all for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const isAdmin = session?.user?.role && ['admin', 'staff'].includes(session.user.role as string)
    
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)))
    const skip = (page - 1) * limit
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    // Non-admin users can only see published posts
    if (!isAdmin) {
      where.isPublished = true
    }

    // Filter by tag (disabled - tags field not in schema)
    // if (tag) {
    //   where.tags = { has: tag }
    // }

    // Search by title or summary
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          authorName: true,
          isPublished: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ])

    return successResponse({
      posts,
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
 * POST /api/blog-posts
 * Create a new blog post (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return errorResponse('Unauthorized', 401)
    }

    // Only admin can create blog posts
    if (session.user.role !== 'admin') {
      return errorResponse('Forbidden: Admin access required', 403)
    }

    const body = await request.json()
    const data = createBlogPostSchema.parse(body)

    // Check for slug uniqueness
    const slugExists = await prisma.blogPost.findFirst({
      where: { slug: data.slug },
    })
    if (slugExists) {
      return errorResponse('Slug already exists', 400)
    }

    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary || null,
        content: data.content,
        authorName: data.authorName || session.user.name || 'Admin',
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : null,
      },
    })

    return successResponse(post, 201)
  } catch (error) {
    return handleApiError(error)
  }
}

