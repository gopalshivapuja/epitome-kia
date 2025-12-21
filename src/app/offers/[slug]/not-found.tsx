import Link from 'next/link'
import { Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfferNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-12">
      <Tag className="h-16 w-16 text-muted-foreground" />
      <h1 className="mt-6 text-2xl font-bold">Offer Not Found</h1>
      <p className="mt-2 text-center text-muted-foreground">
        This offer may have expired or is no longer available.
      </p>
      <div className="mt-6 flex gap-4">
        <Button variant="kia" asChild>
          <Link href="/offers">View All Offers</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/models">Explore Models</Link>
        </Button>
      </div>
    </div>
  )
}
