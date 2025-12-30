'use client'

import { useState, useEffect } from 'react'
import { Calculator, Car, Fuel, Shield, CreditCard, Package, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  calculateOnRoadPrice,
  formatPriceBreakdownLabels,
  getRoadTaxPercentage,
  type PricingResult
} from '@/lib/pricing'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Model {
  id: string
  name: string
  slug: string
  variants: Variant[]
}

interface Variant {
  id: string
  name: string
  basePrice: number | null
  fuelType?: string
}

interface OnRoadPriceCalculatorProps {
  initialModelSlug?: string
  initialVariantId?: string
  compact?: boolean
}

export function OnRoadPriceCalculator({
  initialModelSlug,
  initialVariantId,
  compact = false
}: OnRoadPriceCalculatorProps) {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModelId, setSelectedModelId] = useState<string>('')
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')
  const [includeInsurance, setIncludeInsurance] = useState(true)
  const [insuranceType, setInsuranceType] = useState<'comprehensive' | 'thirdParty'>('comprehensive')
  const [isFinanced, setIsFinanced] = useState(false)
  const [accessories, setAccessories] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch models
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('/api/models?includeVariants=true')
        const data = await res.json()
        if (data.success && data.data?.models) {
          setModels(data.data.models)

          // Set initial selection if provided
          if (initialModelSlug) {
            const model = data.data.models.find((m: Model) => m.slug === initialModelSlug)
            if (model) {
              setSelectedModelId(model.id)
              if (initialVariantId) {
                setSelectedVariantId(initialVariantId)
              } else if (model.variants.length > 0) {
                setSelectedVariantId(model.variants[0].id)
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchModels()
  }, [initialModelSlug, initialVariantId])

  // Get selected model and variant
  const selectedModel = models.find(m => m.id === selectedModelId)
  const selectedVariant = selectedModel?.variants.find(v => v.id === selectedVariantId)
  const exShowroomPrice = selectedVariant?.basePrice || 0

  // Determine fuel type from variant name or default to petrol
  const fuelType = selectedVariant?.name?.toLowerCase().includes('diesel')
    ? 'diesel'
    : selectedVariant?.name?.toLowerCase().includes('ev') || selectedModel?.slug?.includes('ev')
      ? 'ev'
      : 'petrol'

  // Calculate on-road price
  const pricing: PricingResult | null = exShowroomPrice > 0
    ? calculateOnRoadPrice(exShowroomPrice, {
        includeInsurance,
        insuranceType,
        fuelType,
        isFinanced,
        includeAccessories: accessories,
        includeTCS: true
      })
    : null

  const labels = formatPriceBreakdownLabels()

  if (isLoading) {
    return (
      <div className={cn(
        'bg-white rounded-xl border border-gray-200 p-6',
        compact ? 'max-w-md' : ''
      )}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/2" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-10 bg-gray-100 rounded" />
          <div className="h-32 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 overflow-hidden',
      compact ? 'max-w-md' : ''
    )}>
      {/* Header */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          <h3 className="font-semibold">On-Road Price Calculator</h3>
        </div>
        <p className="text-sm text-gray-400 mt-1">Karnataka (Bangalore) prices</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Model Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Car className="w-4 h-4 text-gray-400" />
            Select Model
          </Label>
          <select
            value={selectedModelId}
            onChange={(e) => {
              setSelectedModelId(e.target.value)
              const model = models.find(m => m.id === e.target.value)
              if (model?.variants.length) {
                setSelectedVariantId(model.variants[0].id)
              } else {
                setSelectedVariantId('')
              }
            }}
            className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="">Choose a model</option>
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>

        {/* Variant Selection */}
        {selectedModel && (
          <div className="space-y-2">
            <Label>Select Variant</Label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Choose a variant</option>
              {selectedModel.variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.name} {variant.basePrice ? `- ${formatPrice(variant.basePrice)}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Options */}
        {exShowroomPrice > 0 && (
          <>
            {/* Insurance Toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  Insurance
                </Label>
                <button
                  onClick={() => setIncludeInsurance(!includeInsurance)}
                  className={cn(
                    'relative w-11 h-6 rounded-full transition-colors',
                    includeInsurance ? 'bg-gray-900' : 'bg-gray-200'
                  )}
                >
                  <span className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm',
                    includeInsurance && 'translate-x-5'
                  )} />
                </button>
              </div>

              {includeInsurance && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setInsuranceType('comprehensive')}
                    className={cn(
                      'flex-1 py-2 px-3 text-xs font-medium rounded-md border transition-all',
                      insuranceType === 'comprehensive'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    )}
                  >
                    Comprehensive
                  </button>
                  <button
                    onClick={() => setInsuranceType('thirdParty')}
                    className={cn(
                      'flex-1 py-2 px-3 text-xs font-medium rounded-md border transition-all',
                      insuranceType === 'thirdParty'
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    )}
                  >
                    Third Party
                  </button>
                </div>
              )}
            </div>

            {/* Financing Toggle */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                Financing (Loan)
              </Label>
              <button
                onClick={() => setIsFinanced(!isFinanced)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors',
                  isFinanced ? 'bg-gray-900' : 'bg-gray-200'
                )}
              >
                <span className={cn(
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm',
                  isFinanced && 'translate-x-5'
                )} />
              </button>
            </div>

            {/* Accessories Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  Accessories
                </Label>
                <span className="text-sm font-medium">{formatPrice(accessories)}</span>
              </div>
              <Slider
                value={[accessories]}
                min={0}
                max={200000}
                step={5000}
                onValueChange={(val) => setAccessories(val[0])}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>₹0</span>
                <span>₹2,00,000</span>
              </div>
            </div>
          </>
        )}

        {/* Price Breakdown */}
        {pricing && (
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Price Breakdown</h4>
            </div>
            <div className="p-4 space-y-2">
              {Object.entries(pricing.breakdown).map(([key, value]) => {
                if (value === 0) return null
                const label = labels[key as keyof typeof labels]
                const isMainPrice = key === 'exShowroom'

                return (
                  <div
                    key={key}
                    className={cn(
                      'flex justify-between text-sm',
                      isMainPrice && 'font-medium'
                    )}
                  >
                    <span className="text-gray-600 flex items-center gap-1">
                      {label}
                      {key === 'roadTax' && (
                        <span className="text-xs text-gray-400">
                          ({getRoadTaxPercentage(exShowroomPrice)})
                        </span>
                      )}
                    </span>
                    <span className={isMainPrice ? 'text-gray-900' : 'text-gray-700'}>
                      {formatPrice(value)}
                    </span>
                  </div>
                )
              })}

              {/* Total */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total On-Road Price</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatPrice(pricing.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Prices are indicative and may vary. Final price will be confirmed at the showroom.
            Insurance premiums are approximate and depend on IDV and add-ons selected.
          </p>
        </div>

        {/* CTA */}
        {selectedVariant && (
          <Button className="w-full" size="lg" asChild>
            <a href={`/test-drive?model=${selectedModel?.slug}`}>
              Book Test Drive
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}
