'use client'

import { useState, Suspense, useEffect } from 'react'
import React from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  // Check for NextAuth error in URL
  const authError = searchParams.get('error')
  
  // Set error message based on NextAuth error
  useEffect(() => {
    if (authError) {
      console.log('🔥 NextAuth URL error:', authError)
      switch (authError) {
        case 'Configuration':
          setError('伺服器配置錯誤，請稍後重試')
          break
        case 'AccessDenied':
          setError('存取被拒絕')
          break
        case 'Verification':
          setError('驗證失敗')
          break
        case 'Default':
          setError('登入時發生錯誤')
          break
        default:
          setError(`登入錯誤：${authError}`)
      }
    }
  }, [authError])

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log('🔐 Frontend: Starting sign in process')

    // Basic client-side validation
    if (!email || !password) {
      console.log('❌ Frontend: Missing email or password')
      setError('請填寫所有必填字段')
      setIsLoading(false)
      return
    }

    console.log('✅ Frontend: Client validation passed')

    try {
      console.log('🚀 Frontend: Calling signIn with credentials')
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      console.log('📝 Frontend: SignIn result:', result)

      if (result?.error) {
        console.log('❌ Frontend: SignIn error:', result.error)
        // Handle specific error types with detailed Chinese messages
        switch (result.error) {
          case 'CredentialsSignin':
            setError('電子郵件或密碼錯誤，請檢查您的登入資訊')
            break
          case 'Configuration':
            setError('伺服器配置錯誤，請稍後重試或聯絡系統管理員')
            break
          case 'AccessDenied':
            setError('存取被拒絕，請檢查您的帳戶狀態')
            break
          case 'Verification':
            setError('帳戶驗證失敗，請檢查您的電子郵件驗證狀態')
            break
          case 'Default':
            setError('登入時發生未知錯誤，請稍後重試')
            break
          case 'Signin':
            setError('登入流程發生錯誤，請重新嘗試')
            break
          case 'OAuthSignin':
            setError('OAuth 登入發生錯誤')
            break
          case 'OAuthCallback':
            setError('OAuth 回調發生錯誤')
            break
          case 'OAuthCreateAccount':
            setError('OAuth 建立帳戶時發生錯誤')
            break
          case 'EmailCreateAccount':
            setError('建立電子郵件帳戶時發生錯誤')
            break
          case 'Callback':
            setError('登入回調處理時發生錯誤')
            break
          case 'OAuthAccountNotLinked':
            setError('OAuth 帳戶未連結，請使用其他方式登入')
            break
          case 'EmailSignin':
            setError('電子郵件登入發生錯誤')
            break
          case 'CredentialsSignup':
            setError('註冊時發生錯誤')
            break
          case 'SessionRequired':
            setError('需要登入才能存取此頁面')
            break
          default:
            setError(`登入失敗：${result.error}。請稍後重試或聯絡系統管理員`)
        }
      } else {
        console.log('✅ Frontend: SignIn successful, redirecting to:', callbackUrl)
        // Success - redirect to callback URL
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error('❌ Frontend: Sign in error:', error)
      setError('網路錯誤或伺服器無法連接，請檢查網路連線後重試')
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link 
          href="/"
          className="inline-flex items-center text-stone-600 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          回到首頁
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-stone-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-800 mb-2">登入</h1>
            <p className="text-stone-600">登入以管理您的自訂短網址</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    登入失敗
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Email Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                電子郵件
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                密碼
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium rounded-xl transition-colors"
            >
              {isLoading ? '登入中...' : '登入'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-stone-600">
              還沒有帳號？{' '}
              <Link href="/auth/signup" className="text-stone-800 hover:underline font-medium">
                立即註冊
              </Link>
            </p>
            
            {/* Debug links - only show in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-stone-500">Debug Links:</p>
                <div className="flex justify-center space-x-2">
                  <a href="/api/auth/debug" target="_blank" className="text-xs text-blue-600 hover:underline">
                    Debug Info
                  </a>
                  <a href="/api/auth/test-session" target="_blank" className="text-xs text-blue-600 hover:underline">
                    Test Session
                  </a>
                  <a href="/api/auth/session" target="_blank" className="text-xs text-blue-600 hover:underline">
                    Session API
                  </a>
                  <a href="/api/auth/logs" target="_blank" className="text-xs text-blue-600 hover:underline">
                    View Logs
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
    </div>}>
      <SignInForm />
    </Suspense>
  )
}