'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { COMPANY_INFO } from '@/lib/company-data'

export function GlassHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled ? 'glass py-2' : 'bg-transparent py-4'
                )}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-50 flex items-center gap-2 group">
                        <Image
                            src={COMPANY_INFO.logo}
                            alt={COMPANY_INFO.brand}
                            width={160}
                            height={50}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav (Minimal) */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                        {['Seltos', 'Sonet', 'Carens', 'EV6'].map((item) => (
                            <Link
                                key={item}
                                href={`/models/${item.toLowerCase()}`}
                                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-white/10 hidden sm:flex gap-2"
                            asChild
                        >
                            <Link href="/contact">
                                <MapPin className="w-4 h-4" />
                                <span className="hidden lg:inline">Find Us</span>
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Fullscreen Overlay Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col"
                    >
                        <div className="flex justify-end p-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <X className="w-8 h-8" />
                            </Button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center gap-8">
                            {['Models', 'Test Drive', 'Services', 'About Us', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                                    className="text-3xl font-heading font-bold text-white hover:text-primary transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        <div className="p-8 text-center text-white/50 text-sm">
                            <p>© 2025 Epitome Kia. All rights reserved.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
