'use client'

import { FullscreenSection } from '@/components/layout/FullscreenSection'
import { Footer } from '@/components/layout/footer'
import { CAR_MODELS } from '@/lib/company-data'

// Homepage sections featuring all Kia models
const SECTIONS = [
  {
    id: 'hero',
    title: 'Experience the Future',
    subtitle: 'Epitome Kia - Your Authorized Kia Dealer in Bangalore',
    videoSrc: '/hero-video.mp4',
    isFirst: true,
    buttons: [
      { label: 'View Inventory', href: '/models', variant: 'primary' as const },
      { label: 'Book Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Featured models - Seltos
  {
    id: 'seltos',
    title: 'New Seltos',
    subtitle: 'The Badass. Reborn. Starting from ₹10.90 Lakh*',
    imageSrc: '/models/seltos.png',
    buttons: [
      { label: 'Order Now', href: '/models/seltos', variant: 'primary' as const },
      { label: 'Calculate EMI', variant: 'outline' as const, action: 'emi' as const }
    ]
  },
  // Sonet
  {
    id: 'sonet',
    title: 'New Sonet',
    subtitle: 'The Wild. Reborn. Starting from ₹7.99 Lakh*',
    imageSrc: '/models/sonet.png',
    buttons: [
      { label: 'Order Now', href: '/models/sonet', variant: 'primary' as const },
      { label: 'Calculate EMI', variant: 'outline' as const, action: 'emi' as const }
    ]
  },
  // Syros - NEW
  {
    id: 'syros',
    title: 'Kia Syros',
    subtitle: 'Bold. Compact. Progressive. Coming Soon.',
    imageSrc: '/models/syros.png',
    buttons: [
      { label: 'Register Interest', href: '/models/syros', variant: 'primary' as const },
      { label: 'Explore Features', href: '/models/syros', variant: 'outline' as const }
    ]
  },
  // Carens
  {
    id: 'carens',
    title: 'Kia Carens',
    subtitle: 'Space for Everything. Starting from ₹10.52 Lakh*',
    imageSrc: '/models/carens.png',
    buttons: [
      { label: 'Order Now', href: '/models/carens', variant: 'primary' as const },
      { label: 'Calculate EMI', variant: 'outline' as const, action: 'emi' as const }
    ]
  },
  // Clavis - NEW
  {
    id: 'clavis',
    title: 'Kia Clavis',
    subtitle: 'The New Urban SUV. Coming Soon.',
    imageSrc: '/models/clavis.png',
    buttons: [
      { label: 'Register Interest', href: '/models/clavis', variant: 'primary' as const },
      { label: 'Explore Features', href: '/models/clavis', variant: 'outline' as const }
    ]
  },
  // EV6
  {
    id: 'ev6',
    title: 'Kia EV6',
    subtitle: 'Fully Electric. Fully Charged. Starting from ₹60.95 Lakh*',
    imageSrc: '/models/ev6.png',
    buttons: [
      { label: 'Order Now', href: '/models/ev6', variant: 'primary' as const },
      { label: 'Calculate EMI', variant: 'outline' as const, action: 'emi' as const }
    ]
  },
  // EV9 - NEW
  {
    id: 'ev9',
    title: 'Kia EV9',
    subtitle: 'The Future of Electric. Starting from ₹1.30 Crore*',
    imageSrc: '/models/ev9.png',
    buttons: [
      { label: 'Order Now', href: '/models/ev9', variant: 'primary' as const },
      { label: 'Book Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
  // Carnival
  {
    id: 'carnival',
    title: 'Kia Carnival',
    subtitle: 'The Grand Experience. Starting from ₹63.90 Lakh*',
    imageSrc: '/models/carnival.png',
    buttons: [
      { label: 'Order Now', href: '/models/carnival', variant: 'primary' as const },
      { label: 'Book Test Drive', variant: 'outline' as const, action: 'test-drive' as const }
    ]
  },
]

export default function Home() {
  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
      {SECTIONS.map((section, idx) => (
        <FullscreenSection
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          imageSrc={section.imageSrc}
          videoSrc={section.videoSrc}
          buttons={section.buttons}
          isFirst={idx === 0}
        />
      ))}
      <div className="snap-start">
        <Footer />
      </div>
    </div>
  )
}
