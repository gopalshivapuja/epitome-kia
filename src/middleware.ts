import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Security headers to add to all responses
 * These help protect against common web vulnerabilities
 */
const securityHeaders = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter in browsers
  'X-XSS-Protection': '1; mode=block',
  
  // Control referrer information sent with requests
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Restrict use of browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  
  // Content Security Policy - adjust as needed for your specific requirements
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const pathname = nextUrl.pathname

  // Create base response
  let response: NextResponse

  // Public routes - allow access
  if (pathname === '/admin/login') {
    // Redirect to dashboard if already logged in
    if (session) {
      response = NextResponse.redirect(new URL('/admin', nextUrl.origin))
    } else {
      response = NextResponse.next()
    }
    return addSecurityHeaders(response)
  }

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    // Redirect to login if not authenticated
    if (!session) {
      response = NextResponse.redirect(new URL('/admin/login', nextUrl.origin))
      return addSecurityHeaders(response)
    }

    // Role-based route protection
    // Only admins can access settings
    if (pathname.startsWith('/admin/settings') && session.user?.role !== 'admin') {
      response = NextResponse.redirect(new URL('/admin', nextUrl.origin))
      return addSecurityHeaders(response)
    }
  }

  response = NextResponse.next()
  return addSecurityHeaders(response)
})

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
