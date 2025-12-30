'use client'

import { SessionProvider } from 'next-auth/react'

interface CustomerAuthProviderProps {
  children: React.ReactNode
}

export function CustomerAuthProvider({ children }: CustomerAuthProviderProps) {
  return (
    <SessionProvider basePath="/api/auth/customer">
      {children}
    </SessionProvider>
  )
}
