'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Heart, Bell, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
    )
  }

  if (!session?.user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      </Link>
    )
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || 'User'}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-kia-red text-white flex items-center justify-center">
            <span className="text-sm font-medium">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
            </span>
          </div>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  href="/profile/saved"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Heart className="h-4 w-4" />
                  Saved Models
                </Link>
                <Link
                  href="/profile/alerts"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Bell className="h-4 w-4" />
                  Price Alerts
                </Link>
                <Link
                  href="/profile/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>

              {/* Sign out */}
              <div className="border-t py-1">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
