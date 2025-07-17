'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface AuthUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user: AuthUser | null = session?.user ? {
    id: session.user.id as string,
    email: session.user.email as string,
    name: session.user.name,
    image: session.user.image,
  } : null

  const logout = useCallback(async () => {
    try {
      await signOut({ 
        redirect: true,
        callbackUrl: '/' 
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [])

  const requireAuth = useCallback((redirectTo: string = '/auth/signin') => {
    if (status === 'loading') return false
    
    if (!session) {
      router.push(redirectTo)
      return false
    }
    
    return true
  }, [session, status, router])

  return {
    user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    logout,
    requireAuth,
  }
}