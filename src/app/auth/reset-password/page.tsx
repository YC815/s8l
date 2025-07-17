'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

function ResetPasswordContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setIsValidToken(false)
      setMessage('重設令牌缺失')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (password !== confirmPassword) {
      setMessage('密碼確認不一致')
      setIsSuccess(false)
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        setMessage(data.error || '密碼重設失敗')
        setIsSuccess(false)
        if (data.error?.includes('令牌')) {
          setIsValidToken(false)
        }
      }
    } catch (err) {
      setMessage('密碼重設失敗，請重試')
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            href="/auth/forgot-password"
            className="inline-flex items-center text-stone-600 hover:text-stone-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            重新請求重設
          </Link>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-stone-200 p-8">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-stone-800 mb-2">無效的重設連結</h1>
              <p className="text-red-700 mb-6">{message}</p>
              
              <div className="space-y-2">
                <Link 
                  href="/auth/forgot-password"
                  className="block px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition-colors"
                >
                  重新請求重設密碼
                </Link>
                <Link 
                  href="/auth/signin"
                  className="block px-4 py-2 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  返回登入頁面
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/auth/signin"
          className="inline-flex items-center text-stone-600 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回登入
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-stone-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-800 mb-2">重設密碼</h1>
            <p className="text-stone-600">輸入您的新密碼</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl border-l-4 ${
              isSuccess 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              {isSuccess && <CheckCircle className="w-5 h-5 text-green-500 mb-2" />}
              <p className={`text-sm ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                {message}
              </p>
              {isSuccess && (
                <p className="text-green-600 text-xs mt-2">3 秒後將自動跳轉到登入頁面...</p>
              )}
            </div>
          )}

          {!isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  新密碼
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  密碼至少 8 個字符，需包含英文字母和數字
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  確認新密碼
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
                className="w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium rounded-xl transition-colors"
              >
                {isLoading ? '重設中...' : '重設密碼'}
              </button>
            </form>
          )}

          {isSuccess && (
            <div className="text-center">
              <Link 
                href="/auth/signin"
                className="inline-block px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition-colors"
              >
                立即登入
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}