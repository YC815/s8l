'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
      } else {
        setMessage(data.error || '請求失敗')
        setIsSuccess(false)
      }
    } catch (err) {
      setMessage('請求失敗，請重試')
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-stone-800 mb-2">忘記密碼</h1>
            <p className="text-stone-600">輸入您的電子郵件地址，我們將發送重設密碼的連結給您</p>
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
            </div>
          )}

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  電子郵件
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium rounded-xl transition-colors"
              >
                {isLoading ? '發送中...' : '發送重設連結'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <Link 
                  href="/auth/signin"
                  className="block px-4 py-2 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  返回登入頁面
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false)
                    setMessage('')
                    setEmail('')
                  }}
                  className="block w-full px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  重新發送
                </button>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <p className="text-stone-600">
              記起密碼了？{' '}
              <Link href="/auth/signin" className="text-stone-800 hover:underline font-medium">
                立即登入
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}