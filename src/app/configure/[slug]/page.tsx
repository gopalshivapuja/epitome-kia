'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Share2,
  Download,
  Calendar,
  MessageCircle,
  Copy,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  MODEL_CONFIGS,
  ACCESSORIES,
  getAccessoriesForModel,
  formatPrice,
  calculateConfiguration,
  generateShareCode,
  type ColorOption,
  type VariantOption,
  type AccessoryOption,
} from '@/lib/configurator'
import { cn } from '@/lib/utils'

type ConfigStep = 'variant' | 'color' | 'accessories' | 'summary'

export default function ConfiguratorPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const modelConfig = MODEL_CONFIGS[slug]

  // Redirect if model not found
  useEffect(() => {
    if (!modelConfig) {
      router.push('/configure')
    }
  }, [modelConfig, router])

  // Configuration state
  const [currentStep, setCurrentStep] = useState<ConfigStep>('variant')
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null)
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null)
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryOption[]>([])
  const [shareCode, setShareCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Get model-specific accessories
  const modelAccessories = useMemo(() => {
    if (!modelConfig) return []
    return getAccessoriesForModel(slug)
  }, [slug, modelConfig])

  // Calculate configuration summary
  const configuration = useMemo(() => {
    if (!selectedVariant || !selectedColor) return null
    return calculateConfiguration(
      slug,
      selectedVariant.id,
      selectedColor.code,
      selectedAccessories.map((a) => a.id)
    )
  }, [slug, selectedVariant, selectedColor, selectedAccessories])

  // Group accessories by category (must be before early return)
  const accessoriesByCategory = useMemo(() => {
    const grouped: Record<string, AccessoryOption[]> = {
      exterior: [],
      interior: [],
      protection: [],
      technology: [],
    }
    modelAccessories.forEach((acc) => {
      if (grouped[acc.category]) {
        grouped[acc.category].push(acc)
      }
    })
    return grouped
  }, [modelAccessories])

  if (!modelConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Loading...</p>
        </div>
      </div>
    )
  }

  const steps: { key: ConfigStep; label: string }[] = [
    { key: 'variant', label: 'Variant' },
    { key: 'color', label: 'Color' },
    { key: 'accessories', label: 'Accessories' },
    { key: 'summary', label: 'Summary' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case 'variant':
        return selectedVariant !== null
      case 'color':
        return selectedColor !== null
      case 'accessories':
        return true // Accessories are optional
      case 'summary':
        return true
      default:
        return false
    }
  }

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key)
    }
  }

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key)
    }
  }

  const toggleAccessory = (accessory: AccessoryOption) => {
    setSelectedAccessories((prev) => {
      const exists = prev.find((a) => a.id === accessory.id)
      if (exists) {
        return prev.filter((a) => a.id !== accessory.id)
      }
      return [...prev, accessory]
    })
  }

  const handleShare = async () => {
    const code = generateShareCode()
    setShareCode(code)
    // In production, save configuration to database here
  }

  const copyShareLink = async () => {
    if (!shareCode) return
    const url = `${window.location.origin}/configure/${slug}?config=${shareCode}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/configure"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back to Models</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <h1 className="font-semibold">
                Configure Kia {modelConfig.name}
              </h1>
            </div>

            {/* Step Progress */}
            <div className="hidden md:flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.key} className="flex items-center">
                  <button
                    onClick={() => {
                      // Allow clicking on completed steps
                      if (index <= currentStepIndex) {
                        setCurrentStep(step.key)
                      }
                    }}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors',
                      currentStep === step.key
                        ? 'bg-kia-red text-white'
                        : index < currentStepIndex
                        ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400'
                    )}
                    disabled={index > currentStepIndex}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="w-4 text-center">{index + 1}</span>
                    )}
                    <span>{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-300 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Configuration Options */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Variant Selection */}
              {currentStep === 'variant' && (
                <motion.div
                  key="variant"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Choose Your Variant</h2>
                  <div className="space-y-4">
                    {modelConfig.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          'w-full p-5 rounded-xl border-2 text-left transition-all',
                          selectedVariant?.id === variant.id
                            ? 'border-kia-red bg-kia-red/5'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        )}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">{variant.name}</h3>
                            <p className="text-sm text-gray-500">
                              {variant.engine} | {variant.transmission}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-kia-red">
                              {formatPrice(variant.price)}
                            </p>
                            {selectedVariant && variant.price > selectedVariant.price && (
                              <p className="text-xs text-gray-500">
                                +{formatPrice(variant.price - selectedVariant.price)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variant.features.slice(0, 4).map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                            >
                              {feature}
                            </span>
                          ))}
                          {variant.features.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                              +{variant.features.length - 4} more
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Color Selection */}
              {currentStep === 'color' && (
                <motion.div
                  key="color"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Pick Your Color</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {modelConfig.colors.map((color) => (
                      <button
                        key={color.code}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'p-4 rounded-xl border-2 text-center transition-all',
                          selectedColor?.code === color.code
                            ? 'border-kia-red bg-kia-red/5'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        )}
                      >
                        <div
                          className={cn(
                            'w-12 h-12 rounded-full mx-auto mb-3 border-2 border-gray-200',
                            color.type === 'dual_tone' && 'relative overflow-hidden'
                          )}
                          style={{
                            backgroundColor: color.hex,
                          }}
                        >
                          {color.type === 'dual_tone' && (
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `linear-gradient(135deg, ${color.hex} 50%, #1a1a1a 50%)`,
                              }}
                            />
                          )}
                          {selectedColor?.code === color.code && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check
                                className={cn(
                                  'h-6 w-6',
                                  color.hex === '#F5F5F5' ? 'text-gray-900' : 'text-white'
                                )}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {color.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize mt-1">
                          {color.type.replace('_', ' ')}
                        </p>
                        {color.premium && (
                          <p className="text-xs text-kia-red mt-1">
                            +{formatPrice(color.premium)}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Accessories Selection */}
              {currentStep === 'accessories' && (
                <motion.div
                  key="accessories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-2">Add Accessories</h2>
                  <p className="text-gray-500 mb-6">Optional - Enhance your vehicle</p>

                  {Object.entries(accessoriesByCategory).map(
                    ([category, accessories]) =>
                      accessories.length > 0 && (
                        <div key={category} className="mb-8">
                          <h3 className="text-lg font-semibold capitalize mb-4">
                            {category}
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {accessories.map((accessory) => {
                              const isSelected = selectedAccessories.some(
                                (a) => a.id === accessory.id
                              )
                              return (
                                <button
                                  key={accessory.id}
                                  onClick={() => toggleAccessory(accessory)}
                                  className={cn(
                                    'p-4 rounded-xl border-2 text-left transition-all',
                                    isSelected
                                      ? 'border-kia-red bg-kia-red/5'
                                      : 'border-gray-200 hover:border-gray-300 bg-white'
                                  )}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={cn(
                                        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                                        isSelected
                                          ? 'bg-kia-red border-kia-red'
                                          : 'border-gray-300'
                                      )}
                                    >
                                      {isSelected && (
                                        <Check className="h-3 w-3 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <h4 className="font-medium">{accessory.name}</h4>
                                        <span className="text-kia-red font-semibold">
                                          {formatPrice(accessory.price)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-500 mt-1">
                                        {accessory.description}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                  )}

                  {modelAccessories.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl">
                      <p className="text-gray-500">
                        No accessories available for this model yet.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Summary */}
              {currentStep === 'summary' && configuration && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Your Configuration</h2>

                  <div className="bg-white rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">
                        Kia {configuration.modelName} {configuration.variant.name}
                      </h3>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    {shareCode && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600 mb-2">Share your configuration:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">
                            {`${typeof window !== 'undefined' ? window.location.origin : ''}/configure/${slug}?config=${shareCode}`}
                          </code>
                          <Button size="sm" variant="outline" onClick={copyShareLink}>
                            {copied ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Configuration Details */}
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b">
                        <div>
                          <p className="font-medium">Variant</p>
                          <p className="text-sm text-gray-500">
                            {configuration.variant.engine} | {configuration.variant.transmission}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(configuration.basePrice)}</p>
                      </div>

                      <div className="flex justify-between py-3 border-b">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full border-2"
                            style={{ backgroundColor: configuration.color.hex }}
                          />
                          <div>
                            <p className="font-medium">{configuration.color.name}</p>
                            <p className="text-sm text-gray-500 capitalize">
                              {configuration.color.type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          {configuration.colorPremium > 0
                            ? `+${formatPrice(configuration.colorPremium)}`
                            : 'Included'}
                        </p>
                      </div>

                      {configuration.accessories.length > 0 && (
                        <div className="py-3 border-b">
                          <div className="flex justify-between mb-2">
                            <p className="font-medium">Accessories</p>
                            <p className="font-semibold">
                              +{formatPrice(configuration.accessoriesTotal)}
                            </p>
                          </div>
                          <ul className="space-y-1">
                            {configuration.accessories.map((acc) => (
                              <li
                                key={acc.id}
                                className="flex justify-between text-sm text-gray-600"
                              >
                                <span>{acc.name}</span>
                                <span>{formatPrice(acc.price)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex justify-between py-3 text-lg">
                        <p className="font-bold">Total Price</p>
                        <p className="font-bold text-kia-red">
                          {formatPrice(configuration.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link href={`/test-drive?model=${slug}`}>
                      <Button className="w-full bg-kia-red hover:bg-kia-red-dark" size="lg">
                        <Calendar className="h-5 w-5 mr-2" />
                        Book Test Drive
                      </Button>
                    </Link>
                    <Link
                      href={`https://wa.me/919876543210?text=Hi, I'm interested in the configured Kia ${configuration.modelName} ${configuration.variant.name} in ${configuration.color.name}. Total price: ${formatPrice(configuration.totalPrice)}`}
                      target="_blank"
                    >
                      <Button variant="outline" className="w-full" size="lg">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Get Quote on WhatsApp
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep !== 'summary' && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="bg-kia-red hover:bg-kia-red-dark"
                >
                  {currentStep === 'accessories' ? 'View Summary' : 'Next'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Car Preview */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-4">
                <div
                  className="relative aspect-[4/3]"
                  style={{
                    background: selectedColor
                      ? `linear-gradient(135deg, ${selectedColor.hex}22 0%, ${selectedColor.hex}44 100%)`
                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  }}
                >
                  <Image
                    src={`/models/${slug}.png`}
                    alt={modelConfig.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">
                    Kia {modelConfig.name}
                    {selectedVariant && ` ${selectedVariant.name}`}
                  </h3>
                  {selectedColor && (
                    <p className="text-sm text-gray-500">{selectedColor.name}</p>
                  )}
                </div>
              </div>

              {/* Price Summary Card */}
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <h4 className="font-semibold mb-3">Price Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price</span>
                    <span>{selectedVariant ? formatPrice(selectedVariant.price) : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color Premium</span>
                    <span>
                      {selectedColor?.premium
                        ? `+${formatPrice(selectedColor.premium)}`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Accessories ({selectedAccessories.length})
                    </span>
                    <span>
                      {selectedAccessories.length > 0
                        ? `+${formatPrice(
                            selectedAccessories.reduce((sum, acc) => sum + acc.price, 0)
                          )}`
                        : '-'}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-kia-red">
                      {configuration ? formatPrice(configuration.totalPrice) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
