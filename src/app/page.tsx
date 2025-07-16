'use client'

import { useState, useEffect } from 'react'
import { Copy, Sun, Moon, Link, ExternalLink, Check } from 'lucide-react'
import QRCode from 'qrcode'

interface ShortenedUrl {
  shortCode: string
  originalUrl: string
  title: string
  shortUrl: string
  qrCode?: string
}

export default function Home() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<ShortenedUrl[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState('')
  const [copiedUrl, setCopiedUrl] = useState('')
  const [inputError, setInputError] = useState('')

  const validateInput = (url: string) => {
    if (!url.trim()) {
      setInputError('')
      return
    }
    
    try {
      let validatedUrl = url.trim()
      if (!validatedUrl.startsWith('http://') && !validatedUrl.startsWith('https://')) {
        validatedUrl = `https://${validatedUrl}`
      }
      
      const urlObj = new URL(validatedUrl)
      if (urlObj.hostname === 's8l.xyz' || urlObj.hostname === 'www.s8l.xyz') {
        setInputError('不能縮短本服務的網址')
        return
      }
      
      setInputError('')
    } catch {
      setInputError('請輸入有效的網址格式')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || inputError) return

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input.trim() })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '發生錯誤')
      }
      
      // Generate QR code
      const qrCode = await QRCode.toDataURL(data.shortUrl)
      
      const newResult: ShortenedUrl = { ...data, qrCode }
      setResults(prev => [newResult, ...prev])
      setInput('')
      
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedUrl(text)
      setTimeout(() => setCopiedUrl(''), 2000)
    } catch {
      // 複製失敗時不做任何處理，保持原狀
    }
  }

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme')
    
    let shouldBeDark = false
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      shouldBeDark = true
    }
    
    setDarkMode(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode ? 'dark bg-gradient-to-br from-stone-900 to-stone-800' : 'bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200'
    }`}>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <div className="p-4 rounded-2xl bg-stone-800 dark:bg-stone-200 shadow-xl">
              <Link className="h-10 w-10 text-stone-100 dark:text-stone-800" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            S8L 短網址
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            極簡、快速、安全的網址縮短服務，支援 QR Code 生成
          </p>
          <button
            onClick={toggleDarkMode}
            className="fixed top-6 right-6 p-3 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 transition-all duration-300 shadow-lg hover:shadow-xl z-50"
          >
            {darkMode ? (
              <Sun className="h-6 w-6 text-amber-500" />
            ) : (
              <Moon className="h-6 w-6 text-stone-600" />
            )}
          </button>
        </div>

        {/* Input Form */}
        <div className="mb-16">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-8 pb-12 shadow-2xl border border-stone-200 dark:border-stone-700">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                    請輸入要縮短的網址
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value)
                        validateInput(e.target.value)
                      }}
                      placeholder="https://example.com/very-long-url..."
                      className={`w-full p-4 border-2 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 transition-all duration-300 h-14 ${
                        inputError 
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                          : 'border-stone-200 dark:border-stone-600 focus:ring-stone-500 focus:border-stone-500'
                      }`}
                      disabled={isLoading}
                    />
                    {inputError && (
                      <p className="absolute top-full left-0 mt-2 text-sm text-red-500 dark:text-red-400 font-medium">
                        {inputError}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start lg:items-end lg:pt-8">
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading || !!inputError}
                    className="px-8 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 dark:disabled:bg-stone-500 dark:disabled:text-stone-400 disabled:cursor-not-allowed text-white dark:bg-stone-300 dark:hover:bg-stone-200 dark:text-stone-800 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none min-w-[120px] h-14"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>處理中</span>
                      </div>
                    ) : (
                      '縮短網址'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-red-700 dark:text-red-300 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}


        {/* Results */}
        {results.length > 0 && (
          <div id="results" className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-2">
                縮短結果
              </h2>
              <div className="w-20 h-1 bg-stone-800 dark:bg-stone-200 mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={result.shortCode}
                  className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gradient-to-r from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 p-6 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-200 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {result.title}
                      </h3>
                      <span className="text-xs text-stone-500 dark:text-stone-400 bg-stone-200 dark:bg-stone-600 px-2 py-1 rounded-full">
                        {result.shortCode}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* 左側：網址區域 */}
                      <div className="flex-1 space-y-6">
                        {/* 原始網址 */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                            原始網址
                          </label>
                          <div className="flex items-center space-x-3 p-4 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-600">
                            <p className="text-sm text-stone-600 dark:text-stone-400 break-all flex-1">
                              {result.originalUrl}
                            </p>
                            <a
                              href={result.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg flex-shrink-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                        
                        {/* 縮短網址 */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                            短網址
                          </label>
                          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-800 rounded-xl border-2 border-stone-300 dark:border-stone-600">
                            <p className="text-lg font-mono text-stone-800 dark:text-stone-200 flex-1 font-semibold">
                              {result.shortUrl}
                            </p>
                            <button
                              onClick={() => copyToClipboard(result.shortUrl)}
                              className="p-2 hover:bg-stone-200 dark:hover:bg-stone-600 rounded-lg transition-all duration-200 transform hover:scale-110 flex-shrink-0"
                              title="複製短網址"
                            >
                              {copiedUrl === result.shortUrl ? (
                                <Check className="h-5 w-5 text-green-500 animate-pulse" />
                              ) : (
                                <Copy className="h-5 w-5 text-stone-600 dark:text-stone-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* 右側：QR Code 區域 */}
                      {result.qrCode && (
                        <div className="flex-shrink-0 flex items-center justify-center lg:justify-start">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-4">
                              QR Code
                            </p>
                            <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl border-2 border-stone-200 dark:border-stone-600 shadow-inner">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={result.qrCode}
                                alt="QR Code"
                                className="w-32 h-32 mx-auto rounded-lg"
                              />
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                              掃描開啟連結
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Zeabur 部署徽章 */}
      <div className="fixed bottom-4 right-4 opacity-60 hover:opacity-100 transition-opacity duration-300 z-40">
        <a href="https://zeabur.com/referral?referralCode=YC815&utm_source=YC815">
          <img 
            src="https://zeabur.com/deployed-on-zeabur-dark.svg" 
            alt="Deployed on Zeabur"
            className="h-6"
          />
        </a>
      </div>
    </div>
  )
}