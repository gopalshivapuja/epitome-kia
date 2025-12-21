import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

function OfferCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-32 rounded-none" />
      <div className="space-y-4 p-6">
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

export default function OffersLoading() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <Skeleton className="mx-auto h-6 w-24" />
          <Skeleton className="mx-auto mt-4 h-10 w-64" />
          <Skeleton className="mx-auto mt-4 h-6 w-96 max-w-full" />
        </div>

        {/* Offers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <OfferCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
