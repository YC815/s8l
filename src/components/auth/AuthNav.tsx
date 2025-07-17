'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import Image from 'next/image'
import { User, LogOut, Settings } from 'lucide-react'

export function AuthNav() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-stone-200 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/signin"
          className="text-stone-600 hover:text-stone-800 transition-colors"
        >
          登入
        </Link>
        <Link
          href="/auth/signup"
          className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-lg transition-colors"
        >
          註冊
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || user.email}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-stone-600" />
          )}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-stone-800">
            {user?.name || user?.email}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Link
          href="/dashboard"
          className="text-stone-600 hover:text-stone-800 transition-colors p-2"
          title="儀表板"
        >
          <Settings className="w-4 h-4" />
        </Link>
        <button
          onClick={logout}
          className="text-stone-600 hover:text-stone-800 transition-colors p-2"
          title="登出"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}