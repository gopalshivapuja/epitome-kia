'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Menu, Bell, LogOut, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminSidebar } from './sidebar'

interface AdminHeaderProps {
  user: {
    name?: string | null
    email: string
    role?: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    sales_manager: 'Sales Manager',
    service_advisor: 'Service Advisor',
    staff: 'Staff',
  }

  return (
    <>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-kia-red" />
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-kia-red text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">{user.name || 'Admin'}</p>
                <p className="text-xs text-muted-foreground">
                  {user.role ? (roleLabels[user.role] || user.role) : 'Staff'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border bg-white py-1 shadow-lg">
                  <div className="border-b px-4 py-3">
                    <p className="font-medium">{user.name || 'Admin'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
