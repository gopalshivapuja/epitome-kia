'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
    const phoneNumber = '918047363737' // Epitome general sales/service line from research
    const message = 'Hi Epitome Kia, I would like to inquire about Kia models.'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#20ba5a] transition-colors"
            aria-label="Contact us on WhatsApp"
        >
            <MessageCircle className="h-6 w-6 fill-current" />
            <span className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                Chat with us
            </span>
        </motion.a>
    )
}
