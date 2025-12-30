import { cn } from '@/lib/utils'
import Link from 'next/link'

interface LogoProps {
  className?: string
  variant?: 'dark' | 'light' | 'auto'
  size?: 'sm' | 'md' | 'lg'
  asLink?: boolean
}

export function Logo({
  className,
  variant = 'dark',
  size = 'md',
  asLink = true
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  const variantClasses = {
    dark: 'text-kia-black',
    light: 'text-white',
    auto: '', // Color controlled by parent
  }

  const logoElement = (
    <span
      className={cn(
        "font-logo font-extrabold tracking-tight",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      EPITOME
    </span>
  )

  if (asLink) {
    return (
      <Link href="/" className="flex items-center">
        {logoElement}
      </Link>
    )
  }

  return logoElement
}
