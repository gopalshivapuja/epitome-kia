import { Skeleton } from '@/components/ui/skeleton'

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-kia-midnight py-20 pt-36">
        <div className="container max-w-4xl mx-auto px-4">
          <Skeleton className="h-4 w-32 mb-8 bg-white/10" />
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-4 w-24 bg-white/10" />
            <Skeleton className="h-4 w-24 bg-white/10" />
            <Skeleton className="h-4 w-24 bg-white/10" />
          </div>
          <Skeleton className="h-12 w-3/4 mb-4 bg-white/10" />
          <Skeleton className="h-12 w-1/2 mb-6 bg-white/10" />
          <Skeleton className="h-6 w-full mb-2 bg-white/10" />
          <Skeleton className="h-6 w-2/3 bg-white/10" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="space-y-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="py-4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <div className="py-4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

