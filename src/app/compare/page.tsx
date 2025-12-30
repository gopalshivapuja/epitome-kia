'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Plus, X, ArrowRight, Calendar, Trophy, Shield, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPriceLakh } from '@/lib/utils'
import {
  COMPETITOR_MODELS,
  KIA_MODEL_SPECS,
  KIA_ADVANTAGES,
  getCompetitorsForModel,
  type CompetitorModelData,
  type CompetitorSpecs,
} from '@/lib/competitor-data'

type KiaModel = {
  id: string
  name: string
  slug: string
  modelYear: number
  description: string | null
  startingPrice: number | null
}

type CompareMode = 'kia' | 'competitor'

type SelectedItem = {
  type: 'kia' | 'competitor'
  data: KiaModel | CompetitorModelData
}

const SPEC_LABELS: { key: keyof CompetitorSpecs; label: string }[] = [
  { key: 'engine', label: 'Engine/Battery' },
  { key: 'power', label: 'Power' },
  { key: 'torque', label: 'Torque' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'fuelType', label: 'Fuel Type' },
  { key: 'mileage', label: 'Mileage/Range' },
  { key: 'length', label: 'Length' },
  { key: 'width', label: 'Width' },
  { key: 'height', label: 'Height' },
  { key: 'wheelbase', label: 'Wheelbase' },
  { key: 'bootSpace', label: 'Boot Space' },
  { key: 'groundClearance', label: 'Ground Clearance' },
  { key: 'seatingCapacity', label: 'Seating' },
  { key: 'airbags', label: 'Airbags' },
  { key: 'warranty', label: 'Warranty' },
]

