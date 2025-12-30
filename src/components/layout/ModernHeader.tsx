'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

const HEADER_LINKS = [
    { name: 'Models', href: '/models' },
    { name: 'Compare', href: '/compare' },
    { name: 'Offers', href: '/offers' },
    { name: 'Service', href: '/service' },
    { name: 'Contact', href: '/contact' },
]

export function ModernHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className={cn(
                "flex items-center justify-between px-6 transition-all duration-300",
                isScrolled
                    ? "py-3 bg-white shadow-md"
                    : "py-4 bg-white shadow-sm"
            )}>
                {/* Logo */}
                <div className="z-50">
                    <Logo variant="dark" size="lg" />
                </div>

                {/* Desktop Center Nav */}
                <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                    {HEADER_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded transition-colors hover:bg-gray-100"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3 z-50">
                    <Link
                        href="/test-drive"
                        className="hidden sm:inline-flex items-center justify-center bg-kia-red text-white hover:bg-kia-red-dark px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                        Book Test Drive
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-sm font-medium px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors lg:hidden"
                    >
                        {isMenuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </div>

            {/* Fullscreen Mobile/Overlay Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[300px] bg-white text-black shadow-2xl z-40 p-8 flex flex-col pt-24"
                    >
                        <nav className="flex flex-col gap-2">
                            {HEADER_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-medium py-3 px-4 hover:bg-gray-100 rounded transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/test-drive"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg font-medium py-3 px-4 hover:bg-gray-100 rounded transition-colors"
                            >
                                Book Test Drive
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
                />
            )}
        </header>
    )
}
