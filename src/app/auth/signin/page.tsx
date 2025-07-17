'use client'

import { useState, Suspense } from 'react'
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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('電子郵件或密碼錯誤')
      } else {
        router.push(callbackUrl)
      }
    } catch (err) {
      setError('登入失敗，請重試')
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
              <p className="text-red-700 text-sm">{error}</p>
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