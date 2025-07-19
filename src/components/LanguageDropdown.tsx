'use client'

import { useState, useRef, useEffect } from 'react'
import { Languages, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import type { Language } from '@/lib/translations'

const languageOptions: { code: Language; name: string; flag: string }[] = [
  { code: 'zh', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

export default function LanguageDropdown() {
  const { language, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const currentLanguage = languageOptions.find(option => option.code === language) || languageOptions[0]

  const handleLanguageChange = (newLanguage: Language) => {
    changeLanguage(newLanguage)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
        title="Select Language / 選擇語言 / 言語選択"
      >
        <Languages className="h-5 w-5 text-stone-600 dark:text-stone-400" />
        <span className="text-sm font-medium text-stone-600 dark:text-stone-400 hidden sm:block">
          {currentLanguage.flag}
        </span>
        <ChevronDown className={`h-4 w-4 text-stone-600 dark:text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-2 z-50 animate-fade-in">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              onClick={() => handleLanguageChange(option.code)}
              className={`w-full px-4 py-3 text-left hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors duration-200 flex items-center space-x-3 ${
                language === option.code ? 'bg-stone-100 dark:bg-stone-700 font-semibold' : ''
              }`}
            >
              <span className="text-lg">{option.flag}</span>
              <span className="text-stone-800 dark:text-stone-200">{option.name}</span>
              {language === option.code && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}