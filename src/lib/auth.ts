import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true,
})

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface User {
    id?: string
    role?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: string
  }
}
