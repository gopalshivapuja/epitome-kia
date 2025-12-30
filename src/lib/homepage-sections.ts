// Homepage sections configuration - static metadata (prices fetched from database)

export type HomepageSection = {
  id: string
  modelSlug: string
  title: string
  subtitle: string
  imageSrc: string
  isFirst?: boolean
  buttons: {
    label: string
    href?: string
    variant: 'primary' | 'outline'
    action?: 'emi' | 'test-drive'
  }[]
}

export const HOMEPAGE_SECTIONS: HomepageSection[] = [
  // Hero - The All-New Seltos (featured - Jan 2025 launch)
  {
    id: 'seltos',
    modelSlug: 'seltos',
    title: 'The All-New Seltos',
    subtitle: 'Badass. Forever.',
    imageSrc: '/models/seltos.png',
    isFirst: true,
    buttons: [
      { label: 'Explore', href: '/models/seltos', variant: 'primary' },
      { label: 'Test Drive', variant: 'outline', action: 'test-drive' },
    ],
  },
  // Syros - NEW (launched Dec 2025)
  {
    id: 'syros',
    modelSlug: 'syros',
    title: 'Kia Syros',
    subtitle: 'Bold. Compact. Progressive.',
    imageSrc: '/models/syros.png',
    buttons: [
      { label: 'Explore', href: '/models/syros', variant: 'primary' },
      { label: 'Test Drive', variant: 'outline', action: 'test-drive' },
    ],
  },
  // Sonet
  {
    id: 'sonet',
    modelSlug: 'sonet',
    title: 'New Sonet',
    subtitle: 'The Wild. Reborn.',
    imageSrc: '/models/sonet.png',
    buttons: [
      { label: 'Explore', href: '/models/sonet', variant: 'primary' },
      { label: 'Test Drive', variant: 'outline', action: 'test-drive' },
    ],
  },
  // Carens
  {
    id: 'carens',
    modelSlug: 'carens',
    title: 'Kia Carens',
    subtitle: 'Space for Everything.',
    imageSrc: '/models/carens.png',
    buttons: [
      { label: 'Explore', href: '/models/carens', variant: 'primary' },
      { label: 'Test Drive', variant: 'outline', action: 'test-drive' },
    ],
  },
  // EV6
  {
    id: 'ev6',
    modelSlug: 'ev6',
    title: 'Kia EV6',
    subtitle: 'Fully Electric. Fully Charged.',
    imageSrc: '/models/ev6.png',
    buttons: [
      { label: 'Explore', href: '/models/ev6', variant: 'primary' },
      { label: 'Test Drive', variant: 'outline', action: 'test-drive' },
    ],
  },
  // EV9
  {
    id: 'ev9',
    modelSlug: 'ev9',
    title: 'Kia EV9',
    subtitle: 'The Future of Electric.',
    imageSrc: '/models/ev9.png',
    buttons: [
      { label: 'Explore', href: '/models/ev9', variant: 'primary' },
      { label: 'Test Drive', variant: 'outline', action: 'test-drive' },
    ],
  },
  // Carnival
  {
    id: 'carnival',
    modelSlug: 'carnival',
    title: 'Kia Carnival',
    subtitle: 'The Grand Experience.',
    imageSrc: '/models/carnival.png',
    buttons: [
      { label: 'Explore', href: '/models/carnival', variant: 'primary' },
      { label: 'Test Drive', variant: 'outline', action: 'test-drive' },
    ],
  },
]
