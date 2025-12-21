import { Suspense } from 'react'
import { Metadata } from 'next'
import { getModels } from '@/lib/data'
import { ModelCard, ModelCardSkeleton } from '@/components/features/model-card'

export const metadata: Metadata = {
  title: 'Car Models',
  description:
    'Explore the complete range of Kia vehicles. Find your perfect car with detailed specs, pricing, and features.',
}

async function ModelGrid() {
  const models = await getModels()

  if (models.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">No models available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  )
}

function ModelGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ModelCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function ModelsPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Explore Kia Models</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the perfect Kia for your lifestyle. From compact SUVs to electric vehicles.
          </p>
        </div>

        {/* Model Grid */}
        <Suspense fallback={<ModelGridSkeleton />}>
          <ModelGrid />
        </Suspense>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          * Ex-showroom prices. Actual prices may vary based on location, variant, and applicable
          offers. Contact our sales team for accurate pricing.
        </p>
      </div>
    </div>
  )
}
