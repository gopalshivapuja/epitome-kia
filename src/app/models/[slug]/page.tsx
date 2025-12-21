import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// Force dynamic rendering - no static generation at build time
export const dynamic = 'force-dynamic'
import { ArrowLeft, Calendar, Wrench, Calculator, Tag, ChevronRight } from 'lucide-react'
import { getModelBySlug, getModels } from '@/lib/data'
import { EMICalculator } from '@/components/features/emi-calculator'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const models = await getModels()
    return models.map((model) => ({ slug: model.slug }))
  } catch {
    // Return empty array if database is not available during build
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const model = await getModelBySlug(params.slug)

    if (!model) {
      return { title: 'Model Not Found' }
    }

    return {
      title: model.name,
      description:
        model.description ||
        `Explore the ${model.name} ${model.modelYear}. View specifications, variants, pricing, and book a test drive.`,
    }
  } catch {
    return { title: 'Car Model' }
  }
}

function formatSpecKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function ModelDetail({ slug }: { slug: string }) {
  const model = await getModelBySlug(slug)

  if (!model) {
    notFound()
  }

  const defaultVariant = model.variants[0]

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/models" className="hover:text-foreground">
            Models
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{model.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-10 grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 lg:aspect-[4/3]">
            <Image
              src={`/models/${model.slug}.png`}
              alt={model.name}
              fill
              className="object-contain p-4"
              priority
            />
            {model.offers.length > 0 && (
              <Badge variant="kia" className="absolute left-4 top-4 text-sm">
                <Tag className="mr-1 h-4 w-4" />
                Special Offer Available
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="mb-2 w-fit">
              {model.modelYear} Model
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {model.name}
            </h1>

            {model.description && (
              <p className="mt-4 text-lg text-muted-foreground">{model.description}</p>
            )}

            <div className="mt-6">
              {model.startingPrice ? (
                <div>
                  <span className="text-sm text-muted-foreground">Starting from</span>
                  <p className="text-3xl font-bold text-kia-red">
                    {formatPrice(model.startingPrice)}*
                  </p>
                </div>
              ) : (
                <p className="text-xl font-semibold text-muted-foreground">Price on request</p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="kia" size="lg" asChild>
                <Link href={`/test-drive?model=${model.slug}`}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Test Drive
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={`/emi-calculator?price=${model.startingPrice || ''}`}>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate EMI
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/service">
                  <Wrench className="mr-2 h-5 w-5" />
                  Service
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Active Offers */}
        {model.offers.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">Current Offers</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {model.offers.map((offer) => (
                <Card key={offer.id} className="border-kia-red/20 bg-kia-red/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg text-kia-red">
                      <Tag className="h-5 w-5" />
                      {offer.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                    {offer.endAt && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Valid till:{' '}
                        {new Date(offer.endAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Variants & Specifications */}
        <section>
          <h2 className="mb-6 text-2xl font-bold">Variants & Specifications</h2>

          {model.variants.length > 0 ? (
            <Tabs defaultValue={defaultVariant?.id} className="w-full">
              <TabsList className="mb-6 flex h-auto flex-wrap gap-2">
                {model.variants.map((variant) => (
                  <TabsTrigger
                    key={variant.id}
                    value={variant.id}
                    className="flex-col items-start gap-0.5 px-4 py-2"
                  >
                    <span className="font-medium">{variant.name}</span>
                    {variant.basePrice && (
                      <span className="text-xs text-muted-foreground">
                        {formatPrice(variant.basePrice)}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {model.variants.map((variant) => (
                <TabsContent key={variant.id} value={variant.id}>
                  <Card>
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl">
                            {model.name} {variant.name}
                          </CardTitle>
                          {variant.trimLevel && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {variant.trimLevel} Trim
                            </p>
                          )}
                        </div>
                        {variant.basePrice && (
                          <div className="text-right">
                            <span className="text-sm text-muted-foreground">Ex-showroom</span>
                            <p className="text-2xl font-bold text-kia-red">
                              {formatPrice(variant.basePrice)}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(variant.specifications).length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                          {Object.entries(variant.specifications).map(([category, specs]) => (
                            <div key={category}>
                              <h4 className="mb-3 font-semibold text-muted-foreground">
                                {category}
                              </h4>
                              <div className="space-y-2">
                                {specs.map((spec) => (
                                  <div
                                    key={spec.key}
                                    className="flex items-center justify-between border-b border-dashed pb-2 last:border-0"
                                  >
                                    <span className="text-sm text-muted-foreground">
                                      {formatSpecKey(spec.key)}
                                    </span>
                                    <span className="font-medium">
                                      {spec.value}
                                      {spec.unit && (
                                        <span className="ml-1 text-sm text-muted-foreground">
                                          {spec.unit}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Specifications coming soon. Contact us for details.
                        </p>
                      )}

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button variant="kia" asChild>
                          <Link href={`/test-drive?model=${model.slug}&variant=${variant.slug}`}>
                            Book Test Drive
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/contact">Request Quote</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p className="text-muted-foreground">No variants available at the moment.</p>
          )}
        </section>

        {/* EMI Calculator Section */}
        <section id="emi" className="mt-12 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Calculate Your EMI</h2>
          <div className="mx-auto max-w-xl">
            <EMICalculator
              initialPrice={model.startingPrice || 1500000}
              modelName={model.name}
            />
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-10">
          <Button variant="ghost" asChild>
            <Link href="/models">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Models
            </Link>
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-xs text-muted-foreground">
          * Ex-showroom prices. Actual on-road price may vary based on location, registration,
          insurance, and accessories. Specifications are subject to change without notice. Please
          contact our sales team for the latest information.
        </p>
      </div>
    </div>
  )
}

function ModelDetailSkeleton() {
  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

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

        <Skeleton className="mb-6 h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default function ModelDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<ModelDetailSkeleton />}>
      <ModelDetail slug={params.slug} />
    </Suspense>
  )
}
