import Link from 'next/link'
import Image from 'next/image'
import { Tag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface ModelCardProps {
  model: {
    id: string
    name: string
    slug: string
    modelYear: number
    description: string | null
    startingPrice: number | null
    hasActiveOffers: boolean
    variantCount?: number
  }
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Model Image */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={`/models/${model.slug}.png`}
          alt={model.name}
          fill
          className="object-contain p-4 transition-transform group-hover:scale-105"
        />
        {model.hasActiveOffers && (
          <Badge variant="kia" className="absolute left-3 top-3">
            <Tag className="mr-1 h-3 w-3" />
            Special Offer
          </Badge>
        )}
        <Badge variant="secondary" className="absolute right-3 top-3">
          {model.modelYear}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl group-hover:text-kia-red">{model.name}</CardTitle>
            <CardDescription className="mt-1">
              {model.variantCount
                ? `${model.variantCount} variant${model.variantCount > 1 ? 's' : ''} available`
                : 'Multiple variants available'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {model.description && (
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{model.description}</p>
        )}

        <div className="mb-4">
          {model.startingPrice ? (
            <div>
              <span className="text-sm text-muted-foreground">Starting from</span>
              <p className="text-xl font-bold text-kia-red">
                {formatPrice(model.startingPrice)}*
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-muted-foreground">Price on request</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="kia" size="sm" className="flex-1" asChild>
            <Link href={`/models/${model.slug}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/test-drive?model=${model.slug}`}>Test Drive</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function ModelCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video animate-pulse bg-muted" />
      <CardHeader className="pb-2">
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
        </div>
        <div className="mb-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-7 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-9 flex-1 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}
