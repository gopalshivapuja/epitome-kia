'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function HeroSection() {
    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-white pt-16">
            {/* Hero Content - Tesla style */}
            <div className="container mx-auto px-6 py-12 md:py-20">
                {/* Text Content - Centered */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900">
                        Kia Seltos
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Starting from ₹10.90 Lakh
                    </p>

                    {/* CTA Buttons - Tesla style */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto min-w-[200px]"
                            asChild
                        >
                            <Link href="/models/seltos">Explore</Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto min-w-[200px]"
                            asChild
                        >
                            <Link href="/test-drive">Test Drive</Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Hero Car Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative mt-12 md:mt-16"
                >
                    <div className="relative aspect-[16/9] md:aspect-[21/9] max-w-6xl mx-auto">
                        <Image
                            src="/models/seltos.png"
                            alt="Kia Seltos"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Feature highlights - Tesla style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8 md:mt-12 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center"
                >
                    <div>
                        <p className="text-2xl md:text-3xl font-semibold text-gray-900">138 hp</p>
                        <p className="text-sm text-gray-500 mt-1">Power</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-semibold text-gray-900">6 Airbags</p>
                        <p className="text-sm text-gray-500 mt-1">Safety</p>
                    </div>
                    <div>
                        <p className="text-2xl md:text-3xl font-semibold text-gray-900">17 km/l</p>
                        <p className="text-sm text-gray-500 mt-1">Mileage</p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
