'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react'

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`)
      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || '驗證失敗')
      }
    } catch (error) {
      setStatus('error')
      setMessage('驗證過程中發生錯誤')
    }
  }, [router])

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('驗證令牌缺失')
    }
  }, [token, verifyEmail])

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage(data.message)
      } else {
        setMessage(data.error || '重新發送失敗')
      }
    } catch (error) {
      setMessage('重新發送過程中發生錯誤')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/"
          className="inline-flex items-center text-stone-600 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          回到首頁
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-stone-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-800 mb-2">電子郵件驗證</h1>
          </div>

          <div className="text-center">
            {status === 'loading' && (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800 mx-auto"></div>
                <p className="text-stone-600">正在驗證您的電子郵件...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <p className="text-green-700 font-medium mb-2">{message}</p>
                  <p className="text-stone-600 text-sm">3 秒後將自動跳轉到登入頁面...</p>
                </div>
                <Link 
                  href="/auth/signin"
                  className="inline-block px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl transition-colors"
                >
                  立即登入
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-6">
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                <div>
                  <p className="text-red-700 font-medium mb-4">{message}</p>
                  
                  {(message.includes('過期') || message.includes('無效')) && (
                    <div className="space-y-4">
                      <p className="text-stone-600 text-sm">請重新發送驗證郵件：</p>
                      
                      <form onSubmit={handleResendVerification} className="space-y-4">
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 pl-12 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                            placeholder="您的電子郵件"
                            required
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={isResending || !email}
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium rounded-xl transition-colors"
                        >
                          {isResending ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              發送中...
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              重新發送驗證郵件
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Link 
                    href="/auth/signin"
                    className="block px-4 py-2 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                  >
                    返回登入頁面
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="block px-4 py-2 text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                  >
                    重新註冊
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}