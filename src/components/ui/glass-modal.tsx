'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GlassModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    className?: string
}

export function GlassModal({ isOpen, onClose, title, children, className }: GlassModalProps) {
    // Lock body scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className={cn(
                                "w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl pointer-events-auto",
                                className
                            )}
                        >
                            <div className="flex items-center justify-between border-b border-white/10 p-4 md:p-6">
                                {title && <h2 className="text-xl font-heading font-semibold text-white">{title}</h2>}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white/70 hover:text-white hover:bg-white/10 -mr-2"
                                    onClick={onClose}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-4 md:p-6 text-white overflow-y-auto max-h-[80vh]">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
