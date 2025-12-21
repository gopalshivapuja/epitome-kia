'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EMICalculatorModal } from '@/components/features/EMICalculatorModal'
import { TestDriveModal } from '@/components/features/TestDriveModal'

interface FullscreenSectionProps {
    title: string
    subtitle?: string
    videoSrc?: string
    imageSrc?: string
    modelId?: string
    isFirst?: boolean
    darkText?: boolean
    price?: string
    buttons?: {
        label: string
        href?: string
        variant: 'primary' | 'outline'
        action?: 'emi' | 'test-drive' // Add action types
    }[]
}

export function FullscreenSection({
    title,
    subtitle,
    videoSrc,
    imageSrc,
    modelId,
    isFirst = false,
    darkText = false,
    price,
    buttons
}: FullscreenSectionProps) {
    const [isEmiOpen, setIsEmiOpen] = useState(false)
    const [isTestDriveOpen, setIsTestDriveOpen] = useState(false)

    return (
        <section className="relative h-screen w-full overflow-hidden snap-start scroll-smooth flex flex-col justify-center items-center bg-kia-black">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {videoSrc ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover opacity-50"
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                ) : (
                    <div
                        className="h-full w-full bg-cover bg-center opacity-60"
                        style={{ backgroundImage: `url(${imageSrc || '/placeholder-car.jpg'})` }}
                    />
                )}
                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-kia-black via-transparent to-kia-black/40" />
            </div>

            {/* Content Layer - Centered like the screenshot */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: false }}
                    className="flex flex-col items-center"
                >
                    {isFirst && (
                        <span className="text-kia-red font-heading font-medium tracking-[0.3em] uppercase mb-4 text-sm md:text-base">
                            Movement that Inspires
                        </span>
                    )}

                    <h1 className="font-heading text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-6">
                        {isFirst ? (
                            <>
                                THE NEW <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                                    AUTHORITY
                                </span>
                            </>
                        ) : title}
                    </h1>

                    <p className="max-w-xl text-lg md:text-xl text-gray-300 font-light mb-10 text-balance">
                        {subtitle || "Experience the future of mobility with Epitome Kia. Discover award-winning designs and cutting-edge technology."}
                        {price && <span className="block mt-2 font-medium text-kia-red">Starting from {price}*</span>}
                    </p>

                    {/* Dynamic Buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {buttons?.map((btn, idx) => (
                            <Button
                                key={idx}
                                size="lg"
                                variant={btn.variant === 'primary' ? 'default' : 'outline'}
                                className={cn(
                                    "rounded-full px-10 h-12 text-base font-semibold transition-all hover:scale-105 active:scale-95",
                                    btn.variant === 'primary'
                                        ? "bg-kia-red hover:bg-kia-red-dark text-white border-none"
                                        : "bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-black"
                                )}
                                onClick={() => {
                                    if (btn.action === 'emi') setIsEmiOpen(true)
                                    if (btn.action === 'test-drive') setIsTestDriveOpen(true)
                                }}
                                asChild={!btn.action} // Only use asChild (Link) if no specific action
                            >
                                {btn.action ? (
                                    <span>{btn.label}</span>
                                ) : (
                                    <Link href={btn.href || '#'}>
                                        {btn.label}
                                    </Link>
                                )}
                            </Button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Modals */}
            <EMICalculatorModal
                isOpen={isEmiOpen}
                onClose={() => setIsEmiOpen(false)}
                modelName={title}
            />
            <TestDriveModal
                isOpen={isTestDriveOpen}
                onClose={() => setIsTestDriveOpen(false)}
                modelName={title}
            />

            {/* Scroll Indicator for Hero */}
            {isFirst && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-12 bg-gradient-to-b from-kia-red to-transparent"
                    />
                </div>
            )}
        </section>
    )
}
