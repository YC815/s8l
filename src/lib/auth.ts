import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'
import { logEnvironment, checkEnvironment } from './debug'

// Check environment on startup
console.log('🚀 Auth configuration starting...')
try {
  checkEnvironment()
  logEnvironment()
  console.log('✅ Auth environment check passed')
} catch (error) {
  console.error('❌ Auth environment check failed:', error)
}

// Test database connection before creating auth config
async function testDatabaseConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection test passed:', result)
    return true
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return false
  }
}

const authConfig = {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any, user: any }) {
      console.log('🔄 JWT callback:', { hasUser: !!user, hasToken: !!token })
      if (user) {
        token.id = user.id
        console.log('✅ JWT: Added user ID to token')
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any, token: any }) {
      console.log('📝 Session callback:', { hasSession: !!session, hasToken: !!token })
      if (token.id) {
        session.user.id = token.id as string
        console.log('✅ Session: Added user ID to session')
      }
      return session
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ account, user }: { account: any, user: any }) {
      console.log('🚪 SignIn callback:', { provider: account?.provider, hasUser: !!user })
      if (account?.provider === 'credentials') {
        console.log('✅ SignIn: Credentials provider - allowing sign in')
        return true
      }
      
      console.log('❌ SignIn: Not credentials provider - denying sign in')
      return false
    }
  },
  debug: true, // Always enable debug for now
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (error: any) => {
      console.error('🔥 NextAuth Error:', error)
      // Log stack trace for better debugging
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (code: any) => {
      console.warn('⚠️  NextAuth Warning:', code)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug: (code: any, metadata?: any) => {
      console.log('🐛 NextAuth Debug:', code, metadata)
    }
  },
  // Add more detailed error handling
  events: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account, isNewUser }: { user: any, account: any, isNewUser: boolean }) {
      console.log('📝 SignIn event:', { user: user?.email, account: account?.provider, isNewUser })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signOut({ token, session }: { token: any, session: any }) {
      console.log('📝 SignOut event:', { userId: token?.id || session?.user?.id })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createUser({ user }: { user: any }) {
      console.log('📝 CreateUser event:', { userId: user.id, email: user.email })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateUser({ user }: { user: any }) {
      console.log('📝 UpdateUser event:', { userId: user.id, email: user.email })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async linkAccount({ user, account }: { user: any, account: any }) {
      console.log('📝 LinkAccount event:', { userId: user.id, provider: account.provider })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session }: { session: any }) {
      console.log('📝 Session event:', { userId: session.user?.id, email: session.user?.email })
    }
  }
}

console.log('🔧 Creating NextAuth instance...')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextAuth = NextAuth(authConfig as any)
console.log('✅ NextAuth instance created successfully')

export const { handlers, signIn, signOut, auth } = nextAuth