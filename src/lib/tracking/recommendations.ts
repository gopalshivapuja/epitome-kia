// Recommendation logic based on user behavior

import { getViewedModels, getInterests, type ViewedModel, type UserInterests } from './storage'

// Model metadata for recommendations
export const MODEL_METADATA: Record<string, {
  segment: string
  priceRange: [number, number]
  fuelTypes: string[]
  bodyType: string
  features: string[]
}> = {
  seltos: {
    segment: 'compact_suv',
    priceRange: [1099000, 1899000],
    fuelTypes: ['petrol', 'diesel'],
    bodyType: 'suv',
    features: ['sunroof', 'adas', 'connected_car', 'ventilated_seats'],
  },
  sonet: {
    segment: 'subcompact_suv',
    priceRange: [799000, 1599000],
    fuelTypes: ['petrol', 'diesel'],
    bodyType: 'suv',
    features: ['compact', 'connected_car', 'sunroof'],
  },
  carens: {
    segment: 'mpv',
    priceRange: [1099000, 2099000],
    fuelTypes: ['petrol', 'diesel'],
    bodyType: 'mpv',
    features: ['7_seats', 'family', 'captain_seats', 'ambient_lighting'],
  },
  carnival: {
    segment: 'premium_mpv',
    priceRange: [3300000, 3650000],
    fuelTypes: ['diesel'],
    bodyType: 'mpv',
    features: ['premium', 'vip_seats', 'luxury'],
  },
  ev6: {
    segment: 'electric_suv',
    priceRange: [6000000, 6500000],
    fuelTypes: ['electric'],
    bodyType: 'suv',
    features: ['electric', 'fast_charging', 'premium', 'performance'],
  },
  ev9: {
    segment: 'electric_suv',
    priceRange: [12500000, 12500000],
    fuelTypes: ['electric'],
    bodyType: 'suv',
    features: ['electric', 'luxury', '7_seats', 'flagship'],
  },
}

export interface Recommendation {
  modelSlug: string
  score: number
  reasons: string[]
}

// Calculate recommendation score for a model based on user behavior
function calculateModelScore(
  modelSlug: string,
  viewedModels: ViewedModel[],
  interests: UserInterests
): { score: number; reasons: string[] } {
  const metadata = MODEL_METADATA[modelSlug]
  if (!metadata) return { score: 0, reasons: [] }

  let score = 0
  const reasons: string[] = []

  // Factor 1: Previously viewed models in same segment
  const viewedInSegment = viewedModels.filter(
    (v) => MODEL_METADATA[v.slug]?.segment === metadata.segment
  )
  if (viewedInSegment.length > 0) {
    score += 20
    reasons.push('Similar to models you viewed')
  }

  // Factor 2: Budget match
  if (interests.budget) {
    const [minPrice, maxPrice] = metadata.priceRange
    const budgetMin = interests.budget.min || 0
    const budgetMax = interests.budget.max || Infinity

    if (minPrice <= budgetMax && maxPrice >= budgetMin) {
      score += 30
      reasons.push('Within your budget')
    }
  }

  // Factor 3: Fuel type preference
  if (interests.fuelType && interests.fuelType.length > 0) {
    const matchesFuel = metadata.fuelTypes.some((f) =>
      interests.fuelType!.includes(f as 'petrol' | 'diesel' | 'electric')
    )
    if (matchesFuel) {
      score += 25
      reasons.push('Matches your fuel preference')
    }
  }

  // Factor 4: Body type preference
  if (interests.bodyType && interests.bodyType.includes(metadata.bodyType as 'suv' | 'mpv')) {
    score += 15
    reasons.push('Matches your preferred body type')
  }

  // Factor 5: Time spent on similar models
  const avgTimeOnSimilar = viewedModels
    .filter((v) => MODEL_METADATA[v.slug]?.segment === metadata.segment)
    .reduce((sum, v) => sum + (v.timeSpent || 0), 0)

  if (avgTimeOnSimilar > 60) {
    score += 10
    reasons.push('You spent time exploring similar models')
  }

  // Reduce score if already viewed (to show variety)
  const alreadyViewed = viewedModels.find((v) => v.slug === modelSlug)
  if (alreadyViewed) {
    score -= 10
  }

  return { score: Math.max(0, score), reasons }
}

// Get personalized recommendations
export function getRecommendations(limit: number = 3): Recommendation[] {
  const viewedModels = getViewedModels()
  const interests = getInterests()

  // If no data, return empty or default recommendations
  if (viewedModels.length === 0 && Object.keys(interests).length === 0) {
    return []
  }

  // Score all models
  const scores: Recommendation[] = Object.keys(MODEL_METADATA).map((slug) => {
    const { score, reasons } = calculateModelScore(slug, viewedModels, interests)
    return { modelSlug: slug, score, reasons }
  })

  // Sort by score and return top N
  return scores
    .filter((r) => r.score > 0 && r.reasons.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

// Get "You might also like" based on current model
export function getSimilarModels(currentModelSlug: string, limit: number = 2): string[] {
  const currentMeta = MODEL_METADATA[currentModelSlug]
  if (!currentMeta) return []

  return Object.entries(MODEL_METADATA)
    .filter(([slug, meta]) => {
      if (slug === currentModelSlug) return false

      // Same segment or similar price range
      const sameSegment = meta.segment === currentMeta.segment
      const similarPrice =
        Math.abs(meta.priceRange[0] - currentMeta.priceRange[0]) < 500000

      return sameSegment || similarPrice
    })
    .map(([slug]) => slug)
    .slice(0, limit)
}

// Determine which nudge to show based on user behavior
export type NudgeType =
  | 'exit_intent'
  | 'scroll_cta'
  | 'returning_visitor'
  | 'comparison_suggestion'
  | 'test_drive_reminder'
  | null

export function determineNudge(context: {
  currentPage: string
  scrollDepth?: number
  isExitIntent?: boolean
  viewedModels: ViewedModel[]
  lastVisit: Date | null
}): NudgeType {
  const { currentPage, scrollDepth, isExitIntent, viewedModels, lastVisit } = context

  // Exit intent on model pages
  if (isExitIntent && currentPage.startsWith('/models/') && viewedModels.length > 0) {
    return 'exit_intent'
  }

  // Scroll CTA on model pages after 50% scroll
  if (currentPage.startsWith('/models/') && scrollDepth && scrollDepth >= 50) {
    return 'scroll_cta'
  }

  // Returning visitor with previous interest
  if (lastVisit && viewedModels.length >= 2) {
    const daysSinceLastVisit = Math.floor(
      (Date.now() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceLastVisit >= 1 && daysSinceLastVisit <= 7) {
      return 'returning_visitor'
    }
  }

  // Comparison suggestion after viewing 2+ models
  if (viewedModels.length >= 2 && currentPage.startsWith('/models/')) {
    return 'comparison_suggestion'
  }

  return null
}
