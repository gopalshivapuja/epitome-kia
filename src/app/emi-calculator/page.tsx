import { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, Car, Phone, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EMICalculator } from '@/components/features/emi-calculator'
import { getModels } from '@/lib/data'

// Force dynamic rendering - no static generation at build time
export const dynamic = 'force-dynamic'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'EMI Calculator',
  description:
    'Calculate your car loan EMI with our easy-to-use calculator. Plan your Kia purchase with customizable down payment, tenure, and interest rates.',
}

async function QuickModelLinks() {
  const models = await getModels()

  if (models.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Car className="h-5 w-5 text-kia-red" />
          Calculate for a Specific Model
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {models.slice(0, 4).map((model) => (
            <Link
              key={model.id}
              href={`/models/${model.slug}#emi`}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <div>
                <p className="font-medium">{model.name}</p>
                {model.startingPrice && (
                  <p className="text-sm text-muted-foreground">
                    From {formatPrice(model.startingPrice)}
                  </p>
                )}
              </div>
              <Badge variant="secondary">{model.modelYear}</Badge>
            </Link>
          ))}
        </div>
        {models.length > 4 && (
          <Button variant="link" className="mt-4 w-full" asChild>
            <Link href="/models">View All Models</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default function EMICalculatorPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Header */}
        <div className="mb-10 text-center">
          <Badge variant="kia" className="mb-4">
            <Calculator className="mr-1 h-3 w-3" />
            Financial Tools
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">EMI Calculator</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Plan your Kia purchase with our easy-to-use EMI calculator. Adjust the loan parameters
            to find a payment plan that suits your budget.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
          {/* Calculator */}
          <div className="lg:col-span-3">
            <EMICalculator />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-2">
            {/* Quick Links */}
            <QuickModelLinks />

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HelpCircle className="h-5 w-5 text-kia-red" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Our finance team can help you find the best loan options for your budget.
                </p>
                <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <Phone className="h-5 w-5 text-kia-red" />
                  <div>
                    <p className="text-xs text-muted-foreground">Call us at</p>
                    <p className="font-semibold">1800-XXX-XXXX</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Contact Finance Team</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Loan Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-bold text-kia-red">1.</span>
                    Higher down payment means lower EMI and less interest paid overall.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-kia-red">2.</span>
                    Shorter tenure saves money on interest but increases monthly EMI.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-kia-red">3.</span>
                    Compare rates from multiple banks to get the best deal.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-kia-red">4.</span>A good credit score can help you get lower interest rates.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mx-auto mt-12 max-w-3xl rounded-lg border p-6">
          <h3 className="mb-3 font-bold">Important Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            The EMI calculations shown are indicative and for reference purposes only. Actual EMI
            may vary based on the bank or financial institution, your credit profile, and other
            factors. The interest rates used are representative and may differ from current market
            rates. This calculator does not constitute a loan offer or approval. Please contact our
            finance team or your preferred bank for accurate quotations and loan eligibility.
            Processing fees, insurance, and other charges are not included in the calculation.
          </p>
        </div>
      </div>
    </div>
  )
}
