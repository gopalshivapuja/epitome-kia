import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const pathname = nextUrl.pathname

  // Public routes - allow access
  if (pathname === '/admin/login') {
    // Redirect to dashboard if already logged in
    if (session) {
      return NextResponse.redirect(new URL('/admin', nextUrl.origin))
    }
    return NextResponse.next()
  }

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    // Redirect to login if not authenticated
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', nextUrl.origin))
    }

    // Role-based route protection
    // Only admins can access settings
    if (pathname.startsWith('/admin/settings') && session.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin', nextUrl.origin))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
