'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { COMPANY_INFO } from '@/lib/company-data'

export function GlassHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm'
                        : 'bg-transparent py-4'
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-50 flex items-center">
                        <Image
                            src={COMPANY_INFO.logo}
                            alt={COMPANY_INFO.brand}
                            width={140}
                            height={45}
                            className="h-8 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav - Tesla style centered */}
                    <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
                        {['Seltos', 'Sonet', 'Carens', 'EV6'].map((item) => (
                            <Link
                                key={item}
                                href={`/models/${item.toLowerCase()}`}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/test-drive"
                            className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Test Drive
                        </Link>
                        <button
                            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Fullscreen Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6">
                            <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                <Image
                                    src={COMPANY_INFO.logo}
                                    alt={COMPANY_INFO.brand}
                                    width={140}
                                    height={45}
                                    className="h-8 w-auto"
                                />
                            </Link>
                            <button
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Menu Links */}
                        <div className="flex-1 flex flex-col items-start justify-center px-12 gap-4">
                            {[
                                { name: 'Models', href: '/models' },
                                { name: 'Service', href: '/service' },
                                { name: 'EMI Calculator', href: '/emi-calculator' },
                                { name: 'Offers', href: '/offers' },
                                { name: 'Schedule Consultation', href: '/contact' },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="text-2xl md:text-3xl font-medium text-gray-900 hover:text-gray-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100">
                            <p className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} Epitome Kia
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
