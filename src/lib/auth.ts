import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { logEnvironment, checkEnvironment } from './debug'

// Check environment on startup
checkEnvironment()
logEnvironment()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 NextAuth authorize called with:', { email: credentials?.email, hasPassword: !!credentials?.password })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          console.log('🔍 Looking for user in database:', credentials.email)
          
          // Directly verify password here instead of calling API endpoint
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          if (!user || !user.password) {
            console.log('❌ User not found or no password')
            return null
          }

          console.log('👤 User found:', { id: user.id, email: user.email, name: user.name })

          const isValidPassword = await bcrypt.compare(credentials.password as string, user.password)

          if (!isValidPassword) {
            console.log('❌ Invalid password')
            return null
          }

          console.log('✅ Password valid, returning user')
          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('❌ Authorization error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect errors to signin page instead of default error page
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔄 JWT callback:', { hasUser: !!user, hasToken: !!token })
      if (user) {
        token.id = user.id
        console.log('✅ JWT: Added user ID to token')
      }
      return token
    },
    async session({ session, token }) {
      console.log('📝 Session callback:', { hasSession: !!session, hasToken: !!token })
      if (token.id) {
        session.user.id = token.id as string
        console.log('✅ Session: Added user ID to session')
      }
      return session
    },
    async signIn({ account, user }) {
      console.log('🚪 SignIn callback:', { provider: account?.provider, hasUser: !!user })
      if (account?.provider === 'credentials') {
        console.log('✅ SignIn: Credentials provider - allowing sign in')
        return true
      }
      
      console.log('❌ SignIn: Not credentials provider - denying sign in')
      return false
    }
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  logger: {
    error: (error) => {
      console.error('🔥 NextAuth Error:', error)
    },
    warn: (code) => {
      console.warn('⚠️  NextAuth Warning:', code)
    },
    debug: (code, metadata) => {
      console.log('🐛 NextAuth Debug:', code, metadata)
    }
  }
})