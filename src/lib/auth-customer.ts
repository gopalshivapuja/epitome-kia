import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from './db'

export const {
  handlers: customerHandlers,
  auth: customerAuth,
  signIn: customerSignIn,
  signOut: customerSignOut,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if customer exists
          const existingCustomer = await prisma.customer.findUnique({
            where: { email: user.email },
          })

          if (existingCustomer) {
            // Update existing customer with Google ID if not set
            if (!existingCustomer.googleId && account.providerAccountId) {
              await prisma.customer.update({
                where: { id: existingCustomer.id },
                data: {
                  googleId: account.providerAccountId,
                  avatarUrl: user.image || existingCustomer.avatarUrl,
                  name: user.name || existingCustomer.name,
                  lastLoginAt: new Date(),
                },
              })
            } else {
              // Just update last login
              await prisma.customer.update({
                where: { id: existingCustomer.id },
                data: { lastLoginAt: new Date() },
              })
            }
          } else {
            // Create new customer
            await prisma.customer.create({
              data: {
                email: user.email,
                name: user.name,
                googleId: account.providerAccountId,
                avatarUrl: user.image,
                lastLoginAt: new Date(),
              },
            })
          }
          return true
        } catch (error) {
          console.error('Customer sign-in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user && account?.provider === 'google') {
        // Fetch customer from database
        const customer = await prisma.customer.findUnique({
          where: { email: user.email! },
        })
        if (customer) {
          token.customerId = customer.id
          token.isCustomer = true
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.customerId) {
        session.user.customerId = token.customerId as string
        session.user.isCustomer = true
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days for customers
  },
  trustHost: true,
})

// Type augmentation is in auth.ts to avoid conflicts
