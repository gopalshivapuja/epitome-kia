// Kia India website scraper for auto-syncing model data
// Note: This scrapes public data from kia.com/in for dealership use

import * as cheerio from 'cheerio'

export interface ScrapedModelData {
  slug: string
  name: string
  tagline?: string
  startingPrice?: number
  priceRange?: string
  variants: ScrapedVariant[]
  colors: ScrapedColor[]
  specs: Record<string, string>
  features: string[]
  imageUrls: string[]
  brochureUrl?: string
  lastScraped: Date
}

export interface ScrapedVariant {
  name: string
  engine?: string
  transmission?: string
  price?: number
  features: string[]
}

export interface ScrapedColor {
  name: string
  code?: string
  hex?: string
  imageUrl?: string
}

// Model URLs on kia.com/in
const MODEL_URLS: Record<string, string> = {
  seltos: 'https://www.kia.com/in/seltos',
  sonet: 'https://www.kia.com/in/sonet',
  carens: 'https://www.kia.com/in/carens',
  carnival: 'https://www.kia.com/in/carnival',
  ev6: 'https://www.kia.com/in/ev6',
  ev9: 'https://www.kia.com/in/ev9',
}

// Fetch and parse HTML
async function fetchPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`)
      return null
    }

    return response.text()
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return null
  }
}

// Parse price string to number
function parsePrice(priceStr: string): number | undefined {
  // Handle formats like "₹ 10.99 Lakh*" or "₹ 1.25 Cr*"
  const cleanStr = priceStr.replace(/[₹,*\s]/g, '')

  const lakhMatch = cleanStr.match(/([\d.]+)\s*Lakh/i)
  if (lakhMatch) {
    return parseFloat(lakhMatch[1]) * 100000
  }

  const crMatch = cleanStr.match(/([\d.]+)\s*Cr/i)
  if (crMatch) {
    return parseFloat(crMatch[1]) * 10000000
  }

  // Try parsing as direct number
  const num = parseFloat(cleanStr)
  return isNaN(num) ? undefined : num
}

// Scrape model overview page
export async function scrapeModelPage(modelSlug: string): Promise<ScrapedModelData | null> {
  const url = MODEL_URLS[modelSlug]
  if (!url) {
    console.error(`Unknown model: ${modelSlug}`)
    return null
  }

  const html = await fetchPage(url)
  if (!html) return null

  const $ = cheerio.load(html)

  // Extract basic info
  const name = modelSlug.charAt(0).toUpperCase() + modelSlug.slice(1)
  const tagline = $('meta[name="description"]').attr('content')?.split('.')[0] || ''

  // Extract price (varies by page structure)
  let startingPrice: number | undefined
  const priceText =
    $('.price-value').first().text() ||
    $('[class*="price"]').first().text() ||
    $('span:contains("Lakh")').first().text()

  if (priceText) {
    startingPrice = parsePrice(priceText)
  }

  // Extract colors from color selector
  const colors: ScrapedColor[] = []
  $('[class*="color-selector"] button, [class*="color-option"]').each((_, el) => {
    const $el = $(el)
    const colorName = $el.attr('title') || $el.attr('data-color-name') || ''
    const colorCode = $el.attr('data-color-code') || ''
    const bgColor = $el.css('background-color') || $el.attr('style')

    if (colorName) {
      colors.push({
        name: colorName,
        code: colorCode,
        hex: bgColor?.match(/#[a-fA-F0-9]{6}/)?.[0],
      })
    }
  })

  // Extract features from feature lists
  const features: string[] = []
  $('[class*="feature-item"], [class*="key-feature"] li').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length < 100) {
      features.push(text)
    }
  })

  // Extract image URLs
  const imageUrls: string[] = []
  $('img[src*="models"], img[src*="gallery"], [class*="hero"] img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src')
    if (src && !imageUrls.includes(src)) {
      imageUrls.push(src)
    }
  })

  // Extract brochure URL
  const brochureUrl =
    $('a[href*="brochure"]').attr('href') || $('a:contains("Brochure")').attr('href')

  // Extract specs from specs section
  const specs: Record<string, string> = {}
  $('[class*="spec-row"], [class*="specification"] tr').each((_, el) => {
    const $el = $(el)
    const label = $el.find('th, td:first-child, [class*="label"]').text().trim()
    const value = $el.find('td:last-child, [class*="value"]').text().trim()
    if (label && value) {
      specs[label] = value
    }
  })

  return {
    slug: modelSlug,
    name,
    tagline,
    startingPrice,
    variants: [], // Would need to scrape variants page
    colors,
    specs,
    features: features.slice(0, 20), // Limit features
    imageUrls: imageUrls.slice(0, 10), // Limit images
    brochureUrl,
    lastScraped: new Date(),
  }
}

// Scrape variants/pricing page
export async function scrapeVariantsPage(
  modelSlug: string
): Promise<ScrapedVariant[]> {
  const baseUrl = MODEL_URLS[modelSlug]
  if (!baseUrl) return []

  // Variants are usually at /variants or /specs-features
  const variantsUrl = `${baseUrl}/specs-features`
  const html = await fetchPage(variantsUrl)
  if (!html) return []

  const $ = cheerio.load(html)
  const variants: ScrapedVariant[] = []

  // Parse variant cards/rows
  $('[class*="variant-card"], [class*="variant-row"], table tbody tr').each(
    (_, el) => {
      const $el = $(el)

      const name = $el.find('[class*="variant-name"], td:first-child').text().trim()
      const engine = $el.find('[class*="engine"], td:nth-child(2)').text().trim()
      const transmission = $el.find('[class*="transmission"], td:nth-child(3)').text().trim()
      const priceText = $el.find('[class*="price"], td:last-child').text().trim()

      if (name) {
        variants.push({
          name,
          engine: engine || undefined,
          transmission: transmission || undefined,
          price: parsePrice(priceText),
          features: [],
        })
      }
    }
  )

  return variants
}

// Scrape all models
export async function scrapeAllModels(): Promise<Map<string, ScrapedModelData>> {
  const results = new Map<string, ScrapedModelData>()

  for (const modelSlug of Object.keys(MODEL_URLS)) {
    try {
      console.log(`Scraping ${modelSlug}...`)
      const data = await scrapeModelPage(modelSlug)
      if (data) {
        // Also get variants
        const variants = await scrapeVariantsPage(modelSlug)
        data.variants = variants
        results.set(modelSlug, data)
      }
    } catch (error) {
      console.error(`Error scraping ${modelSlug}:`, error)
    }

    // Rate limiting - wait between requests
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return results
}

// Get model URL for reference
export function getKiaIndiaUrl(modelSlug: string): string | undefined {
  return MODEL_URLS[modelSlug]
}
