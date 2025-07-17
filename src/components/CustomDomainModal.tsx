'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Check, Loader2 } from 'lucide-react'

interface CustomDomain {
  id: string
  prefix: string
  createdAt: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (domainId: string, prefix: string) => void
}

export default function CustomDomainModal({ isOpen, onClose, onSelect }: Props) {
  const [domains, setDomains] = useState<CustomDomain[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newPrefix, setNewPrefix] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchDomains()
    }
  }, [isOpen])

  const fetchDomains = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/domains')
      const data = await response.json()
      
      if (response.ok) {
        setDomains(data.domains)
      } else {
        setError(data.error || '獲取域名失敗')
      }
    } catch (err) {
      setError('網路錯誤，請重試')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDomain = async () => {
    if (!newPrefix.trim()) {
      setError('請輸入域名前綴')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const response = await fetch('/api/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prefix: newPrefix.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setDomains(prev => [data.domain, ...prev])
        setNewPrefix('')
      } else {
        setError(data.error || '創建域名失敗')
      }
    } catch (err) {
      setError('網路錯誤，請重試')
    } finally {
      setIsCreating(false)
    }
  }

  const validatePrefix = (prefix: string) => {
    if (prefix.length < 3 || prefix.length > 10) {
      return '域名前綴長度必須在 3-10 個字符之間'
    }
    
    const urlSafeRegex = /^[A-Za-z0-9_-]+$/
    if (!urlSafeRegex.test(prefix)) {
      return '只能包含英文字母、數字、連接號和底線'
    }
    
    return ''
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-stone-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">
            選擇自訂域名
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-600 dark:text-stone-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-stone-600" />
            </div>
          ) : (
            <>
              {/* Existing domains */}
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  onClick={() => onSelect(domain.id, domain.prefix)}
                  className="p-4 border-2 border-stone-200 dark:border-stone-600 rounded-xl hover:border-stone-400 dark:hover:border-stone-500 cursor-pointer transition-colors bg-stone-50 dark:bg-stone-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-800 dark:text-stone-200">
                        {domain.prefix}.s8l.xyz
                      </p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        建立於 {new Date(domain.createdAt).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              ))}

              {/* Create new domain */}
              {domains.length < 2 && (
                <div className="p-4 border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">創建新域名</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newPrefix}
                          onChange={(e) => {
                            setNewPrefix(e.target.value)
                            setError('')
                          }}
                          placeholder="輸入前綴"
                          className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-sm focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                          maxLength={10}
                        />
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          3-10 字符，英文字母、數字、- 和 _
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        <span className="text-sm text-stone-600 dark:text-stone-400">
                          .s8l.xyz
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCreateDomain}
                      disabled={isCreating || !newPrefix.trim() || !!validatePrefix(newPrefix)}
                      className="w-full px-3 py-2 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {isCreating ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>創建中...</span>
                        </div>
                      ) : (
                        '創建域名'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {domains.length === 0 && !isLoading && (
                <div className="text-center py-6 text-stone-500 dark:text-stone-400">
                  <p>您還沒有自訂域名</p>
                  <p className="text-sm">每位用戶最多可創建 2 個域名</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}