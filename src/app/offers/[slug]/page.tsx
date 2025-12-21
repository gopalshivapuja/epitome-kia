import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Tag, Calendar, Car, ArrowRight, Clock, AlertCircle } from 'lucide-react'
import { getOfferBySlug, getOffers } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const offers = await getOffers()
    return offers.map((offer) => ({ slug: offer.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const offer = await getOfferBySlug(params.slug)

    if (!offer) {
      return { title: 'Offer Not Found' }
    }

    return {
      title: offer.title,
      description:
        offer.description ||
        `Special offer on Kia vehicles. ${offer.carModel ? `Available on ${offer.carModel.name}.` : ''} Limited time offer.`,
    }
  } catch {
    return { title: 'Special Offer' }
  }
}

export default async function OfferDetailPage({ params }: Props) {
  const offer = await getOfferBySlug(params.slug)

  if (!offer) {
    notFound()
  }

  const daysRemaining = offer.endAt
    ? Math.ceil((new Date(offer.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0

  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/offers"
            className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
            Back to Offers
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="kia">
              <Tag className="mr-1 h-3 w-3" />
              Special Offer
            </Badge>
            {daysRemaining !== null && daysRemaining > 0 && (
              <Badge variant={isExpiringSoon ? 'destructive' : 'secondary'}>
                <Clock className="mr-1 h-3 w-3" />
                {daysRemaining} days left
              </Badge>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{offer.title}</h1>

          {offer.description && (
            <p className="mt-4 text-lg text-muted-foreground">{offer.description}</p>
          )}
        </div>

        {/* Offer Details Card */}
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-kia-red to-kia-red-dark text-white">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Offer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Validity */}
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Validity Period</p>
                <p className="text-muted-foreground">
                  {new Date(offer.startAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {offer.endAt && (
                    <>
                      {' - '}
                      {new Date(offer.endAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </>
                  )}
                  {!offer.endAt && ' onwards'}
                </p>
              </div>
            </div>

            {/* Applicable Models */}
            {offer.carModel && (
              <div className="flex items-start gap-3">
                <Car className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Applicable Vehicle</p>
                  <p className="text-muted-foreground">
                    {offer.carModel.name}
                    {offer.variant && ` - ${offer.variant.name}`}
                    {offer.variant?.basePrice && (
                      <span className="ml-2 font-medium text-kia-red">
                        {formatPrice(offer.variant.basePrice)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Expiry Warning */}
            {isExpiringSoon && (
              <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Offer Ending Soon!</p>
                  <p className="text-sm text-muted-foreground">
                    This offer expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. Don&apos;t miss out!
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applicable Model Card */}
        {offer.carModel && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Eligible Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold">{offer.carModel.name}</h3>
                  <p className="text-muted-foreground">
                    {offer.carModel.modelYear} Model
                    {offer.variant && ` - ${offer.variant.name} variant`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="kia" asChild>
                    <Link href={`/models/${offer.carModel.slug}`}>
                      View Model
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/test-drive?model=${offer.carModel.slug}`}>Book Test Drive</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <div className="rounded-lg bg-muted p-6 text-center">
          <h2 className="text-xl font-bold">Interested in this offer?</h2>
          <p className="mt-2 text-muted-foreground">
            Contact our sales team to learn more about this offer and check your eligibility.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button variant="kia" size="lg" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/emi-calculator">Calculate EMI</Link>
            </Button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-8 rounded-lg border p-6">
          <h3 className="mb-4 font-bold">Terms & Conditions</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• This offer is valid for a limited period only and subject to availability.</li>
            <li>• Offer applicable on selected models and variants as specified.</li>
            <li>• Cannot be combined with other promotional offers unless specified.</li>
            <li>• Dealer participation may vary. Please confirm with your local dealer.</li>
            <li>• Kia Motors reserves the right to modify or withdraw this offer at any time.</li>
            <li>• Additional terms and conditions may apply. Contact dealer for details.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
