import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 dark:bg-gradient-to-br dark:from-stone-900 dark:to-stone-800 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto text-center px-6">
        <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-stone-200 dark:border-stone-700">
          <div className="mb-8">
            <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-700 w-fit mx-auto mb-6">
              <Search className="h-12 w-12 text-stone-600 dark:text-stone-300" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-3">
              找不到短網址
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-lg">
              您輸入的短網址不存在或已過期
            </p>
          </div>
          
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-stone-800 hover:bg-stone-900 dark:bg-stone-200 dark:hover:bg-stone-100 text-white dark:text-stone-800 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Home className="h-5 w-5" />
              <span>回到首頁</span>
            </Link>
            
            <p className="text-sm text-stone-500 dark:text-stone-400">
              或者創建一個新的短網址
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}