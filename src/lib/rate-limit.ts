/**
 * Simple in-memory rate limiter
 * 
 * For production, consider using:
 * - Upstash Rate Limit (@upstash/ratelimit)
 * - Redis-based rate limiting
 * - Edge middleware with Vercel's rate limit API
 * 
 * This implementation is suitable for single-instance deployments
 * but won't work across multiple serverless instances.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (cleared on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

interface RateLimitConfig {
  /** Maximum number of requests allowed */
  limit: number
  /** Time window in seconds */
  windowInSeconds: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, API key, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, windowInSeconds: 60 }
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowInSeconds * 1000
  const key = `${identifier}`

  let entry = rateLimitStore.get(key)

  // If no entry or window has expired, create new entry
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    }
    rateLimitStore.set(key, entry)
    return {
      success: true,
      remaining: config.limit - 1,
      resetAt: entry.resetAt,
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)

  // Check if over limit
  if (entry.count > config.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  return {
    success: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  }
}

/**
 * Get client IP from request headers
 * Works with most CDNs, proxies, and Vercel
 */
export function getClientIp(request: Request): string {
  // Try various headers in order of preference
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Cloudflare
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp
  }

  // Fallback
  return 'unknown'
}

// Preset configurations for different use cases
export const rateLimitConfigs = {
  // Very strict for sensitive operations (login, password reset)
  strict: { limit: 5, windowInSeconds: 60 * 15 }, // 5 requests per 15 minutes
  
  // Standard for form submissions
  standard: { limit: 10, windowInSeconds: 60 }, // 10 requests per minute
  
  // Lenient for general API access
  lenient: { limit: 100, windowInSeconds: 60 }, // 100 requests per minute
  
  // For lead forms
  leadForm: { limit: 5, windowInSeconds: 60 * 5 }, // 5 requests per 5 minutes
}

