'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
        <p className="mb-6 text-muted-foreground">
          An error occurred while loading this page. Please try again or contact support if the
          problem persists.
        </p>
        {error.digest && (
          <p className="mb-4 font-mono text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="kia">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <Home className="mr-2 h-4 w-4" />
              Dashboard Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
