import type { Metadata } from 'next'
import './globals.css'
import { Header, Footer } from '@/components/layout'

export const metadata: Metadata = {
  title: {
    default: 'Epitome Kia | Authorized Kia Dealer',
    template: '%s | Epitome Kia',
  },
  description:
    'Epitome Kia - Your trusted authorized Kia dealership. Explore new Kia models, book test drives, schedule service appointments, and discover exclusive offers.',
  keywords: [
    'Kia',
    'Kia dealer',
    'Kia cars',
    'Seltos',
    'Sonet',
    'Carens',
    'EV6',
    'test drive',
    'car service',
  ],
  authors: [{ name: 'Epitome Kia' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Epitome Kia',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
