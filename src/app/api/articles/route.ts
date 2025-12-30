import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

// GET /api/articles - List all approved curated articles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const showAll = searchParams.get('all') === 'true' // For admin view
    const tag = searchParams.get('tag') // Filter by kia model tag
    const source = searchParams.get('source') // Filter by source

    const where: Record<string, unknown> = {
      deletedAt: null,
    }

    // Only show approved articles for public view
    if (!showAll) {
      where.isApproved = true
    }

    if (tag) {
      where.kiaTags = { has: tag }
    }

    if (source) {
      where.source = source
    }

    const articles = await prisma.curatedArticle.findMany({
      where,
      orderBy: [
        { publishedDate: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        title: true,
        source: true,
        sourceUrl: true,
        summary: true,
        thumbnailUrl: true,
        publishedDate: true,
        kiaTags: true,
        sentiment: true,
        isApproved: true,
        approvedAt: true,
        createdAt: true,
      },
    })

    return successResponse(articles)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST /api/articles - Create a new curated article (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      title,
      source,
      sourceUrl,
      summary,
      thumbnailUrl,
      publishedDate,
      kiaTags,
      sentiment,
    } = body

    if (!title || !source || !sourceUrl) {
      return errorResponse('Title, source, and sourceUrl are required', 400)
    }

    // Check if article already exists
    const existing = await prisma.curatedArticle.findUnique({
      where: { sourceUrl },
    })

    if (existing) {
      return errorResponse('Article with this URL already exists', 409)
    }

    const article = await prisma.curatedArticle.create({
      data: {
        title,
        source,
        sourceUrl,
        summary,
        thumbnailUrl,
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        kiaTags: kiaTags || [],
        sentiment: sentiment || 'positive',
        isApproved: false,
      },
    })

    return successResponse(article, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
