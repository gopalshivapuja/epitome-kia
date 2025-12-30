import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { customerAuth } from '@/lib/auth-customer'
import { Car, Heart, Bell, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In | Epitome Kia',
  description: 'Sign in to your Epitome Kia account to save models, get price alerts, and more.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const session = await customerAuth()
  const params = await searchParams

  // Redirect if already logged in
  if (session?.user) {
    redirect(params.callbackUrl || '/profile')
  }

  const benefits = [
    {
      icon: Heart,
      title: 'Save Your Favorites',
      description: 'Keep track of models you love',
    },
    {
      icon: Bell,
      title: 'Price Alerts',
      description: 'Get notified when prices drop',
    },
    {
      icon: Clock,
      title: 'Quick Booking',
      description: 'Faster test drive and service booking',
    },
    {
      icon: Car,
      title: 'Vehicle Configurator',
      description: 'Save and share your dream car',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Epitome Kia
            </h1>
            <p className="text-gray-600">
              Sign in to access personalized features
            </p>
          </div>

          {/* Error message */}
          {params.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {params.error === 'OAuthAccountNotLinked'
                ? 'This email is already associated with another account.'
                : 'An error occurred during sign in. Please try again.'}
            </div>
          )}

          {/* Sign in card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="space-y-4">
              <GoogleSignInButton
                callbackUrl={params.callbackUrl || '/profile'}
                className="w-full justify-center"
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Secure sign in with Google
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/privacy" className="text-kia-red hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-kia-red hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h2 className="text-center text-sm font-medium text-gray-500 uppercase tracking-wide">
              Why create an account?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <benefit.icon className="h-6 w-6 text-kia-red mb-2" />
                  <h3 className="font-medium text-gray-900 text-sm">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Continue without account */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Continue browsing without an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
