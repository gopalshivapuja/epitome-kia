import Link from 'next/link'
import { Car } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ModelNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-12">
      <Car className="h-16 w-16 text-muted-foreground" />
      <h1 className="mt-6 text-2xl font-bold">Model Not Found</h1>
      <p className="mt-2 text-muted-foreground">
        The car model you&apos;re looking for doesn&apos;t exist or is no longer available.
      </p>
      <Button variant="kia" className="mt-6" asChild>
        <Link href="/models">View All Models</Link>
      </Button>
    </div>
  )
}
