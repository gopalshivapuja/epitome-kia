import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
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
    <div className="group block relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Model Image */}
      <div className="relative aspect-[4/3] bg-gray-50">
        <Image
          src={`/models/${model.slug}.png`}
          alt={model.name}
          fill
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        {/* Model Name */}
        <h3 className="text-xl font-heading font-semibold text-gray-900">
          {model.name}
        </h3>

        {/* Price */}
        <div className="mt-2">
          {model.startingPrice ? (
            <p className="text-gray-500">
              From {formatPrice(model.startingPrice)}
            </p>
          ) : (
            <p className="text-gray-500">Price on request</p>
          )}
        </div>

        {/* CTA Buttons - Tesla style */}
        <div className="mt-6 flex gap-3">
          <Button
            size="sm"
            className="flex-1"
            asChild
          >
            <Link href={`/models/${model.slug}`}>
              Order Now
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <Link href={`/test-drive?model=${model.slug}`}>
              Test Drive
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function ModelCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 mx-auto bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-1/2 mx-auto bg-gray-100 rounded animate-pulse" />
        <div className="flex gap-3 pt-2">
          <div className="h-9 flex-1 bg-gray-100 rounded animate-pulse" />
          <div className="h-9 flex-1 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
