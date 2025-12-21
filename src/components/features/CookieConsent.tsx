'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const COOKIE_CONSENT_KEY = 'epitome-kia-cookie-consent'

type ConsentStatus = 'accepted' | 'declined' | null

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus | 'loading'>('loading')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus

    if (storedConsent) {
      setConsent(storedConsent)
      setIsVisible(false)
    } else {
      setConsent(null)
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setConsent('accepted')
    setIsVisible(false)

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

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      })
    }
  }

  if (consent === 'loading' || consent !== null) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[9999] transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <p className="text-sm text-gray-600 leading-relaxed">
          We use cookies to improve your experience.{' '}
          <Link href="/privacy" className="text-gray-900 underline underline-offset-2 hover:text-gray-600">
            Learn more
          </Link>
        </p>

        <div className="flex gap-3 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDecline}
            className="flex-1"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="flex-1"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
