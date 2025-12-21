import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Car, Wrench, Calculator, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getFeaturedModels } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

const features = [
  {
    title: 'Explore Models',
    description: 'Discover the complete range of Kia vehicles with detailed specs and features.',
    icon: Car,
    href: '/models',
    cta: 'View All Models',
  },
  {
    title: 'Book a Test Drive',
    description: 'Experience the Kia difference. Schedule a test drive at your convenience.',
    icon: Calendar,
    href: '/test-drive',
    cta: 'Book Now',
  },
  {
    title: 'Service & Maintenance',
    description: 'Keep your Kia running smoothly with our expert service team.',
    icon: Wrench,
    href: '/service',
    cta: 'Book Service',
  },
  {
    title: 'EMI Calculator',
    description: 'Plan your purchase with our easy-to-use EMI calculator.',
    icon: Calculator,
    href: '/emi-calculator',
    cta: 'Calculate EMI',
  },
]

async function FeaturedModels() {
  const models = await getFeaturedModels(3)

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <Card key={model.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
          <div className="relative aspect-video bg-muted">
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Car className="h-20 w-20 text-gray-400 transition-transform group-hover:scale-110" />
            </div>
            {model.hasActiveOffers && (
              <Badge variant="kia" className="absolute left-3 top-3">
                <Tag className="mr-1 h-3 w-3" />
                Offer
              </Badge>
            )}
            <Badge variant="secondary" className="absolute right-3 top-3">
              {model.modelYear}
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="group-hover:text-kia-red">{model.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {model.description || 'Premium Kia vehicle'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {model.startingPrice ? (
              <p className="text-lg font-semibold text-kia-red">
                Starting {formatPrice(model.startingPrice)}*
              </p>
            ) : (
              <p className="text-lg font-semibold text-muted-foreground">Price on request</p>
            )}
            <div className="mt-4 flex gap-2">
              <Button variant="kia" size="sm" asChild>
                <Link href={`/models/${model.slug}`}>View Details</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/test-drive?model=${model.slug}`}>Test Drive</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function FeaturedModelsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-1/2" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-kia-black to-gray-900 py-20 text-white md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Movement that inspires
            </h1>
            <p className="mt-6 text-lg text-gray-300 md:text-xl">
              Welcome to Epitome Kia. Discover innovative vehicles designed for the modern world.
              Experience quality, technology, and style in every journey.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="kia" size="xl" asChild>
                <Link href="/models">
                  Explore Models
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white hover:text-kia-black"
                asChild
              >
                <Link href="/test-drive">Book Test Drive</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Models */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Models</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore our most popular Kia vehicles
            </p>
          </div>
          <div className="mt-12">
            <Suspense fallback={<FeaturedModelsSkeleton />}>
              <FeaturedModels />
            </Suspense>
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/models">
                View All Models
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How Can We Help?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need for your Kia journey
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-kia-red/10">
                    <feature.icon className="h-6 w-6 text-kia-red" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{feature.description}</CardDescription>
                  <Button variant="link" className="text-kia-red" asChild>
                    <Link href={feature.href}>
                      {feature.cta}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-kia-red py-16 text-white md:py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Experience Kia?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Book a test drive today and discover why Kia is the smart choice for modern drivers.
            Our team is ready to help you find your perfect vehicle.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-kia-red hover:bg-gray-100"
              asChild
            >
              <Link href="/test-drive">
                Book Test Drive
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-kia-red"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
