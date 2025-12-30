'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { EMICalculatorModal } from '@/components/features/EMICalculatorModal'
import { TestDriveModal } from '@/components/features/TestDriveModal'

interface FullscreenSectionProps {
    title: string
    subtitle?: string
    imageSrc?: string
    modelId?: string
    isFirst?: boolean
    price?: string
    buttons?: {
        label: string
        href?: string
        variant: 'primary' | 'outline'
        action?: 'emi' | 'test-drive'
    }[]
}

export function FullscreenSection({
    title,
    subtitle,
    imageSrc,
    isFirst = false,
    price,
    buttons
}: FullscreenSectionProps) {
    const [isEmiOpen, setIsEmiOpen] = useState(false)
    const [isTestDriveOpen, setIsTestDriveOpen] = useState(false)

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col justify-center items-center py-20">
            {/* Content - Tesla style centered */}
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    {/* Title */}
                    <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900">
                        {title}
                    </h2>

                    {/* Subtitle & Price */}
                    <p className="mt-4 text-lg text-gray-500 max-w-lg">
                        {subtitle || "Experience the future of mobility with Epitome Kia."}
                        {price && <span className="block mt-1 font-medium text-gray-700">{price}</span>}
                    </p>

                    {/* Buttons - Tesla style */}
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                        {buttons?.map((btn, idx) => (
                            <Button
                                key={idx}
                                size="lg"
                                variant={btn.variant === 'primary' ? 'default' : 'outline'}
                                className="min-w-[180px]"
                                onClick={() => {
                                    if (btn.action === 'emi') setIsEmiOpen(true)
                                    if (btn.action === 'test-drive') setIsTestDriveOpen(true)
                                }}
                                asChild={!btn.action}
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

                {/* Car Image */}
                {imageSrc && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="relative mt-12 md:mt-16"
                    >
                        <div className="relative aspect-[16/9] md:aspect-[21/9] max-w-5xl mx-auto">
                            <Image
                                src={imageSrc}
                                alt={title}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                )}
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
        </section>
    )
}
