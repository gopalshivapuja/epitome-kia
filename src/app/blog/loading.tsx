import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function BlogLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <div className="bg-kia-midnight py-20 pt-36">
        <div className="container max-w-6xl mx-auto px-4">
          <Skeleton className="h-8 w-48 mb-6 bg-white/10" />
          <Skeleton className="h-14 w-96 mb-4 bg-white/10" />
          <Skeleton className="h-14 w-72 mb-6 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-2xl bg-white/10" />
        </div>
      </div>

      {/* Posts Grid Skeleton */}
      <div className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Featured Post Skeleton */}
          <Card className="mb-12">
            <div className="md:flex">
              <Skeleton className="md:w-1/2 h-64" />
              <div className="md:w-1/2 p-8">
                <div className="flex gap-4 mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
          </Card>

          {/* Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48" />
                <CardHeader>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-1" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-5 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