export default function ComparePage() {
  const [models, setModels] = useState<KiaModel[]>([])
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [compareMode, setCompareMode] = useState<CompareMode>('kia')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/models')
        const data = await response.json()
        if (data.success) {
          setModels(data.data?.models || [])
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchModels()
  }, [])

  const addKiaModel = (model: KiaModel) => {
    if (selectedItems.length < 3 && !selectedItems.find((m) => m.type === 'kia' && (m.data as KiaModel).id === model.id)) {
      setSelectedItems([...selectedItems, { type: 'kia', data: model }])
    }
  }

  const addCompetitor = (competitor: CompetitorModelData) => {
    if (selectedItems.length < 3 && !selectedItems.find((m) => m.type === 'competitor' && (m.data as CompetitorModelData).id === competitor.id)) {
      setSelectedItems([...selectedItems, { type: 'competitor', data: competitor }])
    }
  }

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const availableKiaModels = (models || []).filter(
    (model) => !selectedItems.find((m) => m.type === 'kia' && (m.data as KiaModel).id === model.id)
  )

  const getAvailableCompetitors = (): CompetitorModelData[] => {
    // Get competitors based on selected Kia models
    const selectedKiaModels = selectedItems.filter((m) => m.type === 'kia').map((m) => (m.data as KiaModel).slug)
    const selectedCompetitorIds = selectedItems.filter((m) => m.type === 'competitor').map((m) => (m.data as CompetitorModelData).id)

    if (selectedKiaModels.length === 0) {
      return COMPETITOR_MODELS.filter((c) => !selectedCompetitorIds.includes(c.id))
    }

    // Get competitors that compete with any of the selected Kia models
    const relevantCompetitors = COMPETITOR_MODELS.filter(
      (c) => c.competesWith.some((slug) => selectedKiaModels.includes(slug)) && !selectedCompetitorIds.includes(c.id)
    )
    return relevantCompetitors
  }

  const getItemName = (item: SelectedItem): string => {
    if (item.type === 'kia') {
      return (item.data as KiaModel).name
    }
    return (item.data as CompetitorModelData).name
  }

  const getItemSlug = (item: SelectedItem): string => {
    if (item.type === 'kia') {
      return (item.data as KiaModel).slug
    }
    return (item.data as CompetitorModelData).id
  }

  const getItemPrice = (item: SelectedItem): string => {
    if (item.type === 'kia') {
      const model = item.data as KiaModel
      return model.startingPrice ? formatPriceLakh(model.startingPrice) + '*' : 'Price on request'
    }
    return (item.data as CompetitorModelData).priceRange
  }

  const getItemSpecs = (item: SelectedItem): CompetitorSpecs | undefined => {
    if (item.type === 'kia') {
      return KIA_MODEL_SPECS[(item.data as KiaModel).slug]
    }
    return (item.data as CompetitorModelData).specs
  }

  const getItemImage = (item: SelectedItem): string => {
    if (item.type === 'kia') {
      return `/models/${(item.data as KiaModel).slug}.png`
    }
    return (item.data as CompetitorModelData).imageUrl || '/images/placeholder-car.png'
  }

  const handleModeChange = (mode: CompareMode) => {
    setCompareMode(mode)
    // Keep only Kia models when switching to competitor mode
    if (mode === 'competitor') {
      setSelectedItems(selectedItems.filter((m) => m.type === 'kia').slice(0, 1))
    } else {
      // Keep only Kia models in Kia vs Kia mode
      setSelectedItems(selectedItems.filter((m) => m.type === 'kia'))
    }
  }

  const hasKiaModel = selectedItems.some((m) => m.type === 'kia')
  const canAddCompetitor = compareMode === 'competitor' && hasKiaModel && selectedItems.length < 3

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Compare Models</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Compare Vehicles
          </h1>
          <p className="mt-2 text-muted-foreground">
            Compare Kia models with each other or against competitors
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => handleModeChange('kia')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              compareMode === 'kia'
                ? 'bg-kia-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kia vs Kia
          </button>
          <button
            onClick={() => handleModeChange('competitor')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              compareMode === 'competitor'
                ? 'bg-kia-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kia vs Competitors
          </button>
        </div>

        {/* Model Selection */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedItems.map((item, index) => (
            <Card key={`${item.type}-${getItemSlug(item)}`} className="relative">
              <button
                onClick={() => removeItem(index)}
                className="absolute right-2 top-2 z-10 rounded-full bg-gray-100 p-1 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
              {item.type === 'kia' && (
                <div className="absolute left-2 top-2 z-10 bg-kia-red text-white text-xs px-2 py-1 rounded">
                  Kia
                </div>
              )}
              <CardContent className="pt-8">
                <div className="relative mx-auto mb-4 aspect-video w-full max-w-[200px]">
                  <Image
                    src={getItemImage(item)}
                    alt={getItemName(item)}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder-car.png'
                    }}
                  />
                </div>
                <h3 className="text-center font-semibold">{getItemName(item)}</h3>
                <p className="text-center text-sm text-muted-foreground">
                  {getItemPrice(item)}
                </p>
              </CardContent>
            </Card>
          ))}

          {/* Add Kia Model Slot */}
          {(compareMode === 'kia' && selectedItems.length < 3) ||
           (compareMode === 'competitor' && !hasKiaModel) ? (
            <Card className="border-dashed">
              <CardContent className="flex h-full flex-col items-center justify-center py-8">
                <div className="mb-4 rounded-full bg-kia-red/10 p-4">
                  <Plus className="h-6 w-6 text-kia-red" />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  {compareMode === 'competitor' && !hasKiaModel
                    ? 'First, select a Kia model'
                    : 'Add a Kia model'}
                </p>
                <Select
                  value=""
                  onValueChange={(value) => {
                    const model = models.find((m) => m.id === value)
                    if (model) addKiaModel(model)
                  }}
                  disabled={isLoading || availableKiaModels.length === 0}
                >
                  <SelectTrigger className="w-full max-w-[200px]">
                    <SelectValue placeholder="Select a Kia" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableKiaModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ) : null}

          {/* Add Competitor Slot */}
          {canAddCompetitor && (
            <Card className="border-dashed border-blue-200 bg-blue-50/30">
              <CardContent className="flex h-full flex-col items-center justify-center py-8">
                <div className="mb-4 rounded-full bg-blue-100 p-4">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">Add a competitor</p>
                <Select
                  value=""
                  onValueChange={(value) => {
                    const competitor = COMPETITOR_MODELS.find((c) => c.id === value)
                    if (competitor) addCompetitor(competitor)
                  }}
                >
                  <SelectTrigger className="w-full max-w-[200px]">
                    <SelectValue placeholder="Select a competitor" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCompetitors().map((competitor) => (
                      <SelectItem key={competitor.id} value={competitor.id}>
                        {competitor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comparison Table */}
        {selectedItems.length >= 2 && (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="min-w-[120px] p-3 text-left text-sm font-medium text-muted-foreground md:p-4 md:text-base">
                    Specifications
                  </th>
                  {selectedItems.map((item, index) => (
                    <th key={index} className="min-w-[140px] p-3 text-center md:p-4">
                      <span className={`text-sm font-semibold md:text-base ${item.type === 'kia' ? 'text-kia-red' : 'text-gray-900'}`}>
                        {getItemName(item)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b bg-kia-red/5">
                  <td className="p-3 text-sm font-medium md:p-4">Price</td>
                  {selectedItems.map((item, index) => (
                    <td key={index} className="p-3 text-center text-sm font-semibold md:p-4">
                      {getItemPrice(item)}
                    </td>
                  ))}
                </tr>

                {/* Spec Rows */}
                {SPEC_LABELS.map((spec) => {
                  const isWarranty = spec.key === 'warranty'
                  return (
                    <tr key={spec.key} className={`border-b ${isWarranty ? 'bg-green-50' : ''}`}>
                      <td className="p-3 text-sm text-muted-foreground md:p-4">{spec.label}</td>
                      {selectedItems.map((item, index) => {
                        const specs = getItemSpecs(item)
                        const value = specs?.[spec.key] || '-'
                        const isKia = item.type === 'kia'
                        const isKiaAdvantage = isWarranty && isKia

                        return (
                          <td key={index} className="p-3 text-center text-sm md:p-4">
                            <span className={isKiaAdvantage ? 'font-semibold text-green-700' : ''}>
                              {value}
                              {isKiaAdvantage && (
                                <Trophy className="inline-block ml-1 h-4 w-4 text-green-600" />
                              )}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Kia Advantages Section (only in competitor mode) */}
        {compareMode === 'competitor' && selectedItems.length >= 2 && selectedItems.some((m) => m.type === 'competitor') && (
          <div className="mt-8 p-6 bg-gradient-to-r from-kia-red/5 to-kia-red/10 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-kia-red" />
              Why Choose Kia?
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {KIA_ADVANTAGES.map((advantage) => (
                <div key={advantage.title} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{advantage.title}</p>
                    <p className="text-sm text-gray-600">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedItems.length >= 2 && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {selectedItems.filter((m) => m.type === 'kia').map((item, index) => (
              <Button key={index} variant="outline" asChild>
                <Link href={`/models/${(item.data as KiaModel).slug}`}>
                  View {(item.data as KiaModel).name} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        )}

        {selectedItems.length < 2 && (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-muted-foreground">
              {compareMode === 'competitor'
                ? 'Select a Kia model and at least one competitor to start comparing'
                : 'Select at least 2 Kia models to start comparing'}
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 rounded-lg bg-gradient-to-r from-kia-red to-kia-red-dark p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to Experience?</h2>
          <p className="mt-2 text-white/80">
            Book a test drive and feel the Kia difference yourself
          </p>
          <Button variant="secondary" size="lg" className="mt-6" asChild>
            <Link href="/test-drive">
              <Calendar className="mr-2 h-5 w-5" />
              Book Test Drive
            </Link>
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          * Ex-showroom prices. Specifications are indicative and subject to change.
          Competitor data sourced from public information and may not reflect latest updates.
          Please contact our sales team for the latest and most accurate information.
        </p>
      </div>
    </div>
  )
}
