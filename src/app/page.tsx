'use client'

import { FullscreenSection } from '@/components/layout/FullscreenSection'
import { Footer } from '@/components/layout/footer'

// Homepage sections featuring all Kia models - Tesla-style layout
const SECTIONS = [
  // Hero - Seltos (featured)
  {
    id: 'seltos',
    title: 'New Seltos',
    subtitle: 'The Badass. Reborn.',
    price: 'Starting from ₹10.90 Lakh*',
    imageSrc: '/models/seltos.png',
    isFirst: true,
    buttons: [
      { label: 'Order Now', href: '/models/seltos', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Sonet
  {
    id: 'sonet',
    title: 'New Sonet',
    subtitle: 'The Wild. Reborn.',
    price: 'Starting from ₹7.99 Lakh*',
    imageSrc: '/models/sonet.png',
    buttons: [
      { label: 'Order Now', href: '/models/sonet', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Syros - NEW
  {
    id: 'syros',
    title: 'Kia Syros',
    subtitle: 'Bold. Compact. Progressive.',
    price: 'Coming Soon',
    imageSrc: '/models/syros.png',
    buttons: [
      { label: 'Register Interest', href: '/models/syros', variant: 'primary' as const },
      { label: 'Learn More', href: '/models/syros', variant: 'outline' as const }
    ]
  },
  // Carens
  {
    id: 'carens',
    title: 'Kia Carens',
    subtitle: 'Space for Everything.',
    price: 'Starting from ₹10.52 Lakh*',
    imageSrc: '/models/carens.png',
    buttons: [
      { label: 'Order Now', href: '/models/carens', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // EV6
  {
    id: 'ev6',
    title: 'Kia EV6',
    subtitle: 'Fully Electric. Fully Charged.',
    price: 'Starting from ₹60.95 Lakh*',
    imageSrc: '/models/ev6.png',
    buttons: [
      { label: 'Order Now', href: '/models/ev6', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // EV9 - NEW
  {
    id: 'ev9',
    title: 'Kia EV9',
    subtitle: 'The Future of Electric.',
    price: 'Starting from ₹1.30 Crore*',
    imageSrc: '/models/ev9.png',
    buttons: [
      { label: 'Order Now', href: '/models/ev9', variant: 'primary' as const },
      { label: 'Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Carnival
  {
    id: 'carnival',
    title: 'Kia Carnival',
    subtitle: 'The Grand Experience.',
    price: 'Starting from ₹63.90 Lakh*',
    imageSrc: '/models/carnival.png',
    buttons: [
      { label: 'Order Now', href: '/models/carnival', variant: 'primary' as const },
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
      <Footer />
    </main>
  )
}
