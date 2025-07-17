'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  className?: string
}

export default function DatePicker({ value, onChange, placeholder, className = '' }: DatePickerProps) {
  const { tString, tArray } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  )
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  const [horizontalPosition, setHorizontalPosition] = useState<'left' | 'right'>('left')
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close dropdown when clicking outside and handle position
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const updateDropdownPosition = () => {
      if (buttonRef.current && isOpen) {
        const buttonRect = buttonRef.current.getBoundingClientRect()
        const dropdownWidth = 288 // w-72 = 288px
        const dropdownHeight = 320 // Approximate height of dropdown
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        const spaceBelow = viewportHeight - buttonRect.bottom
        const spaceAbove = buttonRect.top
        const spaceRight = viewportWidth - buttonRect.left
        const spaceLeft = buttonRect.right

        // Vertical position
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition('top')
        } else {
          setDropdownPosition('bottom')
        }

        // Horizontal position
        if (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) {
          setHorizontalPosition('right')
        } else {
          setHorizontalPosition('left')
        }
      }
    }

    if (isOpen) {
      updateDropdownPosition()
      window.addEventListener('scroll', updateDropdownPosition)
      window.addEventListener('resize', updateDropdownPosition)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', updateDropdownPosition)
      window.removeEventListener('resize', updateDropdownPosition)
    }
  }, [isOpen])

  // Ensure page has enough space for dropdown
  useEffect(() => {
    if (isOpen) {
      document.body.style.minHeight = `${window.innerHeight + 400}px`
    } else {
      document.body.style.minHeight = ''
    }
    
    return () => {
      document.body.style.minHeight = ''
    }
  }, [isOpen])

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return placeholder || tString('selectDate')
    
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    return `${year}${tString('year')} ${month}${tString('month')} ${day}${tString('day')}`
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onChange(formatDate(date))
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedDate(null)
    onChange('')
    setIsOpen(false)
  }

  const handleToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setCurrentDate(today)
    onChange(formatDate(today))
    setIsOpen(false)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const days = getDaysInMonth(currentDate)
  const months = tArray('months')
  const weekdays = tArray('weekdays')

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-xl bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors hover:bg-stone-100 dark:hover:bg-stone-800"
      >
        <span className={selectedDate ? 'text-stone-800 dark:text-stone-200' : 'text-stone-400'}>
          {formatDisplayDate(selectedDate)}
        </span>
        <Calendar className="h-5 w-5 text-stone-400" />
      </button>

      {isOpen && (
        <div className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} ${horizontalPosition === 'right' ? 'right-0' : 'left-0'} w-72 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl shadow-2xl z-[9999] overflow-hidden max-h-[320px] overflow-y-auto`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </button>
            
            <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">
              {currentDate.getFullYear()}{tString('year')} {months[currentDate.getMonth()]}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </button>
          </div>

          {/* Calendar */}
          <div className="p-3">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map((day, index) => (
                <div key={index} className="text-center text-xs font-medium text-stone-500 dark:text-stone-400 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <div key={index} className="aspect-square">
                  {date && (
                    <button
                      type="button"
                      onClick={() => handleDateSelect(date)}
                      className={`w-full h-full rounded-md text-xs font-medium transition-colors ${
                        isSelected(date)
                          ? 'bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800'
                          : isToday(date)
                          ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={handleToday}
              className="px-2 py-1 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-md transition-colors"
            >
              {tString('today')}
            </button>
            
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleClear}
                className="px-2 py-1 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-md transition-colors"
              >
                {tString('cancel')}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 text-xs font-medium bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800 hover:bg-stone-900 dark:hover:bg-stone-100 rounded-md transition-colors"
              >
                {tString('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}