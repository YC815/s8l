'use client'

import { useSession, signOut } from 'next-auth/react'
import { 
  Sun, 
  Moon, 
  LogOut, 
  LayoutDashboard, 
  Home,
  Link as LinkIcon
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import LanguageDropdown from './LanguageDropdown'
import LanguageLink from './LanguageLink'

interface NavigationProps {
  mode: 'home' | 'dashboard' | 'line'
  darkMode: boolean
  onToggleDarkMode: () => void
}

export default function Navigation({ mode, darkMode, onToggleDarkMode }: NavigationProps) {
  const { data: session } = useSession()
  const { tString } = useLanguage()

  return (
    <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and page info */}
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-stone-800 dark:bg-stone-200 shadow-md">
              <LinkIcon className="h-6 w-6 text-stone-100 dark:text-stone-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                S8L {mode === 'dashboard' ? `- ${tString('dashboard')}` : ''}
                {mode === 'line' ? ' - Line Bot' : ''}
              </h1>
              {mode === 'dashboard' && session ? (
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {tString('welcomeBack')}，{session?.user?.name || session?.user?.email}
                </p>
              ) : null}
            </div>
          </div>

          {/* Right side - Circular buttons */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <LanguageDropdown />

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-3 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              title={darkMode ? '切換到亮色模式' : '切換到暗色模式'}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-stone-600" />
              )}
            </button>

            {/* Third button - Dashboard/Home/Logout based on context */}
            {session ? (
              mode === 'home' ? (
                // On home page, show Dashboard link
                <LanguageLink
                  href="/dashboard"
                  className="p-3 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  title={tString('dashboard')}
                >
                  <LayoutDashboard className="h-5 w-5 text-stone-600 dark:text-stone-400" />
                </LanguageLink>
              ) : (
                // On dashboard or line page, show Home link
                <LanguageLink
                  href="/"
                  className="p-3 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  title={tString('home')}
                >
                  <Home className="h-5 w-5 text-stone-600 dark:text-stone-400" />
                </LanguageLink>
              )
            ) : (
              // Not logged in, show login link
              <LanguageLink
                href="/auth/signin"
                className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                title={tString('login')}
              >
                <LogOut className="h-5 w-5 text-blue-600 dark:text-blue-400 rotate-180" />
              </LanguageLink>
            )}

            {/* Logout button - always visible when logged in */}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-3 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                title={tString('logout')}
              >
                <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}