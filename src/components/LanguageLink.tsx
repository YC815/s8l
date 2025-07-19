'use client'

import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'

interface LanguageLinkProps {
  href: string
  children: ReactNode
  className?: string
  title?: string
  target?: string
  rel?: string
}

export default function LanguageLink({ href, children, className, title, target, rel }: LanguageLinkProps) {
  const [finalHref, setFinalHref] = useState(href)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 保持當前的語言參數
      const urlParams = new URLSearchParams(window.location.search)
      const currentLang = urlParams.get('lang')
      
      if (currentLang) {
        // 構建帶有語言參數的 URL
        const url = new URL(href, window.location.origin)
        url.searchParams.set('lang', currentLang)
        setFinalHref(url.pathname + url.search)
      }
    }
  }, [href])
  
  return (
    <Link 
      href={finalHref} 
      className={className}
      title={title}
      target={target}
      rel={rel}
    >
      {children}
    </Link>
  )
}