import Link from 'next/link'
import { Home, Car, Phone, Calendar, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-12 px-4">
      {/* 404 Visual */}
      <div className="relative">
        <span className="text-[120px] md:text-[180px] font-bold text-gray-100 select-none">
          404
        </span>
        <Car className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 md:h-20 md:w-20 text-kia-red" />
      </div>

      {/* Message */}
      <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
        Page Not Found
      </h1>
      <p className="mt-3 text-center text-muted-foreground max-w-md">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      {/* Primary CTA */}
      <Button variant="kia" size="lg" className="mt-8" asChild>
        <Link href="/">
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </Button>

      {/* Helpful Links */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <Link
          href="/models"
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Car className="h-6 w-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Browse Models</span>
        </Link>
        <Link
          href="/test-drive"
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Calendar className="h-6 w-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Test Drive</span>
        </Link>
        <Link
          href="/contact"
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Phone className="h-6 w-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Contact Us</span>
        </Link>
        <Link
          href="/faq"
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <HelpCircle className="h-6 w-6 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">FAQ</span>
        </Link>
      </div>
    </div>
  )
}
