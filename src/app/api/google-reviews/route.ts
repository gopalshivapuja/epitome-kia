import { NextRequest, NextResponse } from 'next/server'
import { LOCATIONS } from '@/lib/company-data'

// Types for Google Places API response
interface GoogleReview {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface PlaceDetails {
  name: string
  rating: number
  user_ratings_total: number
  reviews: GoogleReview[]
}

export interface ReviewData {
  id: string
  author: string
  authorPhoto?: string
  rating: number
  text: string
  relativeTime: string
  time: number
  location: string
  locationId: string
}

export interface ReviewsResponse {
  success: boolean
  reviews: ReviewData[]
  aggregateRating: number
  totalReviews: number
  error?: string
}

// Cache reviews for 1 hour to avoid rate limits
let cachedReviews: ReviewsResponse | null = null
let cacheTime = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

async function fetchPlaceReviews(placeId: string, locationName: string, locationId: string): Promise<ReviewData[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.error('Google Places API key not configured')
    return []
  }

  try {
    // Use Places API (legacy) - requires Places API enabled in Google Cloud Console
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Failed to fetch reviews for ${locationName}:`, response.statusText)
      return []
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error(`Google Places API error for ${locationName}:`, data.status, data.error_message)
      return []
    }

    const place: PlaceDetails = data.result

    if (!place.reviews || place.reviews.length === 0) {
      return []
    }

    return place.reviews.map((review, index) => ({
      id: `${locationId}-${index}-${review.time}`,
      author: review.author_name,
      authorPhoto: review.profile_photo_url,
      rating: review.rating,
      text: review.text,
      relativeTime: review.relative_time_description,
      time: review.time,
      location: locationName,
      locationId: locationId,
    }))
  } catch (error) {
    console.error(`Error fetching reviews for ${locationName}:`, error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check cache
    const now = Date.now()
    if (cachedReviews && now - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedReviews)
    }

    // Check for specific location
    const searchParams = request.nextUrl.searchParams
    const locationId = searchParams.get('location')

    // Filter locations based on query param
    const locationsToFetch = locationId
      ? LOCATIONS.filter((loc) => loc.id === locationId && loc.placeId)
      : LOCATIONS.filter((loc) => loc.placeId)

    if (locationsToFetch.length === 0) {
      return NextResponse.json({
        success: false,
        reviews: [],
        aggregateRating: 0,
        totalReviews: 0,
        error: 'No locations with Place IDs configured',
      } as ReviewsResponse)
    }

    // Fetch reviews from all locations in parallel
    const reviewPromises = locationsToFetch.map((location) =>
      fetchPlaceReviews(location.placeId!, location.name, location.id)
    )

    const allReviewsArrays = await Promise.all(reviewPromises)
    const allReviews = allReviewsArrays.flat()

    // Sort by time (newest first) and limit
    const sortedReviews = allReviews
      .sort((a, b) => b.time - a.time)
      .slice(0, 20) // Limit to 20 most recent reviews

    // Calculate aggregate rating
    const totalRating = sortedReviews.reduce((sum, review) => sum + review.rating, 0)
    const aggregateRating =
      sortedReviews.length > 0 ? Math.round((totalRating / sortedReviews.length) * 10) / 10 : 0

    const response: ReviewsResponse = {
      success: true,
      reviews: sortedReviews,
      aggregateRating,
      totalReviews: sortedReviews.length,
    }

    // Update cache
    cachedReviews = response
    cacheTime = now

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in google-reviews API:', error)
    return NextResponse.json(
      {
        success: false,
        reviews: [],
        aggregateRating: 0,
        totalReviews: 0,
        error: 'Failed to fetch reviews',
      } as ReviewsResponse,
      { status: 500 }
    )
  }
}
