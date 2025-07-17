'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Eye, EyeOff, ArrowLeft, User } from 'lucide-react'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log('📝 Frontend: Starting sign up process')

    // Basic client-side validation
    if (!email || !password) {
      console.log('❌ Frontend: Missing email or password')
      setError('請填寫所有必填字段')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      console.log('❌ Frontend: Password too short')
      setError('密碼至少需要 8 個字符')
      setIsLoading(false)
      return
    }

    console.log('✅ Frontend: Client validation passed')

    try {
      console.log('🚀 Frontend: Calling registration API')
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password, 
          name: name.trim() || undefined 
        }),
      })

      const data = await response.json()
      console.log('📝 Frontend: Registration response:', { status: response.status, data })

      if (!response.ok) {
        console.log('❌ Frontend: Registration failed')
        if (response.status === 429) {
          setError('註冊請求過於頻繁，請稍後重試（每小時最多 5 次註冊嘗試）')
        } else if (response.status === 400) {
          setError(data.error || '註冊資料驗證失敗，請檢查您的輸入')
        } else if (response.status === 500) {
          setError('伺服器錯誤，請稍後重試或聯絡系統管理員')
        } else {
          setError(data.error || `註冊失敗（狀態碼：${response.status}）`)
        }
        return
      }

      console.log('✅ Frontend: Registration successful, attempting auto sign in')
      
      // Auto sign in after successful registration
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      console.log('📝 Frontend: Auto sign in result:', result)

      if (result?.error) {
        console.log('❌ Frontend: Auto sign in failed')
        setError('註冊成功但自動登入失敗，請手動登入。您的帳戶已建立成功。')
        // Wait a bit before redirecting to show the message
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        console.log('✅ Frontend: Auto sign in successful, redirecting to home')
        router.push('/')
      }
    } catch (error) {
      console.error('❌ Frontend: Sign up error:', error)
      if (error instanceof Error) {
        setError(`註冊失敗：${error.message}`)
      } else {
        setError('網路錯誤或伺服器無法連接，請檢查網路連線後重試')
      }
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
            <h1 className="text-3xl font-bold text-stone-800 mb-2">註冊</h1>
            <p className="text-stone-600">建立帳號以管理您的自訂短網址</p>
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
                    註冊失敗
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Email Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                姓名（選填）
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  placeholder="您的姓名"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                密碼
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-4 pr-12 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
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

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full px-4 py-3 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-medium rounded-xl transition-colors"
            >
              {isLoading ? '註冊中...' : '註冊'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-stone-600">
              已有帳號？{' '}
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