'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Settings, Palette, Sparkles } from 'lucide-react'
import { MODEL_CONFIGS, formatPrice } from '@/lib/configurator'
import { Button } from '@/components/ui/button'

export default function ConfigurePage() {
  const models = Object.values(MODEL_CONFIGS)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-kia-black to-gray-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Build Your Perfect Kia
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Configure your dream vehicle with our interactive configurator.
              Choose your model, variant, color, and accessories.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-kia-red/20 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-kia-red" />
                </div>
                <span>Choose Variant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-kia-red/20 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-kia-red" />
                </div>
                <span>Pick Color</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-kia-red/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-kia-red" />
                </div>
                <span>Add Accessories</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Model Selection */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Select a Model to Configure
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {models.map((model, index) => (
              <motion.div
                key={model.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/configure/${model.slug}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                    {/* Model Image */}
                    <div className="relative aspect-[16/10] bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden">
                      <Image
                        src={`/models/${model.slug}.png`}
                        alt={model.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Model Info */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Kia {model.name}
                        </h3>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-kia-red group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-gray-500 text-sm mb-3">{model.tagline}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Starting from</span>
                        <span className="text-lg font-semibold text-kia-red">
                          {formatPrice(model.startingPrice)}
                        </span>
                      </div>

                      {/* Quick Stats */}
                      <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-500">
                        <span>{model.variants.length} Variants</span>
                        <span>{model.colors.length} Colors</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Models */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">More models coming soon</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['EV6', 'EV9', 'Carnival'].map((name) => (
                <div
                  key={name}
                  className="px-6 py-3 bg-gray-100 rounded-full text-gray-400"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Why Configure with Us?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-kia-red/10 flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-6 w-6 text-kia-red" />
                </div>
                <h3 className="font-semibold mb-2">Visualize Your Choice</h3>
                <p className="text-sm text-gray-600">
                  See how different colors and options look on your chosen model
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-kia-red/10 flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-6 w-6 text-kia-red" />
                </div>
                <h3 className="font-semibold mb-2">Compare Variants</h3>
                <p className="text-sm text-gray-600">
                  Understand feature differences between variants at a glance
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-kia-red/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-kia-red" />
                </div>
                <h3 className="font-semibold mb-2">Save & Share</h3>
                <p className="text-sm text-gray-600">
                  Save your configuration and share it with friends or family
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
