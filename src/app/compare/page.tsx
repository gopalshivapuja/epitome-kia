'use client'

import { useState, useEffect } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Plus, X, ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

type Model = {
  id: string
  name: string
  slug: string
  modelYear: number
  description: string | null
  startingPrice: number | null
}

const SPEC_CATEGORIES = [
  {
    name: 'Price & Value',
    specs: [
      { key: 'startingPrice', label: 'Starting Price' },
      { key: 'modelYear', label: 'Model Year' },
    ],
  },
  {
    name: 'Performance',
    specs: [
      { key: 'engine', label: 'Engine Options' },
      { key: 'power', label: 'Max Power' },
      { key: 'transmission', label: 'Transmission' },
    ],
  },
  {
    name: 'Dimensions',
    specs: [
      { key: 'seating', label: 'Seating Capacity' },
      { key: 'bootSpace', label: 'Boot Space' },
    ],
  },
]

// Model specifications (static data for comparison)
const MODEL_SPECS: Record<string, Record<string, string>> = {
  seltos: {
    engine: '1.5L Petrol / 1.5L Diesel / 1.4L Turbo',
    power: 'Up to 140 PS',
    transmission: '6MT / IVT / 7DCT',
    seating: '5 Seater',
    bootSpace: '433L',
  },
  sonet: {
    engine: '1.2L Petrol / 1.5L Diesel / 1.0L Turbo',
    power: 'Up to 120 PS',
    transmission: '5MT / 6MT / 6iMT / 7DCT',
    seating: '5 Seater',
    bootSpace: '392L',
  },
  carens: {
    engine: '1.5L Petrol / 1.5L Diesel / 1.4L Turbo',
    power: 'Up to 140 PS',
    transmission: '6MT / IVT / 7DCT',
    seating: '6/7 Seater',
    bootSpace: '216L (3rd row up)',
  },
  ev6: {
    engine: '77.4 kWh Battery',
    power: 'Up to 325 PS',
    transmission: 'Single Speed',
    seating: '5 Seater',
    bootSpace: '490L',
  },
  ev9: {
    engine: '99.8 kWh Battery',
    power: 'Up to 384 PS',
    transmission: 'Single Speed',
    seating: '6/7 Seater',
    bootSpace: '333L (3rd row up)',
  },
  carnival: {
    engine: '2.2L Diesel',
    power: '200 PS',
    transmission: '8AT',
    seating: '7/8/9 Seater',
    bootSpace: '627L (3rd row up)',
  },
  syros: {
    engine: '1.0L Turbo Petrol / 1.5L Diesel',
    power: 'Up to 120 PS',
    transmission: '6MT / 7DCT',
    seating: '5 Seater',
    bootSpace: '465L',
  },
}

export default function ComparePage() {
  const [models, setModels] = useState<Model[]>([])
  const [selectedModels, setSelectedModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/models')
        const data = await response.json()
        if (data.success) {
          setModels(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchModels()
  }, [])

  const addModel = (model: Model) => {
    if (selectedModels.length < 3 && !selectedModels.find((m) => m.id === model.id)) {
      setSelectedModels([...selectedModels, model])
    }
  }

  const removeModel = (modelId: string) => {
    setSelectedModels(selectedModels.filter((m) => m.id !== modelId))
  }

  const availableModels = models.filter(
    (model) => !selectedModels.find((m) => m.id === model.id)
  )

  const getSpecValue = (model: Model, specKey: string): string => {
    if (specKey === 'startingPrice') {
      return model.startingPrice ? formatPrice(model.startingPrice) + '*' : 'Price on request'
    }
    if (specKey === 'modelYear') {
      return model.modelYear.toString()
    }
    return MODEL_SPECS[model.slug]?.[specKey] || '-'
  }

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
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Compare Kia Models
          </h1>
          <p className="mt-2 text-muted-foreground">
            Select up to 3 models to compare specifications side by side
          </p>
        </div>

        {/* Model Selection */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedModels.map((model) => (
            <Card key={model.id} className="relative">
              <button
                onClick={() => removeModel(model.id)}
                className="absolute right-2 top-2 rounded-full bg-gray-100 p-1 hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
              <CardContent className="pt-6">
                <div className="relative mx-auto mb-4 aspect-video w-full max-w-[200px]">
                  <Image
                    src={`/models/${model.slug}.png`}
                    alt={model.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-semibold">{model.name}</h3>
                <p className="text-center text-sm text-muted-foreground">
                  {model.startingPrice ? formatPrice(model.startingPrice) + '*' : 'Price on request'}
                </p>
              </CardContent>
            </Card>
          ))}

          {selectedModels.length < 3 && (
            <Card className="border-dashed">
              <CardContent className="flex h-full flex-col items-center justify-center py-8">
                <div className="mb-4 rounded-full bg-gray-100 p-4">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">Add a model to compare</p>
                <select
                  className="w-full max-w-[200px] rounded-md border px-3 py-2 text-sm"
                  value=""
                  onChange={(e) => {
                    const model = models.find((m) => m.id === e.target.value)
                    if (model) addModel(model)
                  }}
                  disabled={isLoading || availableModels.length === 0}
                >
                  <option value="">Select a model</option>
                  {availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comparison Table */}
        {selectedModels.length >= 2 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium text-muted-foreground">
                    Specifications
                  </th>
                  {selectedModels.map((model) => (
                    <th key={model.id} className="p-4 text-center font-semibold">
                      {model.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_CATEGORIES.map((category) => (
                  <>
                    <tr key={category.name} className="bg-gray-50">
                      <td
                        colSpan={selectedModels.length + 1}
                        className="p-3 text-sm font-semibold text-kia-red"
                      >
                        {category.name}
                      </td>
                    </tr>
                    {category.specs.map((spec) => (
                      <tr key={spec.key} className="border-b">
                        <td className="p-4 text-sm text-muted-foreground">{spec.label}</td>
                        {selectedModels.map((model) => (
                          <td key={model.id} className="p-4 text-center text-sm">
                            {getSpecValue(model, spec.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedModels.length >= 2 && (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {selectedModels.map((model) => (
              <Button key={model.id} variant="outline" asChild>
                <Link href={`/models/${model.slug}`}>
                  View {model.name} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        )}

        {selectedModels.length < 2 && (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="text-muted-foreground">
              Select at least 2 models to start comparing
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 rounded-lg bg-gradient-to-r from-kia-red to-kia-red-dark p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to Experience?</h2>
          <p className="mt-2 text-white/80">
            Book a test drive and feel the difference yourself
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
          Please contact our sales team for the latest and most accurate information.
        </p>
      </div>
    </div>
  )
}
