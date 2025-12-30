import { describe, it, expect } from 'vitest'
import { cn, formatPrice, formatDate, slugify, getKiaBrochureUrl } from '@/lib/utils'

describe('cn - className merge utility', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})

describe('formatPrice', () => {
  it('should format price in INR', () => {
    expect(formatPrice(1000000)).toContain('10,00,000')
  })

  it('should handle zero', () => {
    expect(formatPrice(0)).toContain('0')
  })

  it('should handle large numbers', () => {
    expect(formatPrice(10000000)).toContain('1,00,00,000')
  })
})

describe('formatDate', () => {
  it('should format date correctly', () => {
    const result = formatDate(new Date('2025-01-15'))
    expect(result).toContain('January')
    expect(result).toContain('2025')
  })

  it('should handle string dates', () => {
    const result = formatDate('2025-06-20')
    expect(result).toContain('June')
    expect(result).toContain('2025')
  })
})

describe('slugify', () => {
  it('should convert text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })

  it('should handle multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world')
  })

  it('should handle underscores', () => {
    expect(slugify('hello_world')).toBe('hello-world')
  })
})

describe('getKiaBrochureUrl', () => {
  it('should return correct brochure URL for seltos', () => {
    const url = getKiaBrochureUrl('seltos')
    expect(url).toBe('https://www.kia.com/content/dam/kia2/in/en/our-vehicles/seltos/download/seltos-brochure.pdf')
  })

  it('should return correct brochure URL for sonet', () => {
    const url = getKiaBrochureUrl('sonet')
    expect(url).toBe('https://www.kia.com/content/dam/kia2/in/en/our-vehicles/sonet/download/sonet-brochure.pdf')
  })

  it('should return correct brochure URL for carens', () => {
    const url = getKiaBrochureUrl('carens')
    expect(url).toBe('https://www.kia.com/content/dam/kia2/in/en/our-vehicles/carens/download/carens-brochure.pdf')
  })

  it('should return correct brochure URL for ev6', () => {
    const url = getKiaBrochureUrl('ev6')
    expect(url).toBe('https://www.kia.com/content/dam/kia2/in/en/our-vehicles/ev6/download/ev6-brochure.pdf')
  })

  it('should handle any slug', () => {
    const url = getKiaBrochureUrl('custom-model')
    expect(url).toContain('custom-model')
    expect(url).toContain('brochure.pdf')
  })
})
