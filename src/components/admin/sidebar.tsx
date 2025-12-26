'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Car,
  Tag,
  Calendar,
  Wrench,
  MessageSquare,
  FileText,
  Settings,
  X,
  DollarSign,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Test Drives', href: '/admin/test-drives', icon: Calendar },
  { name: 'Service Bookings', href: '/admin/service-bookings', icon: Wrench },
  { name: 'Models', href: '/admin/models', icon: Car },
  { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
  { name: 'Offers', href: '/admin/offers', icon: Tag },
  { name: 'Chat Sessions', href: '/admin/chats', icon: MessageSquare },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminSidebarProps {
  open?: boolean
  onClose?: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-kia-black transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">
              Epitome <span className="text-kia-red">Kia</span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-white lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-kia-red text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
                onClick={onClose}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="rounded-lg bg-gray-800 p-3">
            <p className="text-xs text-gray-400">Admin Portal v1.0</p>
            <Link
              href="/"
              className="mt-1 text-xs text-kia-red hover:underline"
            >
              View Website &rarr;
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
