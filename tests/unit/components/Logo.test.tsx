import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from '@/components/ui/logo'

describe('Logo Component', () => {
  it('should render EPITOME text', () => {
    render(<Logo asLink={false} />)
    expect(screen.getByText('EPITOME')).toBeInTheDocument()
  })

  it('should render as link by default', () => {
    render(<Logo />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/')
  })

  it('should not render as link when asLink is false', () => {
    render(<Logo asLink={false} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('EPITOME')).toBeInTheDocument()
  })

  it('should apply dark variant classes', () => {
    render(<Logo variant="dark" asLink={false} />)
    const logo = screen.getByText('EPITOME')
    expect(logo).toHaveClass('text-kia-black')
  })

  it('should apply light variant classes', () => {
    render(<Logo variant="light" asLink={false} />)
    const logo = screen.getByText('EPITOME')
    expect(logo).toHaveClass('text-white')
  })

  it('should apply size classes correctly', () => {
    const { rerender } = render(<Logo size="sm" asLink={false} />)
    expect(screen.getByText('EPITOME')).toHaveClass('text-xl')

    rerender(<Logo size="md" asLink={false} />)
    expect(screen.getByText('EPITOME')).toHaveClass('text-2xl')

    rerender(<Logo size="lg" asLink={false} />)
    expect(screen.getByText('EPITOME')).toHaveClass('text-3xl')
  })

  it('should apply custom className', () => {
    render(<Logo className="custom-class" asLink={false} />)
    expect(screen.getByText('EPITOME')).toHaveClass('custom-class')
  })

  it('should use font-logo font family', () => {
    render(<Logo asLink={false} />)
    expect(screen.getByText('EPITOME')).toHaveClass('font-logo')
  })

  it('should apply font-extrabold weight', () => {
    render(<Logo asLink={false} />)
    expect(screen.getByText('EPITOME')).toHaveClass('font-extrabold')
  })
})
