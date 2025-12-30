'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getRecommendations, type Recommendation } from '@/lib/tracking/recommendations'
import { cn } from '@/lib/utils'

// Model display info
const MODEL_INFO: Record<string, { name: string; tagline: string; price: string }> = {
  seltos: { name: 'Seltos', tagline: 'The Badass SUV', price: '10.99 Lakh' },
  sonet: { name: 'Sonet', tagline: 'The Wild Compact SUV', price: '7.99 Lakh' },
  carens: { name: 'Carens', tagline: 'The Stylish Family Mover', price: '10.99 Lakh' },
  carnival: { name: 'Carnival', tagline: 'The Grand Utility Vehicle', price: '33.00 Lakh' },
  ev6: { name: 'EV6', tagline: 'Inspiration Recharges Here', price: '60.00 Lakh' },
  ev9: { name: 'EV9', tagline: 'Movement That Inspires', price: '1.25 Cr' },
}

interface RecommendationBarProps {
  className?: string
  variant?: 'section' | 'sidebar' | 'banner'
  title?: string
  showReasons?: boolean
}

export function RecommendationBar({
  className,
  variant = 'section',
  title = 'Recommended for You',
  showReasons = true,
}: RecommendationBarProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Small delay to ensure tracking data is loaded
    const timeout = setTimeout(() => {
      const recs = getRecommendations(variant === 'sidebar' ? 2 : 3)
      setRecommendations(recs)
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timeout)
  }, [variant])

  if (isLoading || recommendations.length === 0) {
    return null
  }

  // Sidebar variant (for model detail pages)
  if (variant === 'sidebar') {
    return (
      <div className={cn('bg-gray-50 rounded-xl p-5', className)}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-kia-red" />
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec) => {
            const info = MODEL_INFO[rec.modelSlug]
            if (!info) return null

            return (
              <Link key={rec.modelSlug} href={`/models/${rec.modelSlug}`}>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors">
                  <div className="relative w-16 h-10 flex-shrink-0">
                    <Image
                      src={`/models/${rec.modelSlug}.png`}
                      alt={info.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">Kia {info.name}</h4>
                    {showReasons && rec.reasons[0] && (
                      <p className="text-xs text-gray-500 truncate">{rec.reasons[0]}</p>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  // Banner variant (for homepage hero)
  if (variant === 'banner') {
    const topRec = recommendations[0]
    const info = MODEL_INFO[topRec.modelSlug]
    if (!info) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-gradient-to-r from-kia-red to-kia-red-dark text-white rounded-xl p-4 flex items-center gap-4',
          className
        )}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <ThumbsUp className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm opacity-90">Based on your browsing</p>
          <p className="font-semibold">
            We think you&apos;ll love the Kia {info.name}
          </p>
        </div>
        <Link href={`/models/${topRec.modelSlug}`}>
          <Button variant="secondary" size="sm" className="flex-shrink-0">
            View Now
          </Button>
        </Link>
      </motion.div>
    )
  }

  // Default: Full section
  return (
    <section className={cn('py-12 bg-gray-50', className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-kia-red/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-kia-red" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-500">Based on your interests and browsing</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => {
            const info = MODEL_INFO[rec.modelSlug]
            if (!info) return null

            return (
              <motion.div
                key={rec.modelSlug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/models/${rec.modelSlug}`}>
                  <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden group">
                    {/* Match indicator */}
                    {showReasons && (
                      <div className="bg-green-50 px-4 py-2 text-xs text-green-700 flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        {rec.reasons[0] || 'Recommended for you'}
                      </div>
                    )}

                    {/* Car image */}
                    <div className="relative aspect-[16/10] bg-gradient-to-b from-gray-50 to-gray-100">
                      <Image
                        src={`/models/${rec.modelSlug}.png`}
                        alt={info.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg">Kia {info.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{info.tagline}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Starting from</span>
                        <span className="font-semibold text-kia-red">{info.price}*</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
