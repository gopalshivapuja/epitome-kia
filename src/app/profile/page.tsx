import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { customerAuth } from '@/lib/auth-customer'
import { prisma } from '@/lib/db'
import { Heart, Bell, Car, Settings, Calendar, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'My Profile | Epitome Kia',
  description: 'Manage your Epitome Kia account, saved models, and preferences.',
}

export default async function ProfilePage() {
  const session = await customerAuth()

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/profile')
  }

  // Fetch customer data
  const customer = await prisma.customer.findUnique({
    where: { email: session.user.email },
    include: {
      alerts: {
        where: { isActive: true, deletedAt: null },
        take: 5,
      },
      configurations: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!customer) {
    redirect('/login')
  }

  const quickActions = [
    {
      href: '/test-drive',
      icon: Calendar,
      title: 'Book Test Drive',
      description: 'Schedule a test drive',
    },
    {
      href: '/service',
      icon: Wrench,
      title: 'Book Service',
      description: 'Schedule maintenance',
    },
    {
      href: '/models',
      icon: Car,
      title: 'Explore Models',
      description: 'Browse our lineup',
    },
    {
      href: '/configure',
      icon: Settings,
      title: 'Configure Car',
      description: 'Build your Kia',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-kia-red text-white flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user.name || 'Welcome!'}
              </h1>
              <p className="text-gray-500">{session.user.email}</p>
              {customer.phone && (
                <p className="text-gray-500">{customer.phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-kia-red/30 hover:bg-kia-red/5 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-full bg-kia-red/10 flex items-center justify-center">
                      <action.icon className="h-6 w-6 text-kia-red" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Saved Models */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-kia-red" />
                  Saved Models
                </h2>
                <Link href="/profile/saved" className="text-sm text-kia-red hover:underline">
                  View All
                </Link>
              </div>
              {customer.savedModels.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {customer.savedModels.slice(0, 4).map((modelSlug) => (
                    <Link
                      key={modelSlug}
                      href={`/models/${modelSlug}`}
                      className="p-4 rounded-xl border border-gray-100 hover:border-kia-red/30 transition-colors"
                    >
                      <p className="font-medium text-gray-900 capitalize">
                        Kia {modelSlug.replace('-', ' ')}
                      </p>
                      <p className="text-sm text-gray-500">View details</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No saved models yet</p>
                  <Link href="/models">
                    <Button variant="outline" size="sm" className="mt-3">
                      Browse Models
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Alerts */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-kia-red" />
                  Price Alerts
                </h2>
                <Link href="/profile/alerts" className="text-sm text-kia-red hover:underline">
                  Manage
                </Link>
              </div>
              {customer.alerts.length > 0 ? (
                <ul className="space-y-3">
                  {customer.alerts.map((alert) => (
                    <li
                      key={alert.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm capitalize">
                          {alert.modelSlug ? `Kia ${alert.modelSlug}` : 'All Models'}
                        </p>
                        <p className="text-xs text-gray-500">{alert.alertType.replace('_', ' ')}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        Active
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No active alerts</p>
                  <Link href="/models">
                    <Button variant="outline" size="sm" className="mt-3">
                      Set Price Alert
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account
              </h2>
              <nav className="space-y-2">
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
