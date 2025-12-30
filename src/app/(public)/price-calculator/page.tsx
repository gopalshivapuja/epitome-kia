import { Metadata } from 'next'
import { GlassHeader } from '@/components/layout/GlassHeader'
import { Footer } from '@/components/layout/footer'
import { OnRoadPriceCalculator } from '@/components/features/OnRoadPriceCalculator'
import { COMPANY_INFO } from '@/lib/company-data'

export const metadata: Metadata = {
  title: 'On-Road Price Calculator | Epitome Kia Bangalore',
  description: 'Calculate the exact on-road price for Kia cars in Bangalore, Karnataka. Includes road tax, registration, insurance, and all charges.',
  keywords: 'Kia on road price, Kia price calculator, Karnataka road tax, Bangalore car price, Kia Seltos price, Kia Sonet price',
}

export default function PriceCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <GlassHeader />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              On-Road Price Calculator
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Get the exact on-road price for your dream Kia in Karnataka.
              Includes road tax, registration, insurance, and all applicable charges.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calculator */}
            <div className="lg:col-span-2">
              <OnRoadPriceCalculator />
            </div>

            {/* Side Info */}
            <div className="space-y-6">
              {/* Karnataka Tax Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Karnataka Road Tax Rates
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Below ₹5 Lakh</span>
                    <span className="font-medium">13%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">₹5 - 10 Lakh</span>
                    <span className="font-medium">14%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">₹10 - 15 Lakh</span>
                    <span className="font-medium">17%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">₹15 - 20 Lakh</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Above ₹20 Lakh</span>
                    <span className="font-medium">20%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * Life Time Tax (LTT) as per Karnataka Motor Vehicles Taxation Act
                </p>
              </div>

              {/* Other Charges */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Other Charges
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">RTO Registration</span>
                    <span className="font-medium">₹950</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HSRP (Number Plate)</span>
                    <span className="font-medium">₹600</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">FASTag</span>
                    <span className="font-medium">₹500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hypothecation (if financed)</span>
                    <span className="font-medium">₹1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TCS (above ₹10L)</span>
                    <span className="font-medium">1%</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-gray-900 text-white rounded-xl p-5">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Our sales team can provide you with the exact quote for your requirements.
                </p>
                <a
                  href="tel:08047363737"
                  className="block w-full text-center py-2.5 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
                >
                  Call 080-4736-3737
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMI Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Calculate Your EMI
            </h2>
            <p className="mt-2 text-gray-600">
              Want to know your monthly payments? Use our EMI calculator to plan your purchase.
            </p>
            <a
              href="/emi-calculator"
              className="inline-flex items-center mt-4 text-gray-900 font-medium hover:underline"
            >
              Go to EMI Calculator →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
