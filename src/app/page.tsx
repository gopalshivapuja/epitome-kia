'use client'

import { FullscreenSection } from '@/components/layout/FullscreenSection'
import { Footer } from '@/components/layout/footer'
import { GoogleReviews } from '@/components/features/GoogleReviews'

// Homepage sections featuring all Kia models - Tesla-style layout
const SECTIONS = [
  // Hero - The All-New Seltos (featured - Jan 2025 launch)
  {
    id: 'seltos',
    title: 'The All-New Seltos',
    subtitle: 'Badass. Forever.',
    price: 'The original game changer. Now ready for its next move.',
    imageSrc: '/models/seltos.png',
    isFirst: true,
    buttons: [
      { label: 'Explore', href: '/models/seltos', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Syros - NEW (launched Dec 2025)
  {
    id: 'syros',
    title: 'Kia Syros',
    subtitle: 'Bold. Compact. Progressive.',
    price: 'Starting from ₹8.67 Lakh*',
    imageSrc: '/models/syros.png',
    buttons: [
      { label: 'Explore', href: '/models/syros', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Sonet
  {
    id: 'sonet',
    title: 'New Sonet',
    subtitle: 'The Wild. Reborn.',
    price: 'Starting from ₹7.30 Lakh*',
    imageSrc: '/models/sonet.png',
    buttons: [
      { label: 'Explore', href: '/models/sonet', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Carens
  {
    id: 'carens',
    title: 'Kia Carens',
    subtitle: 'Space for Everything.',
    price: 'Starting from ₹10.99 Lakh*',
    imageSrc: '/models/carens.png',
    buttons: [
      { label: 'Explore', href: '/models/carens', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // EV6
  {
    id: 'ev6',
    title: 'Kia EV6',
    subtitle: 'Fully Electric. Fully Charged.',
    price: 'Starting from ₹65.90 Lakh*',
    imageSrc: '/models/ev6.png',
    buttons: [
      { label: 'Explore', href: '/models/ev6', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // EV9
  {
    id: 'ev9',
    title: 'Kia EV9',
    subtitle: 'The Future of Electric.',
    price: 'Starting from ₹1.30 Crore*',
    imageSrc: '/models/ev9.png',
    buttons: [
      { label: 'Explore', href: '/models/ev9', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Carnival
  {
    id: 'carnival',
    title: 'Kia Carnival',
    subtitle: 'The Grand Experience.',
    price: 'Starting from ₹59.42 Lakh*',
    imageSrc: '/models/carnival.png',
    buttons: [
      { label: 'Explore', href: '/models/carnival', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
]

export default function Home() {
  return (
    <main className="bg-white">
      {SECTIONS.map((section, idx) => (
        <FullscreenSection
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          price={section.price}
          imageSrc={section.imageSrc}
          buttons={section.buttons}
          isFirst={idx === 0}
        />
      ))}

      {/* Customer Reviews Section - fetches from Google Places API */}
      <GoogleReviews />

      <Footer />
    </main>
  )
}
