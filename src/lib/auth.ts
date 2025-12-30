import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'
import { rateLimit, rateLimitConfigs } from './rate-limit'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Rate limiting: 5 attempts per 15 minutes per email
        const rateLimitResult = rateLimit(
          `admin-login:${credentials.email}`,
          rateLimitConfigs.strict
        )
        if (!rateLimitResult.success) {
          throw new Error('Too many login attempts. Please try again in 15 minutes.')
        }

        try {
          const user = await prisma.adminUser.findUnique({
            where: {
              email: credentials.email as string,
              isActive: true,
              deletedAt: null,
            },
          })

          if (!user) {
            return null
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          )

          if (!isValidPassword) {
            return null
          }

          // Update last login
          await prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours (reduced for security)
    updateAge: 60 * 60, // Refresh token every 1 hour of activity
  },
  trustHost: true,
})

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface User {
    id?: string
    role?: string
    customerId?: string
    isCustomer?: boolean
  }

  interface Session {
    user: {
      id?: string
      email: string
      name?: string | null
      image?: string | null
      role?: string
      customerId?: string
      isCustomer?: boolean
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string
    role?: string
    customerId?: string
    isCustomer?: boolean
  }
}
