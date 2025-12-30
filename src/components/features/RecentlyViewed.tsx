'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock, ChevronRight, X } from 'lucide-react'
import { getViewedModels, type ViewedModel } from '@/lib/tracking/storage'
import { cn } from '@/lib/utils'

interface RecentlyViewedProps {
  excludeSlug?: string
  className?: string
  variant?: 'bar' | 'grid' | 'compact'
  showClear?: boolean
}

export function RecentlyViewed({
  excludeSlug,
  className,
  variant = 'bar',
  showClear = false,
}: RecentlyViewedProps) {
  const [viewedModels, setViewedModels] = useState<ViewedModel[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const models = getViewedModels().filter((m) => m.slug !== excludeSlug)
    setViewedModels(models.slice(0, 4))
  }, [excludeSlug])

  if (viewedModels.length === 0 || !isVisible) return null

  // Compact inline bar (for sticky header)
  if (variant === 'compact') {
    return (
      <div className={cn('bg-gray-100 py-2', className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="flex-shrink-0 text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Recently viewed:
            </span>
            {viewedModels.map((model) => (
              <Link
                key={model.slug}
                href={`/models/${model.slug}`}
                className="flex-shrink-0 text-xs font-medium text-gray-700 hover:text-kia-red transition-colors"
              >
                Kia {model.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Grid layout (for homepage or dedicated section)
  if (variant === 'grid') {
    return (
      <section className={cn('py-12', className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold">Recently Viewed</h2>
            </div>
            {showClear && (
              <button
                onClick={() => setIsVisible(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {viewedModels.map((model, index) => (
              <motion.div
                key={model.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/models/${model.slug}`}>
                  <div className="bg-white rounded-xl border hover:border-kia-red transition-colors overflow-hidden group">
                    <div className="relative aspect-[16/10] bg-gray-100">
                      <Image
                        src={`/models/${model.slug}.png`}
                        alt={model.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900">Kia {model.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Viewed {formatTimeAgo(model.timestamp)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default: Sticky bar at bottom
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30',
        className
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Recently Viewed</span>
          </div>

          <div className="flex-1 flex gap-3 overflow-x-auto pb-1">
            {viewedModels.map((model) => (
              <Link
                key={model.slug}
                href={`/models/${model.slug}`}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <div className="relative w-8 h-6">
                  <Image
                    src={`/models/${model.slug}.png`}
                    alt={model.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium">{model.name}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/compare"
            className="flex-shrink-0 flex items-center gap-1 text-sm text-kia-red hover:underline"
          >
            Compare
            <ChevronRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return 'last week'
}
