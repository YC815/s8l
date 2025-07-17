'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Link as LinkIcon, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  LogOut,
  Home,
  Settings,
  QrCode,
  TrendingUp,
  Clock,
  Sun,
  Moon,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import QRCode from 'qrcode'

interface UserUrl {
  id: string
  originalUrl: string
  title: string
  shortUrl: string
  shortCode: string
  customPath?: string
  customDomain?: string
  clickCount: number
  createdAt: string
  isCustom: boolean
}

interface CustomDomain {
  id: string
  prefix: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [urls, setUrls] = useState<UserUrl[]>([])
  const [domains, setDomains] = useState<CustomDomain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})

  const fetchUrls = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sortBy,
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/user-urls?${params}`)
      const data = await response.json()

      if (response.ok) {
        setUrls(data.urls)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching URLs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, sortBy, startDate, endDate, currentPage])

  const fetchDomains = useCallback(async () => {
    try {
      const response = await fetch('/api/domains')
      const data = await response.json()

      if (response.ok) {
        setDomains(data.domains)
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
    }
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard')
      return
    }
    
    if (status === 'authenticated') {
      fetchUrls()
      fetchDomains()
    }
  }, [status, router, searchTerm, sortBy, startDate, endDate, currentPage, fetchUrls, fetchDomains])

  // Initialize theme
  useEffect(() => {
    setMounted(true)
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
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

  const deleteUrl = async (id: string) => {
    if (!confirm('確定要刪除此短網址嗎？')) return

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/user-urls/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUrls(prev => prev.filter(url => url.id !== id))
      }
    } catch (error) {
      console.error('Error deleting URL:', error)
    } finally {
      setIsDeleting(null)
    }
  }

  const deleteDomain = async (id: string) => {
    if (!confirm('確定要刪除此域名嗎？這將同時刪除該域名下的所有短網址。')) return

    try {
      const response = await fetch(`/api/domains/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDomains(prev => prev.filter(domain => domain.id !== id))
        // Refresh URLs to remove deleted domain URLs
        fetchUrls()
      }
    } catch (error) {
      console.error('Error deleting domain:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedUrl(text)
      setTimeout(() => setCopiedUrl(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const generateQRCode = async (url: string, id: string) => {
    try {
      const qrCode = await QRCode.toDataURL(url)
      setQrCodes(prev => ({ ...prev, [id]: qrCode }))
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode ? 'dark bg-gradient-to-br from-stone-900 to-stone-800' : 'bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200'
    }`}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm border-b border-stone-200 dark:border-stone-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-stone-800 dark:bg-stone-200">
                <LinkIcon className="h-6 w-6 text-stone-100 dark:text-stone-800" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                  Dashboard
                </h1>
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  歡迎回來，{session?.user?.name || session?.user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                首頁
              </Link>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-stone-600" />
                )}
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                登出
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  總短網址數
                </p>
                <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {urls.length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  總點擊數
                </p>
                <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {urls.reduce((total, url) => total + url.clickCount, 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  自訂域名數
                </p>
                <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                  {domains.length}/2
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Domains Section */}
        <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 mb-8">
          <div className="p-6 border-b border-stone-200 dark:border-stone-700">
            <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
              自訂域名管理
            </h2>
          </div>
          <div className="p-6">
            {domains.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-stone-500 dark:text-stone-400">
                  您還沒有自訂域名，每位用戶可創建最多 2 個域名
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-900 rounded-xl">
                    <div>
                      <p className="font-medium text-stone-800 dark:text-stone-200">
                        {domain.prefix}.s8l.xyz
                      </p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        建立於 {formatDate(domain.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteDomain(domain.id)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="搜尋短網址標題或原始網址..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-stone-300 dark:border-stone-600 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                >
                  <option value="newest">最新</option>
                  <option value="oldest">最舊</option>
                  <option value="clicks">點擊數</option>
                </select>
                
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                />
                
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* URLs List */}
        <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700">
          <div className="p-6 border-b border-stone-200 dark:border-stone-700">
            <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
              我的短網址
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-stone-600 mx-auto mb-4" />
              <p className="text-stone-600 dark:text-stone-400">載入中...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="p-12 text-center">
              <LinkIcon className="h-12 w-12 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 dark:text-stone-400">
                {searchTerm ? '沒有找到符合條件的短網址' : '您還沒有建立任何短網址'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 dark:divide-stone-700">
              {urls.map((url) => (
                <div key={url.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-medium text-stone-800 dark:text-stone-200 truncate">
                          {url.title}
                        </h3>
                        {url.isCustom && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                            自訂
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-stone-500 dark:text-stone-400">原始網址:</span>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 truncate max-w-md"
                          >
                            {url.originalUrl}
                          </a>
                          <ExternalLink className="h-3 w-3 text-stone-400" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-stone-500 dark:text-stone-400">短網址:</span>
                          <button
                            onClick={() => copyToClipboard(url.shortUrl)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-mono"
                          >
                            {url.shortUrl}
                          </button>
                          {copiedUrl === url.shortUrl ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-stone-400" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {url.clickCount} 次點擊
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(url.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => generateQRCode(url.shortUrl, url.id)}
                        className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
                        title="生成 QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteUrl(url.id)}
                        disabled={isDeleting === url.id}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        title="刪除"
                      >
                        {isDeleting === url.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* QR Code Display */}
                  {qrCodes[url.id] && (
                    <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-900 rounded-xl">
                      <div className="flex items-center gap-4">
                        <Image
                          src={qrCodes[url.id]}
                          alt="QR Code"
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                        <div>
                          <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-1">
                            QR Code
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            掃描以開啟連結
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-stone-200 dark:border-stone-700">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  上一頁
                </button>
                
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  第 {currentPage} 頁，共 {totalPages} 頁
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一頁
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}