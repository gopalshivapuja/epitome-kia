'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ReviewData, ReviewsResponse } from '@/app/api/google-reviews/route'

interface GoogleReviewsProps {
    locationId?: string // Optional: filter by specific location
    maxReviews?: number
    autoPlay?: boolean
    autoPlayInterval?: number
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={cn(
                        'h-4 w-4',
                        star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                    )}
                />
            ))}
        </div>
    )
}

function ReviewCard({ review }: { review: ReviewData }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const maxLength = 200
    const shouldTruncate = review.text.length > maxLength

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                {review.authorPhoto ? (
                    <Image
                        src={review.authorPhoto}
                        alt={review.author}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-kia-red/10 flex items-center justify-center">
                        <span className="text-kia-red font-semibold text-lg">
                            {review.author.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{review.author}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-gray-500">{review.relativeTime}</span>
                    </div>
                </div>
                <Quote className="h-6 w-6 text-gray-200 flex-shrink-0" />
            </div>

            {/* Review Text */}
            <div className="flex-1">
                <p className="text-gray-600 text-sm leading-relaxed">
                    {shouldTruncate && !isExpanded
                        ? `${review.text.slice(0, maxLength)}...`
                        : review.text}
                </p>
                {shouldTruncate && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-kia-red text-sm font-medium mt-2 hover:underline"
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Location Badge */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Epitome Kia {review.location}</span>
                </div>
            </div>
        </div>
    )
}

export function GoogleReviews({
    locationId,
    maxReviews = 10,
    autoPlay = true,
    autoPlayInterval = 5000,
}: GoogleReviewsProps) {
    const [reviews, setReviews] = useState<ReviewData[]>([])
    const [aggregateRating, setAggregateRating] = useState(0)
    const [totalReviews, setTotalReviews] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        async function fetchReviews() {
            try {
                const url = locationId
                    ? `/api/google-reviews?location=${locationId}`
                    : '/api/google-reviews'

                const response = await fetch(url)
                const data: ReviewsResponse = await response.json()

                if (data.success) {
                    setReviews(data.reviews.slice(0, maxReviews))
                    setAggregateRating(data.aggregateRating)
                    setTotalReviews(data.totalReviews)
                } else {
                    setError(data.error || 'Failed to load reviews')
                }
            } catch (err) {
                setError('Failed to load reviews')
                console.error('Error fetching reviews:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [locationId, maxReviews])

    // Auto-play carousel
    useEffect(() => {
        if (!autoPlay || reviews.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % Math.ceil(reviews.length / 3))
        }, autoPlayInterval)

        return () => clearInterval(interval)
    }, [autoPlay, autoPlayInterval, reviews.length])

    const totalSlides = Math.ceil(reviews.length / 3)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    }

    // Don't render if loading or no reviews
    if (loading) {
        return (
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Customers Say
                        </h2>
                        <div className="flex justify-center">
                            <div className="animate-pulse flex space-x-4">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                                    <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (error || reviews.length === 0) {
        // Return null or a fallback UI when there are no reviews
        return null
    }

    return (
        <section className="py-16 md:py-20 bg-gray-50">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        See why thousands of customers trust Epitome Kia for their automotive needs
                    </p>

                    {/* Aggregate Rating */}
                    <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm">
                        <div className="flex items-center gap-1">
                            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                            <span className="text-2xl font-bold text-gray-900">
                                {aggregateRating.toFixed(1)}
                            </span>
                        </div>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <span className="text-gray-600 text-sm">
                            Based on {totalReviews} reviews across all locations
                        </span>
                    </div>
                </div>

                {/* Reviews Carousel */}
                <div className="relative">
                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="grid md:grid-cols-3 gap-6"
                            >
                                {reviews
                                    .slice(currentIndex * 3, currentIndex * 3 + 3)
                                    .map((review) => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors hidden md:block"
                                aria-label="Previous reviews"
                            >
                                <ChevronLeft className="h-6 w-6 text-gray-600" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors hidden md:block"
                                aria-label="Next reviews"
                            >
                                <ChevronRight className="h-6 w-6 text-gray-600" />
                            </button>
                        </>
                    )}
                </div>

                {/* Dots Indicator */}
                {totalSlides > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-all',
                                    index === currentIndex
                                        ? 'bg-kia-red w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Google Attribution */}
                <div className="text-center mt-8">
                    <a
                        href="https://www.google.com/search?q=Epitome+Kia+Bangalore+reviews"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        View all reviews on Google
                    </a>
                </div>
            </div>
        </section>
    )
}
