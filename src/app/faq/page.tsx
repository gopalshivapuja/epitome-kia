import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, HelpCircle, Phone, Mail } from 'lucide-react'
import { getFAQs } from '@/lib/data'
import { LOCATIONS } from '@/lib/company-data'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Kia vehicles, test drives, service, financing, and more at Epitome Kia.',
}

// Default FAQs if none exist in database
const DEFAULT_FAQS = [
  {
    id: '1',
    question: 'How can I book a test drive?',
    answer: 'You can book a test drive through our website by visiting the Test Drive page, or by calling our showroom directly. Our team will arrange a convenient time for you to experience the vehicle of your choice.',
  },
  {
    id: '2',
    question: 'What documents are required for purchasing a new Kia vehicle?',
    answer: 'You will need valid ID proof (Aadhaar/Passport), address proof, PAN card, passport-size photographs, and income proof (salary slips/ITR) if availing finance. Our sales team will guide you through the complete documentation process.',
  },
  {
    id: '3',
    question: 'What warranty does Kia offer?',
    answer: 'Kia offers an industry-leading warranty package: 3 years unlimited km warranty, 3 years roadside assistance, and up to 5 years extended warranty available. Specific coverage may vary by model.',
  },
  {
    id: '4',
    question: 'How can I schedule a service appointment?',
    answer: 'You can schedule service appointments through our website\'s Service page, by calling our service center, or through the Kia Connect app. We offer convenient pickup and drop services as well.',
  },
  {
    id: '5',
    question: 'What financing options are available?',
    answer: 'We partner with leading banks and NBFCs to offer competitive financing options with flexible EMI plans. Our finance team can help you find the best rates based on your requirements. Use our EMI Calculator for estimates.',
  },
  {
    id: '6',
    question: 'Do you offer vehicle exchange programs?',
    answer: 'Yes, we accept vehicle exchanges. Bring your existing car for evaluation, and we\'ll offer you the best trade-in value. This amount can be adjusted against your new Kia purchase.',
  },
  {
    id: '7',
    question: 'What are the available payment methods?',
    answer: 'We accept multiple payment methods including cash, cheque, NEFT/RTGS, credit/debit cards, and financing. For large transactions, bank transfers are recommended.',
  },
  {
    id: '8',
    question: 'How long does delivery take after booking?',
    answer: 'Delivery timelines vary by model and variant. Popular variants are usually available within 1-4 weeks. For specific color and variant combinations, it may take 4-8 weeks. We\'ll provide exact timelines at the time of booking.',
  },
]

export default async function FAQPage() {
  const dbFaqs = await getFAQs()
  const faqs = dbFaqs.length > 0 ? dbFaqs : DEFAULT_FAQS

  return (
    <div className="py-8 md:py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">FAQ</span>
        </nav>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-kia-red/10">
            <HelpCircle className="h-8 w-8 text-kia-red" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-muted-foreground">
            Find answers to common questions about our vehicles and services
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                <span className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kia-red/10 text-xs font-semibold text-kia-red">
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-9 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions */}
        <Card className="mt-12 border-kia-red/20 bg-gradient-to-br from-kia-red/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Still have questions?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-center text-muted-foreground">
              Our team is here to help. Reach out to us directly.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="kia" asChild>
                <a href={`tel:${LOCATIONS[0]?.salesPhone?.[0] || '+919876543210'}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${LOCATIONS[0]?.email || 'info@epitomekia.in'}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <Link
            href="/test-drive"
            className="rounded-lg border p-4 text-center transition-colors hover:border-kia-red hover:bg-kia-red/5"
          >
            <h3 className="font-semibold">Book Test Drive</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Experience Kia vehicles firsthand
            </p>
          </Link>
          <Link
            href="/emi-calculator"
            className="rounded-lg border p-4 text-center transition-colors hover:border-kia-red hover:bg-kia-red/5"
          >
            <h3 className="font-semibold">EMI Calculator</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Plan your financing options
            </p>
          </Link>
          <Link
            href="/service"
            className="rounded-lg border p-4 text-center transition-colors hover:border-kia-red hover:bg-kia-red/5"
          >
            <h3 className="font-semibold">Service Booking</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedule vehicle maintenance
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
