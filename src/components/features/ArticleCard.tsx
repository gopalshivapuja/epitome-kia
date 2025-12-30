'use client'

import { ExternalLink, Calendar, Tag } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface CuratedArticleData {
  id: string
  title: string
  source: string
  sourceUrl: string
  summary?: string | null
  thumbnailUrl?: string | null
  publishedDate?: string | Date | null
  kiaTags: string[]
}

interface ArticleCardProps {
  article: CuratedArticleData
  className?: string
}

// Map source names to brand colors
const SOURCE_COLORS: Record<string, string> = {
  'Autocar India': 'bg-blue-100 text-blue-800',
  'Team-BHP': 'bg-green-100 text-green-800',
  'CarDekho': 'bg-purple-100 text-purple-800',
  'CarWale': 'bg-orange-100 text-orange-800',
  'Overdrive': 'bg-red-100 text-red-800',
  'ZigWheels': 'bg-yellow-100 text-yellow-800',
}

function formatDate(date: string | Date | null | undefined) {
  if (!date) return null
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const sourceColor = SOURCE_COLORS[article.source] || 'bg-gray-100 text-gray-800'
  const formattedDate = formatDate(article.publishedDate)

  return (
    <a
      href={article.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('block group', className)}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {article.thumbnailUrl ? (
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Hide broken images
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-300">
                {article.source.charAt(0)}
              </span>
            </div>
          )}

          {/* Source badge overlay */}
          <div className="absolute top-3 left-3">
            <Badge className={cn('font-medium', sourceColor)}>
              {article.source}
            </Badge>
          </div>

          {/* External link indicator */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-1.5">
              <ExternalLink className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>

        <CardHeader className="pb-2">
          {/* Date */}
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-kia-red transition-colors line-clamp-2">
            {article.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Summary */}
          {article.summary && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {article.summary}
            </p>
          )}

          {/* Tags */}
          {article.kiaTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {article.kiaTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read more CTA */}
          <div className="mt-4 flex items-center text-sm font-medium text-kia-red group-hover:gap-2 transition-all gap-1">
            Read on {article.source}
            <ExternalLink className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
