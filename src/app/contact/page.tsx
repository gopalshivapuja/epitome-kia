import { Metadata } from 'next'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ContactForm } from '@/components/forms/contact-form'
import { DealerLocator } from '@/components/features/DealerLocator'
import { ConsultationButton } from '@/components/features/ConsultationButton'
import { LOCATIONS } from '@/lib/company-data'

export const metadata: Metadata = {
  title: 'Contact Us | Epitome Kia',
  description: 'Visit our showrooms in Yelahanka, Whitefield, Avalahalli, Kolar, and Varthur. Contact Epitome Kia for inquiries.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="container text-center">
          <h1 className="text-4xl font-heading font-bold md:text-6xl text-gray-900">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Visit our showrooms or get in touch with our team. We&apos;re here to help you find your perfect Kia.
          </p>
          <div className="mt-8">
            <ConsultationButton
              size="lg"
              className="bg-kia-red hover:bg-kia-red-dark text-white"
            />
          </div>
        </div>
      </section>

      {/* Interactive Dealer Locator */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold font-heading text-center">Find a Showroom</h2>
          <DealerLocator />
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16 bg-zinc-900">
        <div className="container">
          <h2 className="mb-12 text-2xl font-bold font-heading text-center text-white">All Locations</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.map((loc) => (
              <Card key={loc.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group hover:border-kia-red transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-white">{loc.name}</h3>
                    {'label' in loc && (
                      <span className="text-xs bg-kia-red text-white px-2 py-1 rounded-full">{loc.label}</span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-kia-red shrink-0 mt-0.5" />
                      <span className="text-gray-400">{loc.address}</span>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-kia-red shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-500 text-xs uppercase">Sales</span>
                        {loc.salesPhone.map((p) => (
                          <a key={p} href={`tel:${p}`} className="text-gray-300 hover:text-white transition-colors">
                            {p}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-kia-red shrink-0" />
                      <a href={`mailto:${loc.email}`} className="text-gray-300 hover:text-white transition-colors">
                        {loc.email}
                      </a>
                    </div>
                  </div>

                  {'mapUrl' in loc && (
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-sm text-kia-red hover:underline"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold font-heading text-gray-900">Send us a Message</h2>
            <p className="text-gray-600 mt-2">Have a question? We&apos;d love to hear from you.</p>
          </div>
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
