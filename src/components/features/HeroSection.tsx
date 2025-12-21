'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronDown } from 'lucide-react'

export function HeroSection() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-kia-black">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover opacity-60"
                >
                    {/* Using a placeholder/sourced Kia video or generic refined car video */}
                    <source src="https://videos.pexels.com/video-files/3840441/3840441-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                </video>
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-kia-black via-kia-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="container relative z-10 flex h-full flex-col justify-center pt-20 text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-3xl"
                >
                    <h2 className="mb-4 text-lg font-medium tracking-[0.2em] text-kia-red uppercase">
                        Movement that Inspires
                    </h2>
                    <h1 className="mb-6 font-heading text-6xl font-black leading-tight tracking-tight md:text-8xl">
                        THE NEW <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            AUTHORITY
                        </span>
                    </h1>
                    <p className="mb-8 max-w-xl text-lg text-gray-300 md:text-xl font-light">
                        Experience the future of mobility with Epitome Kia.
                        Discover award-winning designs and cutting-edge technology.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="rounded-full bg-kia-red hover:bg-kia-red-dark text-white px-8 h-12 text-base" asChild>
                            <Link href="/models">Explore Models</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-black px-8 h-12 text-base group" asChild>
                            <Link href="/test-drive">
                                Book Test Drive <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 transform text-white flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-widest opacity-70">Scroll</span>
                <ChevronDown className="h-6 w-6 animate-bounce opacity-70" />
            </motion.div>
        </section>
    )
}
