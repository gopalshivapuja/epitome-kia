'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const HEADER_LINKS = [
    { name: 'Models', href: '/models' },
    { name: 'Offers', href: '/offers' },
    { name: 'Services', href: '/service' },
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
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className={cn(
                "flex items-center justify-between px-6 py-4 transition-all duration-500",
                isScrolled ? "bg-white/90 backdrop-blur-md text-black shadow-sm" : "bg-transparent text-white"
            )}>
                {/* Logo */}
                <Link href="/" className="z-50 flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Epitome Kia"
                        width={120}
                        height={40}
                        className={cn("transition-all duration-300", isScrolled ? "invert-0" : "invert")}
                    />
                </Link>

                {/* Desktop Center Nav (Tesla Style) */}
                <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    {HEADER_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium tracking-wide hover:bg-black/5 dark:hover:bg-white/10 px-3 py-2 rounded transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4 z-50">
                    <Link href="/test-drive" className="hidden sm:block">
                        <span className="text-sm font-medium hover:bg-black/5 px-3 py-2 rounded transition-colors">
                            Test Drive
                        </span>
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-sm font-medium bg-black/5 dark:bg-white/10 px-4 py-2 rounded backdrop-blur-sm transition-colors hover:bg-black/10"
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
