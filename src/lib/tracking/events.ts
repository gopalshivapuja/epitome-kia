// Event tracking utilities

import { addViewedModel, updateInterests, updateModelTimeSpent, getVisitorId } from './storage'

export type TrackingEvent =
  | { type: 'page_view'; page: string; modelSlug?: string }
  | { type: 'model_view'; modelSlug: string; modelName: string; variant?: string }
  | { type: 'time_on_page'; modelSlug: string; seconds: number }
  | { type: 'scroll_depth'; page: string; depth: number }
  | { type: 'cta_click'; action: string; modelSlug?: string; label?: string }
  | { type: 'compare_selection'; models: string[] }
  | { type: 'search_query'; query: string }
  | { type: 'filter_applied'; filter: string; value: string }
  | { type: 'emi_calculation'; modelSlug: string; price: number; tenure: number }
  | { type: 'test_drive_start'; modelSlug: string }
  | { type: 'offer_view'; offerId: string; modelSlug?: string }

// Track an event
export function trackEvent(event: TrackingEvent): void {
  if (typeof window === 'undefined') return

  // Process event based on type
  switch (event.type) {
    case 'model_view':
      addViewedModel({
        slug: event.modelSlug,
        name: event.modelName,
        variant: event.variant,
      })
      break

    case 'time_on_page':
      if (event.modelSlug) {
        updateModelTimeSpent(event.modelSlug, event.seconds)
      }
      break

    case 'compare_selection':
      updateInterests({
        interestedModels: event.models,
      })
      break

    case 'emi_calculation':
      // Infer budget range from EMI calculation
      const estimatedBudget = event.price
      updateInterests({
        budget: {
          min: Math.floor(estimatedBudget * 0.8),
          max: Math.ceil(estimatedBudget * 1.2),
        },
      })
      break

    case 'filter_applied':
      // Track filter preferences
      if (event.filter === 'fuelType') {
        const currentInterests = JSON.parse(
          localStorage.getItem('kia_interests') || '{}'
        )
        const fuelTypes = currentInterests.fuelType || []
        if (!fuelTypes.includes(event.value)) {
          fuelTypes.push(event.value)
        }
        updateInterests({ fuelType: fuelTypes })
      }
      break
  }

  // Also send to analytics if configured
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
    const gtag = (window as unknown as { gtag: Function }).gtag
    gtag('event', event.type, {
      visitor_id: getVisitorId(),
      ...event,
    })
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Tracking]', event)
  }
}

// Track page view with automatic cleanup
export function trackPageView(page: string, modelSlug?: string): () => void {
  const startTime = Date.now()

  trackEvent({ type: 'page_view', page, modelSlug })

  // Return cleanup function to track time on page
  return () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    if (timeSpent > 5 && modelSlug) {
      // Only track if > 5 seconds
      trackEvent({ type: 'time_on_page', modelSlug, seconds: timeSpent })
    }
  }
}

// Track scroll depth
export function createScrollTracker(page: string): () => void {
  if (typeof window === 'undefined') return () => {}

  let maxDepth = 0
  const milestones = [25, 50, 75, 100]
  const reportedMilestones = new Set<number>()

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const currentDepth = Math.round((window.scrollY / scrollHeight) * 100)

    if (currentDepth > maxDepth) {
      maxDepth = currentDepth

      // Report milestone depths
      milestones.forEach((milestone) => {
        if (maxDepth >= milestone && !reportedMilestones.has(milestone)) {
          reportedMilestones.add(milestone)
          trackEvent({ type: 'scroll_depth', page, depth: milestone })
        }
      })
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}

// Track CTA clicks
export function trackCTAClick(action: string, modelSlug?: string, label?: string): void {
  trackEvent({ type: 'cta_click', action, modelSlug, label })
}
