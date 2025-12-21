import { Skeleton } from '@/components/ui/skeleton'

export default function ModelDetailLoading() {
  return (
    <div className="py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Hero */}
        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-video rounded-lg lg:aspect-[4/3]" />
          <div className="flex flex-col justify-center space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/3" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
        </div>

        {/* Variants */}
        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-12 w-full max-w-md rounded-lg" />
        <Skeleton className="mt-6 h-96 w-full rounded-lg" />
      </div>
    </div>
  )
}
