'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Send, Loader2 } from 'lucide-react'
import { COMPANY_INFO, LOCATIONS, SOCIAL_LINKS } from '@/lib/company-data'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Thank you for subscribing!' })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container py-10">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="text-sm text-gray-400">Get the latest news, offers, and updates from Epitome Kia</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
              <Button type="submit" variant="kia" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
          {message && (
            <p className={`mt-3 text-center text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Logo variant="light" size="lg" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              {COMPANY_INFO.description}
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Models */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">Models</h3>
            <ul className="space-y-3">
              <li><Link href="/models/seltos" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Seltos</Link></li>
              <li><Link href="/models/sonet" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Sonet</Link></li>
              <li><Link href="/models/carens" className="text-gray-400 hover:text-white transition-colors text-sm">Kia Carens</Link></li>
              <li><Link href="/models/ev6" className="text-gray-400 hover:text-white transition-colors text-sm">Kia EV6</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/test-drive" className="text-gray-400 hover:text-white transition-colors text-sm">Book Test Drive</Link></li>
              <li><Link href="/service" className="text-gray-400 hover:text-white transition-colors text-sm">Service Booking</Link></li>
              <li><Link href="/emi-calculator" className="text-gray-400 hover:text-white transition-colors text-sm">EMI Calculator</Link></li>
              <li><Link href="/offers" className="text-gray-400 hover:text-white transition-colors text-sm">Current Offers</Link></li>
              <li><Link href="/compare" className="text-gray-400 hover:text-white transition-colors text-sm">Compare Models</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5">Contact</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-400">{LOCATIONS[0].address}</p>
              <a href={`tel:${LOCATIONS[0].salesPhone[0]}`} className="block text-gray-400 hover:text-white transition-colors">
                {LOCATIONS[0].salesPhone[0]}
              </a>
              <a href={`mailto:${LOCATIONS[0].email}`} className="block text-gray-400 hover:text-white transition-colors">
                {LOCATIONS[0].email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            {COMPANY_INFO.copyright}
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
