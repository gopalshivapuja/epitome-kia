// Local storage helpers for user preferences and tracking

const STORAGE_KEYS = {
  VISITOR_ID: 'kia_visitor_id',
  VIEWED_MODELS: 'kia_viewed_models',
  INTERESTS: 'kia_interests',
  LAST_VISIT: 'kia_last_visit',
  DISMISSED_NUDGES: 'kia_dismissed_nudges',
} as const

// Generate a unique visitor ID
function generateVisitorId(): string {
  return `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Get or create visitor ID
export function getVisitorId(): string {
  if (typeof window === 'undefined') return ''

  let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID)
  if (!visitorId) {
    visitorId = generateVisitorId()
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId)
  }
  return visitorId
}

// Viewed models tracking
export interface ViewedModel {
  slug: string
  name: string
  timestamp: number
  variant?: string
  timeSpent?: number // seconds
}

export function getViewedModels(): ViewedModel[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VIEWED_MODELS)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addViewedModel(model: Omit<ViewedModel, 'timestamp'>): void {
  if (typeof window === 'undefined') return

  const viewed = getViewedModels()

  // Check if model already exists
  const existingIndex = viewed.findIndex((m) => m.slug === model.slug)

  const newEntry: ViewedModel = {
    ...model,
    timestamp: Date.now(),
  }

  if (existingIndex >= 0) {
    // Update existing entry
    viewed[existingIndex] = newEntry
  } else {
    // Add new entry at the beginning
    viewed.unshift(newEntry)
  }

  // Keep only last 10 models
  const trimmed = viewed.slice(0, 10)
  localStorage.setItem(STORAGE_KEYS.VIEWED_MODELS, JSON.stringify(trimmed))
}

export function updateModelTimeSpent(slug: string, timeSpent: number): void {
  if (typeof window === 'undefined') return

  const viewed = getViewedModels()
  const model = viewed.find((m) => m.slug === slug)
  if (model) {
    model.timeSpent = (model.timeSpent || 0) + timeSpent
    localStorage.setItem(STORAGE_KEYS.VIEWED_MODELS, JSON.stringify(viewed))
  }
}

// User interests/preferences
export interface UserInterests {
  budget?: {
    min?: number
    max?: number
  }
  fuelType?: ('petrol' | 'diesel' | 'electric')[]
  bodyType?: ('suv' | 'mpv' | 'sedan')[]
  features?: string[]
  interestedModels?: string[]
}

export function getInterests(): UserInterests {
  if (typeof window === 'undefined') return {}
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INTERESTS)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function updateInterests(interests: Partial<UserInterests>): void {
  if (typeof window === 'undefined') return

  const current = getInterests()
  const updated = { ...current, ...interests }
  localStorage.setItem(STORAGE_KEYS.INTERESTS, JSON.stringify(updated))
}

// Last visit tracking
export function getLastVisit(): Date | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEYS.LAST_VISIT)
  return data ? new Date(parseInt(data, 10)) : null
}

export function updateLastVisit(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.LAST_VISIT, Date.now().toString())
}

// Dismissed nudges
export function getDismissedNudges(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DISMISSED_NUDGES)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function dismissNudge(nudgeId: string): void {
  if (typeof window === 'undefined') return

  const dismissed = getDismissedNudges()
  if (!dismissed.includes(nudgeId)) {
    dismissed.push(nudgeId)
    localStorage.setItem(STORAGE_KEYS.DISMISSED_NUDGES, JSON.stringify(dismissed))
  }
}

export function isNudgeDismissed(nudgeId: string): boolean {
  return getDismissedNudges().includes(nudgeId)
}

// Clear all tracking data (for privacy)
export function clearTrackingData(): void {
  if (typeof window === 'undefined') return

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
}

// Get tracking summary for API
export function getTrackingSummary() {
  return {
    visitorId: getVisitorId(),
    viewedModels: getViewedModels(),
    interests: getInterests(),
    lastVisit: getLastVisit(),
  }
}
