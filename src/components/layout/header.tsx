'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

const navigation = [
  { name: 'Models', href: '/models' },
  { name: 'Offers', href: '/offers' },
  { name: 'Test Drive', href: '/test-drive' },
  { name: 'Service', href: '/service' },
  { name: 'EMI Calculator', href: '/emi-calculator' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden border-b bg-kia-black text-white md:block">
        <div className="container flex h-10 items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-kia-red">
              <Phone className="h-4 w-4" />
              <span>+91 123 456 7890</span>
            </a>
            <a href="/locations" className="flex items-center gap-2 hover:text-kia-red">
              <MapPin className="h-4 w-4" />
              <span>Find a Dealer</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-kia-red">
              Dealer Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Logo variant="dark" size="lg" />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-kia-red"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden items-center gap-4 lg:flex">
          <Button variant="kia" asChild>
            <Link href="/test-drive">Book Test Drive</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden',
          mobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="space-y-1 border-t px-4 pb-4 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-kia-red"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
            <Button variant="kia" className="w-full" asChild>
              <Link href="/test-drive">Book Test Drive</Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2 pt-4 text-sm text-muted-foreground">
            <a href="tel:+911234567890" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+91 123 456 7890</span>
            </a>
            <a href="/locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Find a Dealer</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
