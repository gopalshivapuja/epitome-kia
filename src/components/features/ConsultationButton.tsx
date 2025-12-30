'use client'

import { useState } from 'react'
import { Calendar, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConsultationModal } from './ConsultationModal'

interface ConsultationButtonProps {
  modelName?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function ConsultationButton({
  modelName,
  variant = 'default',
  size = 'default',
  className,
  children
}: ConsultationButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {children || (
          <>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Consultation
          </>
        )}
      </Button>
      <ConsultationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modelName={modelName}
      />
    </>
  )
}
