'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PriceAlertButtonProps {
  modelSlug?: string
  modelName?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function PriceAlertButton({
  modelSlug,
  modelName,
  variant = 'outline',
  size = 'default',
  className,
}: PriceAlertButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [alertType, setAlertType] = useState<'price_drop' | 'new_offer' | 'availability'>('price_drop')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const alertTypes = [
    { value: 'price_drop', label: 'Price Drop', description: 'When the price decreases' },
    { value: 'new_offer', label: 'New Offers', description: 'When new offers are available' },
    { value: 'availability', label: 'Availability', description: 'When this model is in stock' },
  ] as const

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          modelSlug,
          alertType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          setEmail('')
        }, 2000)
      } else {
        setError(data.error || 'Failed to create alert')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Bell className="h-4 w-4 mr-2" />
        {size !== 'icon' && 'Get Price Alert'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => !isLoading && setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
            >
              {/* Close button */}
              <button
                onClick={() => !isLoading && setIsOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>

              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Alert Created!
                  </h3>
                  <p className="text-gray-500">
                    We&apos;ll notify you at {email}
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-full bg-kia-red/10 flex items-center justify-center mb-4">
                      <Bell className="h-6 w-6 text-kia-red" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Set Price Alert
                    </h3>
                    <p className="text-gray-500 mt-1">
                      {modelName
                        ? `Get notified about the Kia ${modelName}`
                        : 'Get notified about price changes and offers'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email input */}
                    <div>
                      <label
                        htmlFor="alert-email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        id="alert-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kia-red/30 focus:border-kia-red"
                      />
                    </div>

                    {/* Alert type selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alert Type
                      </label>
                      <div className="space-y-2">
                        {alertTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              alertType === type.value
                                ? 'border-kia-red bg-kia-red/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="alertType"
                              value={type.value}
                              checked={alertType === type.value}
                              onChange={() => setAlertType(type.value)}
                              className="sr-only"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {type.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {type.description}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                alertType === type.value
                                  ? 'border-kia-red'
                                  : 'border-gray-300'
                              }`}
                            >
                              {alertType === type.value && (
                                <div className="w-2.5 h-2.5 rounded-full bg-kia-red" />
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Error message */}
                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        {error}
                      </p>
                    )}

                    {/* Submit button */}
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full bg-kia-red hover:bg-kia-red-dark"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Alert...
                        </>
                      ) : (
                        <>
                          <Bell className="h-4 w-4 mr-2" />
                          Create Alert
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      We&apos;ll only send relevant notifications. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
