'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CheckCircle,
  XCircle,
  Trash2,
  MoreHorizontal,
  Calendar,
  Loader2,
  Eye,
  Edit,
} from 'lucide-react'

interface StatusUpdateProps {
  id: string
  endpoint: string
  currentStatus: string
  onSuccess?: () => void
}

/**
 * Component for updating test drive or service booking status
 */
export function TestDriveStatusActions({ 
  id, 
  currentStatus, 
  onSuccess 
}: Omit<StatusUpdateProps, 'endpoint'>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const updateStatus = async (newStatus: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/test-drive/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to update status')
        }

        router.refresh()
        onSuccess?.()
      } catch (error) {
        console.error('Failed to update status:', error)
        alert(error instanceof Error ? error.message : 'Failed to update status')
      }
    })
  }

  if (currentStatus === 'completed' || currentStatus === 'cancelled') {
    return <span className="text-xs text-muted-foreground">No actions</span>
  }

  return (
    <div className="flex justify-end gap-1">
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {currentStatus === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => updateStatus('scheduled')}
              disabled={isPending}
              title="Schedule test drive"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          )}
          {(currentStatus === 'pending' || currentStatus === 'scheduled') && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => updateStatus('completed')}
                disabled={isPending}
                title="Mark as completed"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => updateStatus('cancelled')}
                disabled={isPending}
                title="Cancel test drive"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Component for updating service booking status
 */
export function ServiceBookingStatusActions({ 
  id, 
  currentStatus, 
  onSuccess 
}: Omit<StatusUpdateProps, 'endpoint'>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const updateStatus = async (newStatus: string) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/service-booking/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to update status')
        }

        router.refresh()
        onSuccess?.()
      } catch (error) {
        console.error('Failed to update status:', error)
        alert(error instanceof Error ? error.message : 'Failed to update status')
      }
    })
  }

  if (currentStatus === 'completed' || currentStatus === 'cancelled') {
    return <span className="text-xs text-muted-foreground">No actions</span>
  }

  return (
    <div className="flex justify-end gap-1">
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {currentStatus === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => updateStatus('scheduled')}
              disabled={isPending}
              title="Schedule service"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          )}
          {(currentStatus === 'pending' || currentStatus === 'scheduled') && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => updateStatus('completed')}
                disabled={isPending}
                title="Mark as completed"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => updateStatus('cancelled')}
                disabled={isPending}
                title="Cancel service"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </>
      )}
    </div>
  )
}

interface DeleteActionProps {
  id: string
  endpoint: string
  itemName: string
  onSuccess?: () => void
}

/**
 * Reusable delete confirmation dialog
 */
export function DeleteAction({ id, endpoint, itemName, onSuccess }: DeleteActionProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`${endpoint}/${id}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to delete')
        }

        setOpen(false)
        router.refresh()
        onSuccess?.()
      } catch (error) {
        console.error('Failed to delete:', error)
        alert(error instanceof Error ? error.message : 'Failed to delete')
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the {itemName}. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface OfferActionsProps {
  id: string
  slug: string
}

/**
 * Actions dropdown for offers
 */
export function OfferActions({ id, slug }: OfferActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this offer?')) return

    startTransition(async () => {
      try {
        const res = await fetch(`/api/offers/${id}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to delete offer')
        }

        router.refresh()
      } catch (error) {
        console.error('Failed to delete offer:', error)
        alert(error instanceof Error ? error.message : 'Failed to delete offer')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.open(`/offers/${slug}`, '_blank')}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/offers/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface BlogPostActionsProps {
  id: string
  slug: string
}

/**
 * Actions dropdown for blog posts
 */
export function BlogPostActions({ id, slug }: BlogPostActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    startTransition(async () => {
      try {
        const res = await fetch(`/api/blog-posts/${id}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to delete blog post')
        }

        router.refresh()
      } catch (error) {
        console.error('Failed to delete blog post:', error)
        alert(error instanceof Error ? error.message : 'Failed to delete blog post')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.open(`/blog/${slug}`, '_blank')}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/content/blog/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface PageActionsProps {
  id: string
  slug: string
}

/**
 * Actions dropdown for pages
 */
export function PageActions({ id, slug }: PageActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this page?')) return

    startTransition(async () => {
      try {
        const res = await fetch(`/api/pages/${id}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to delete page')
        }

        router.refresh()
      } catch (error) {
        console.error('Failed to delete page:', error)
        alert(error instanceof Error ? error.message : 'Failed to delete page')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.open(`/${slug}`, '_blank')}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/content/pages/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * CSV Export button for leads
 */
export function ExportLeadsButton() {
  const [isPending, startTransition] = useTransition()

  const handleExport = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/leads?limit=1000')
        if (!res.ok) throw new Error('Failed to fetch leads')
        
        const data = await res.json()
        const leads = data.data?.leads || []

        if (leads.length === 0) {
          alert('No leads to export')
          return
        }

        // Convert to CSV
        const headers = ['Name', 'Email', 'Phone', 'Source', 'Created At']
        const csvRows = [
          headers.join(','),
          ...leads.map((lead: { fullName: string; email?: string; phone?: string; source?: string; createdAt: string }) => 
            [
              `"${lead.fullName}"`,
              `"${lead.email || ''}"`,
              `"${lead.phone || ''}"`,
              `"${lead.source || ''}"`,
              `"${new Date(lead.createdAt).toLocaleString()}"`,
            ].join(',')
          ),
        ]

        // Download
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to export leads:', error)
        alert('Failed to export leads')
      }
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isPending}>
      {isPending ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : null}
      Export CSV
    </Button>
  )
}

