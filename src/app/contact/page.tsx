import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { ContactForm } from '@/components/forms/contact-form'
import { DealerLocator } from '@/components/features/DealerLocator'

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
        </div>
      </section>

      {/* Dealer Locator with Google Maps */}
      <section className="py-16">
        <div className="container">
          <DealerLocator />
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
