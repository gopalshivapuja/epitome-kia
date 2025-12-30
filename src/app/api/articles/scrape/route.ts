import { NextRequest } from 'next/server'
import { scrapeArticle, extractKiaTags } from '@/lib/article-scraper'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'

// POST /api/articles/scrape - Scrape metadata from an article URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return errorResponse('URL is required', 400)
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return errorResponse('Invalid URL format', 400)
    }

    // Scrape the article
    const scrapedData = await scrapeArticle(url)

    if (!scrapedData) {
      return errorResponse('Failed to scrape article. Please check the URL and try again.', 422)
    }

    // Extract Kia-related tags from title and description
    const titleAndDesc = `${scrapedData.title} ${scrapedData.description || ''}`
    const kiaTags = extractKiaTags(titleAndDesc)

    return successResponse({
      ...scrapedData,
      kiaTags,
      // Default sentiment - admin can change
      sentiment: 'positive',
    })
  } catch (error) {
    return handleApiError(error)
  }
}
