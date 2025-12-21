import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { GlassHeader } from '@/components/layout/GlassHeader'
import { WhatsAppButton } from '@/components/features/WhatsAppButton'
import { Footer } from '@/components/layout/footer'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'Epitome Kia | Best Kia Dealer in Bangalore',
  description: 'Experience the new standard of automotive excellence at Epitome Kia. Book test drives, explore offers, and service your Kia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.variable, outfit.variable, 'font-sans antialiased')}>
        <div className="flex min-h-screen flex-col">
          <GlassHeader />
          <WhatsAppButton />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
