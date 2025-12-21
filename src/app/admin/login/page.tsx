'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Lock, Mail, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { COMPANY_INFO } from '@/lib/company-data'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setLoginError('Invalid email or password')
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setLoginError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="text-center">
        <CardTitle className="text-white">Dealer Login</CardTitle>
        <CardDescription className="text-gray-400">
          Enter your credentials to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(error || loginError) && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            <AlertCircle className="h-4 w-4" />
            {loginError || 'Authentication failed. Please try again.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-gray-300">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@epitomekia.in"
              required
              autoComplete="email"
              disabled={loading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2 text-gray-300">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={loading}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-kia-red hover:bg-kia-red-dark text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function LoginFormFallback() {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="text-center">
        <CardTitle className="text-white">Dealer Login</CardTitle>
        <CardDescription className="text-gray-400">
          Loading...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-kia-red" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src={COMPANY_INFO.logo}
              alt={COMPANY_INFO.brand}
              width={180}
              height={60}
              className="h-14 w-auto mx-auto"
            />
          </Link>
          <p className="mt-4 text-sm text-gray-500 uppercase tracking-widest">Dealer Portal</p>
        </div>

        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">
            &larr; Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
