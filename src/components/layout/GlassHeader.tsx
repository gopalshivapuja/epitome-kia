'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'

// Main models shown in nav
const MAIN_MODELS = ['Seltos', 'Sonet', 'Carens', 'EV6']

// Additional models in dropdown
const MORE_MODELS = [
    { name: 'Syros', slug: 'syros', badge: 'New' },
    { name: 'EV9', slug: 'ev9', badge: 'Premium' },
    { name: 'Carnival', slug: 'carnival', badge: 'Premium' },
    { name: 'Clavis', slug: 'clavis', badge: 'Coming Soon' },
    { name: 'Clavis EV', slug: 'clavis-ev', badge: 'Coming Soon' },
]

export function GlassHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const moreRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setIsMoreOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm'
                        : 'bg-black/20 backdrop-blur-sm py-4'
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <div className="relative z-50">
                        <Logo
                            variant={isScrolled ? 'dark' : 'light'}
                            size="lg"
                        />
                    </div>

                    {/* Desktop Nav - Tesla style centered */}
                    <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
                        {MAIN_MODELS.map((item) => (
                            <Link
                                key={item}
                                href={`/models/${item.toLowerCase()}`}
                                className={cn(
                                    "text-sm font-medium transition-colors duration-200",
                                    isScrolled
                                        ? "text-gray-700 hover:text-gray-900"
                                        : "text-white hover:text-white/80"
                                )}
                            >
                                {item}
                            </Link>
                        ))}

                        {/* More Models Dropdown */}
                        <div className="relative" ref={moreRef}>
                            <button
                                onClick={() => setIsMoreOpen(!isMoreOpen)}
                                className={cn(
                                    "text-sm font-medium transition-colors duration-200 flex items-center gap-1",
                                    isScrolled
                                        ? "text-gray-700 hover:text-gray-900"
                                        : "text-white hover:text-white/80"
                                )}
                            >
                                More
                                <ChevronDown className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    isMoreOpen && "rotate-180"
                                )} />
                            </button>

                            <AnimatePresence>
                                {isMoreOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                                    >
                                        {MORE_MODELS.map((model) => (
                                            <Link
                                                key={model.slug}
                                                href={`/models/${model.slug}`}
                                                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsMoreOpen(false)}
                                            >
                                                <span>{model.name}</span>
                                                {model.badge && (
                                                    <span className={cn(
                                                        "text-xs px-2 py-0.5 rounded-full",
                                                        model.badge === 'New' && "bg-green-100 text-green-700",
                                                        model.badge === 'Premium' && "bg-purple-100 text-purple-700",
                                                        model.badge === 'Coming Soon' && "bg-orange-100 text-orange-700"
                                                    )}>
                                                        {model.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Test Drive CTA Button - visible on both mobile and desktop */}
                        <Button
                            variant="kia"
                            size="sm"
                            asChild
                            className="hidden sm:inline-flex"
                        >
                            <Link href="/test-drive">
                                Book Test Drive
                            </Link>
                        </Button>

                        {/* Mobile Test Drive - smaller */}
                        <Button
                            variant="kia"
                            size="sm"
                            asChild
                            className="sm:hidden text-xs px-3"
                        >
                            <Link href="/test-drive">
                                Test Drive
                            </Link>
                        </Button>

                        <button
                            className={cn(
                                "p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors rounded-md",
                                isScrolled
                                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                    : "text-white hover:text-white/80 hover:bg-white/10"
                            )}
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" strokeWidth={2} />
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
                            <Logo
                                variant="dark"
                                size="lg"
                                asLink={true}
                            />
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
                                { name: 'Compare', href: '/compare' },
                                { name: 'Test Drive', href: '/test-drive' },
                                { name: 'Service', href: '/service' },
                                { name: 'EMI Calculator', href: '/emi-calculator' },
                                { name: 'Offers', href: '/offers' },
                                { name: 'FAQ', href: '/faq' },
                                { name: 'Contact', href: '/contact' },
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
