import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Tesla-style: Dark background with white text (primary CTA)
        default: 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]',

        // Tesla-style: White background with dark text (secondary CTA)
        outline: 'bg-white text-gray-900 border border-gray-300 hover:border-gray-400 active:scale-[0.98]',

        // Secondary: Light gray background
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.98]',

        // Ghost: Text only with subtle hover
        ghost: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',

        // Link style
        link: 'text-gray-900 underline-offset-4 hover:underline',

        // Destructive
        destructive: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',

        // Kia brand accent - use sparingly for key CTAs
        kia: 'bg-kia-red text-white hover:bg-kia-red-dark active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-6 py-2 text-sm',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-8 text-sm',
        xl: 'h-14 px-10 text-base font-medium',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
