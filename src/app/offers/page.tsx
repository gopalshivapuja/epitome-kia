import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Tag, Calendar, ArrowRight, Car } from 'lucide-react'
import { getOffers } from '@/lib/data'

// Force dynamic rendering - no static generation at build time
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Offers & Promotions',
  description:
    'Discover exclusive offers and promotions on Kia vehicles. Limited time deals, exchange bonuses, and special financing options.',
}

interface OfferCardProps {
  offer: {
    id: string
    title: string
    slug: string
    description: string | null
    startAt: Date
    endAt: Date | null
    carModel: { id: string; name: string; slug: string } | null
    variant: { id: string; name: string; slug: string } | null
  }
}

function OfferCard({ offer }: OfferCardProps) {
  const daysRemaining = offer.endAt
    ? Math.ceil((new Date(offer.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-kia-red to-kia-red-dark p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Special Offer</span>
          </div>
          {daysRemaining !== null && daysRemaining > 0 && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              {daysRemaining} days left
            </Badge>
          )}
        </div>
        <h3 className="mt-4 text-xl font-bold">{offer.title}</h3>
      </div>

      <CardContent className="p-6">
        {offer.description && (
          <p className="mb-4 text-muted-foreground">{offer.description}</p>
        )}

        {/* Applicable to */}
        {(offer.carModel || offer.variant) && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Applicable to:</span>
            <span className="font-medium">
              {offer.carModel?.name}
              {offer.variant && ` - ${offer.variant.name}`}
            </span>
          </div>
        )}

        {/* Validity */}
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Valid:{' '}
            {new Date(offer.startAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
            {offer.endAt && (
              <>
                {' - '}
                {new Date(offer.endAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </>
            )}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {offer.carModel && (
            <Button variant="kia" size="sm" className="flex-1" asChild>
              <Link href={`/models/${offer.carModel.slug}`}>
                View Model
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href="/contact">Enquire Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function OfferCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-32 rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </Card>
  )
}

async function OffersGrid() {
  const offers = await getOffers()

  if (offers.length === 0) {
    return (
      <div className="py-12 text-center">
        <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No Active Offers</h3>
        <p className="mt-2 text-muted-foreground">
          Check back soon for exciting deals and promotions.
        </p>
        <Button variant="kia" className="mt-6" asChild>
          <Link href="/models">Explore Models</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  )
}

function OffersGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function OffersPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <Badge variant="kia" className="mb-4">
            <Tag className="mr-1 h-3 w-3" />
            Limited Time
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Offers & Promotions
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover exclusive deals on Kia vehicles. Don&apos;t miss out on these limited-time offers.
          </p>
        </div>

        {/* Offers Grid */}
        <Suspense fallback={<OffersGridSkeleton />}>
          <OffersGrid />
        </Suspense>

        {/* CTA Section */}
        <div className="mt-12 rounded-lg bg-muted p-8 text-center">
          <h2 className="text-xl font-bold">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="mt-2 text-muted-foreground">
            Contact our sales team for personalized offers and financing options.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button variant="kia" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/test-drive">Book Test Drive</Link>
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          * Offers are subject to terms and conditions. Please contact our sales team for complete
          details. Offers may vary by location and are subject to change without prior notice.
        </p>
      </div>
    </div>
  )
}
