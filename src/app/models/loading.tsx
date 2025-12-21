import { ModelCardSkeleton } from '@/components/features/model-card'

export default function ModelsLoading() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header skeleton */}
        <div className="mb-10 text-center">
          <div className="mx-auto h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="mx-auto mt-4 h-6 w-96 max-w-full animate-pulse rounded bg-muted" />
        </div>

        {/* Model Grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ModelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
