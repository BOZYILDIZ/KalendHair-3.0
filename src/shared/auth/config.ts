import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { db } from '@/shared/db/client'
import { proAccounts } from '@/shared/db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword } from './password'
import { AppError } from '@/shared/errors'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const account = await db.query.proAccounts.findFirst({
          where: eq(proAccounts.email, credentials.email as string),
        })

        if (!account || !account.isActive) return null

        const valid = await verifyPassword(
          credentials.password as string,
          account.passwordHash
        )
        if (!valid) return null

        return {
          id: String(account.id),
          email: account.email,
          mustChangePassword: account.mustChangePassword,
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  session: { strategy: 'jwt' },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.mustChangePassword = (user as { mustChangePassword?: boolean }).mustChangePassword
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      ;(session.user as { mustChangePassword?: boolean }).mustChangePassword =
        token.mustChangePassword as boolean
      return session
    },
  },

  pages: {
    signIn: '/connexion',
    error: '/connexion',
  },
})
