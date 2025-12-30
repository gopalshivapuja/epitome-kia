'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  trackEvent,
  trackPageView,
  createScrollTracker,
  trackCTAClick,
} from '@/lib/tracking/events'
import {
  getViewedModels,
  getInterests,
  getLastVisit,
  updateLastVisit,
  isNudgeDismissed,
  dismissNudge,
} from '@/lib/tracking/storage'
import {
  getRecommendations,
  determineNudge,
  type NudgeType,
  type Recommendation,
} from '@/lib/tracking/recommendations'

// Hook for page-level tracking
export function usePageTracking(modelSlug?: string, modelName?: string) {
  const pathname = usePathname()
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Track page view
    cleanupRef.current = trackPageView(pathname, modelSlug)

    // Track model view if on a model page
    if (modelSlug && modelName) {
      trackEvent({ type: 'model_view', modelSlug, modelName })
    }

    // Set up scroll tracking
    const cleanupScroll = createScrollTracker(pathname)

    // Update last visit
    updateLastVisit()

    return () => {
      cleanupRef.current?.()
      cleanupScroll()
    }
  }, [pathname, modelSlug, modelName])
}

// Hook for getting personalized recommendations
export function useRecommendations(limit: number = 3): Recommendation[] {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return

    const recs = getRecommendations(limit)
    setRecommendations(recs)
  }, [limit])

  return recommendations
}

// Need to import useState
import { useState } from 'react'

// Hook for recently viewed models
export function useRecentlyViewed(excludeCurrent?: string) {
  const [viewedModels, setViewedModels] = useState<ReturnType<typeof getViewedModels>>([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const models = getViewedModels().filter((m) => m.slug !== excludeCurrent)
    setViewedModels(models)
  }, [excludeCurrent])

  return viewedModels
}

// Hook for smart nudges
export function useSmartNudge(currentPage: string) {
  const [nudgeType, setNudgeType] = useState<NudgeType>(null)
  const [showNudge, setShowNudge] = useState(false)
  const scrollDepthRef = useRef(0)

  // Track scroll depth
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      scrollDepthRef.current = Math.round((window.scrollY / scrollHeight) * 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine nudge based on behavior
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkNudge = () => {
      const viewedModels = getViewedModels()
      const lastVisit = getLastVisit()

      const nudge = determineNudge({
        currentPage,
        scrollDepth: scrollDepthRef.current,
        isExitIntent: false,
        viewedModels,
        lastVisit,
      })

      if (nudge && !isNudgeDismissed(nudge)) {
        setNudgeType(nudge)
        // Delay showing nudge
        setTimeout(() => setShowNudge(true), 3000)
      }
    }

    // Check nudge after a delay
    const timeout = setTimeout(checkNudge, 5000)
    return () => clearTimeout(timeout)
  }, [currentPage])

  // Exit intent detection
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showNudge) {
        const viewedModels = getViewedModels()
        const lastVisit = getLastVisit()

        const nudge = determineNudge({
          currentPage,
          scrollDepth: scrollDepthRef.current,
          isExitIntent: true,
          viewedModels,
          lastVisit,
        })

        if (nudge && nudge === 'exit_intent' && !isNudgeDismissed('exit_intent')) {
          setNudgeType('exit_intent')
          setShowNudge(true)
        }
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [currentPage, showNudge])

  const dismiss = useCallback(() => {
    if (nudgeType) {
      dismissNudge(nudgeType)
    }
    setShowNudge(false)
  }, [nudgeType])

  return { nudgeType, showNudge, dismiss }
}

// Utility to track CTA clicks
export { trackCTAClick }

// Export storage utilities for direct access
export { getViewedModels, getInterests, clearTrackingData } from '@/lib/tracking/storage'
