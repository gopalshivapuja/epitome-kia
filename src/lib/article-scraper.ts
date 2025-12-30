import * as cheerio from 'cheerio'

export interface ScrapedArticle {
  title: string
  source: string
  sourceUrl: string
  thumbnailUrl?: string
  publishedDate?: string
  description?: string
}

// Map domain to source name
const SOURCE_MAP: Record<string, string> = {
  'autocarindia.com': 'Autocar India',
  'team-bhp.com': 'Team-BHP',
  'cardekho.com': 'CarDekho',
  'carwale.com': 'CarWale',
  'overdrive.in': 'Overdrive',
  'zigwheels.com': 'ZigWheels',
}

function getSourceFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace('www.', '')
    return SOURCE_MAP[hostname] || hostname
  } catch {
    return 'Unknown'
  }
}

function extractKiaTags(text: string): string[] {
  const tags: string[] = []
  const lowerText = text.toLowerCase()

  const modelKeywords: Record<string, string[]> = {
    seltos: ['seltos'],
    sonet: ['sonet'],
    carens: ['carens'],
    carnival: ['carnival'],
    ev6: ['ev6', 'ev 6'],
    ev9: ['ev9', 'ev 9'],
    syros: ['syros'],
    clavis: ['clavis'],
  }

  for (const [model, keywords] of Object.entries(modelKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      tags.push(model)
    }
  }

  // If no specific model found but mentions Kia, add general tag
  if (tags.length === 0 && lowerText.includes('kia')) {
    tags.push('kia')
  }

  return tags
}

export async function scrapeArticle(url: string): Promise<ScrapedArticle | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract title - try multiple selectors
    let title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text() ||
      $('title').text()

    title = title?.trim() || 'Untitled'

    // Extract thumbnail
    const thumbnailUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('article img').first().attr('src') ||
      undefined

    // Extract description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('article p').first().text()?.slice(0, 300) ||
      undefined

    // Extract publish date
    let publishedDate: string | undefined
    const dateSelectors = [
      'meta[property="article:published_time"]',
      'meta[name="publish-date"]',
      'meta[name="date"]',
      'time[datetime]',
    ]

    for (const selector of dateSelectors) {
      const dateAttr = $(selector).attr('content') || $(selector).attr('datetime')
      if (dateAttr) {
        publishedDate = dateAttr
        break
      }
    }

    return {
      title,
      source: getSourceFromUrl(url),
      sourceUrl: url,
      thumbnailUrl,
      publishedDate,
      description,
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error)
    return null
  }
}

export { extractKiaTags, getSourceFromUrl }
