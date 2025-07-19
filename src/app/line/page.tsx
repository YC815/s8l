'use client'

import { useState, useEffect } from 'react'
import { Link as LinkIcon, MessageCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

export default function LinePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

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
      darkMode ? 'dark bg-gradient-to-br from-green-900 via-stone-900 to-stone-800' : 'bg-gradient-to-br from-green-50 via-stone-50 to-stone-100'
    }`}>
      {/* Navigation */}
      <Navigation 
        mode="home" 
        darkMode={darkMode} 
        onToggleDarkMode={toggleDarkMode} 
      />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 relative mt-8">
          <div className="flex justify-center items-center mb-6">
            <div className="p-4 rounded-2xl bg-green-600 dark:bg-green-500 shadow-xl">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">
            S8L Line Bot
          </h1>
          <p className="text-2xl text-green-600 dark:text-green-400 font-semibold mb-2">
            簡單使用，貼上網址發送即可
          </p>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            透過 Line Bot 快速縮短網址，無需開啟網頁，直接在聊天室中完成操作
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 dark:bg-stone-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div className="p-8">
              {/* Add Friend Section */}
              <div className="mb-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  {/* Left side - QR Code */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-6">
                      掃描 QR Code 加入好友
                    </h3>
                    <div className="inline-block p-4 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-600">
                      <Image
                        src="https://qr-official.line.me/gs/M_191mimiw_GW.png?oat_content=qr"
                        alt="Line Bot QR Code"
                        width={160}
                        height={160}
                        className="mx-auto rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-3">
                      使用 Line App 掃描此 QR Code
                    </p>
                  </div>

                  {/* Right side - Button and Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-4">
                        或點擊按鈕加入
                      </h3>
                      <p className="text-stone-600 dark:text-stone-400 mb-6">
                        快速加入 S8L Line Bot，開始享受便利的縮網址服務
                      </p>
                    </div>

                    {/* Friend Link Button */}
                    <a
                      href="https://lin.ee/Br3wn33"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full p-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <MessageCircle className="h-6 w-6" />
                        <span>打開 Line 加入好友</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* How to use section */}
              <div className="border-t border-stone-200 dark:border-stone-700 pt-12 text-center">
                <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-200 mb-8">
                  使用方式
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                      <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-2">
                      1. 加入好友
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-center">
                      掃描 QR Code 或點擊加好友按鈕
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                      <LinkIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-2">
                      2. 貼上長網址
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-center">
                      將想要縮短的長網址貼到聊天室發送
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                      <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-2">
                      3. 獲得短網址
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-center">
                      Bot 會立即回傳縮短後的網址，即時便利
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to main site */}
              <div className="border-t border-stone-200 dark:border-stone-700 pt-8 mt-12 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-300 dark:hover:bg-stone-200 dark:text-stone-800 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <LinkIcon className="h-5 w-5" />
                  <span>前往 S8L 短網址服務</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Zeabur 部署徽章 */}
      <div className="fixed bottom-4 right-4 opacity-60 hover:opacity-100 transition-opacity duration-300 z-40">
        <a href="https://zeabur.com/referral?referralCode=YC815&utm_source=YC815">
          <Image 
            src="https://zeabur.com/deployed-on-zeabur-dark.svg" 
            alt="Deployed on Zeabur"
            width={120}
            height={24}
            className="h-6"
          />
        </a>
      </div>
    </div>
  )
}