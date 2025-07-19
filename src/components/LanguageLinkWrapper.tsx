'use client'

import { Suspense } from 'react'
import LanguageLink from './LanguageLink'
import { ReactNode } from 'react'

interface LanguageLinkWrapperProps {
  href: string
  children: ReactNode
  className?: string
  title?: string
  target?: string
  rel?: string
}

function LanguageLinkFallback({ href, children, className, title, target, rel }: LanguageLinkWrapperProps) {
  return (
    <a 
      href={href} 
      className={className}
      title={title}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  )
}

export default function LanguageLinkWrapper(props: LanguageLinkWrapperProps) {
  return (
    <Suspense fallback={<LanguageLinkFallback {...props} />}>
      <LanguageLink {...props} />
    </Suspense>
  )
}