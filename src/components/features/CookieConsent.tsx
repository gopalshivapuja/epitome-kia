'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Cookie, X } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'epitome-kia-cookie-consent'

type ConsentStatus = 'accepted' | 'declined' | null

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus | 'loading'>('loading')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus
    
    if (storedConsent) {
      setConsent(storedConsent)
      setIsVisible(false)
    } else {
      setConsent(null)
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setConsent('accepted')
    setIsVisible(false)

    // Enable analytics after consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
    setConsent('declined')
    setIsVisible(false)

    // Disable analytics after decline
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      })
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  // Don't render during SSR or if consent is already given
  if (consent === 'loading' || consent !== null) {
    return null
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-500 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-kia-midnight/95 backdrop-blur-lg border-t border-white/10 text-white">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Icon and Text */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-kia-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-kia-red" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">We value your privacy</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze site traffic, and 
                  provide personalized content. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.{' '}
                  <Link href="/privacy" className="text-kia-red hover:underline">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 ml-13 md:ml-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="bg-kia-red hover:bg-kia-red-dark text-white"
              >
                Accept All
              </Button>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white transition-colors md:hidden"
                aria-label="Close cookie banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add gtag type declaration
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

