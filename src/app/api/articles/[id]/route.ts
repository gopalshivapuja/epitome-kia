import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

// GET /api/articles/[id] - Get a single article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const article = await prisma.curatedArticle.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!article) {
      return errorResponse('Article not found', 404)
    }

    return successResponse(article)
  } catch (error) {
    return handleApiError(error)
  }
}

// PATCH /api/articles/[id] - Update an article
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.curatedArticle.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!existing) {
      return errorResponse('Article not found', 404)
    }

    const {
      title,
      summary,
      thumbnailUrl,
      publishedDate,
      kiaTags,
      sentiment,
      isApproved,
      approvedBy,
    } = body

    const updateData: Record<string, unknown> = {}

    if (title !== undefined) updateData.title = title
    if (summary !== undefined) updateData.summary = summary
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl
    if (publishedDate !== undefined) updateData.publishedDate = publishedDate ? new Date(publishedDate) : null
    if (kiaTags !== undefined) updateData.kiaTags = kiaTags
    if (sentiment !== undefined) updateData.sentiment = sentiment

    // Handle approval
    if (isApproved !== undefined) {
      updateData.isApproved = isApproved
      if (isApproved && !existing.isApproved) {
        updateData.approvedAt = new Date()
        updateData.approvedBy = approvedBy || 'admin'
      } else if (!isApproved) {
        updateData.approvedAt = null
        updateData.approvedBy = null
      }
    }

    const article = await prisma.curatedArticle.update({
      where: { id },
      data: updateData,
    })

    return successResponse(article)
  } catch (error) {
    return handleApiError(error)
  }
}

// DELETE /api/articles/[id] - Soft delete an article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.curatedArticle.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!existing) {
      return errorResponse('Article not found', 404)
    }

    await prisma.curatedArticle.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return successResponse({ message: 'Article deleted' })
  } catch (error) {
    return handleApiError(error)
  }
}
