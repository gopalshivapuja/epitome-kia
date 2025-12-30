import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Get the Kia India brochure URL for a model
 * @param slug - The model slug (e.g., 'seltos', 'sonet', 'ev6')
 * @returns The brochure PDF URL from Kia India
 */
export function getKiaBrochureUrl(slug: string): string {
  // Kia India brochure URL pattern
  return `https://www.kia.com/content/dam/kia2/in/en/our-vehicles/${slug}/download/${slug}-brochure.pdf`
}
