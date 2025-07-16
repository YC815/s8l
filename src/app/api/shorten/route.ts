import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateShortCode, validateUrl, fetchPageTitle } from '@/lib/url-shortener'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: '請提供有效的網址' }, { status: 400 })
    }
    
    const validatedUrl = validateUrl(url)
    
    // Check if URL is from our own domain (prevent recursive shortening)
    try {
      const urlObj = new URL(validatedUrl)
      if (urlObj.hostname === 's8l.xyz' || urlObj.hostname === 'www.s8l.xyz') {
        return NextResponse.json({ error: '不能縮短本服務的網址' }, { status: 400 })
      }
    } catch {
      // If URL parsing fails, it will be caught by validateUrl
    }
    
    // Check if URL already exists
    const existingUrl = await prisma.url.findUnique({
      where: { originalUrl: validatedUrl }
    })
    
    if (existingUrl) {
      return NextResponse.json({
        shortCode: existingUrl.shortCode,
        originalUrl: existingUrl.originalUrl,
        title: existingUrl.title,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${existingUrl.shortCode}`
      })
    }
    
    // Generate unique short code
    let shortCode: string
    let attempts = 0
    const maxAttempts = 10
    
    do {
      shortCode = generateShortCode()
      attempts++
      
      const existing = await prisma.url.findUnique({
        where: { shortCode }
      })
      
      if (!existing) break
      
      if (attempts >= maxAttempts) {
        return NextResponse.json({ error: '生成短網址失敗，請重試' }, { status: 500 })
      }
    } while (true)
    
    // Fetch page title
    const title = await fetchPageTitle(validatedUrl)
    
    // Create new URL record
    const newUrl = await prisma.url.create({
      data: {
        originalUrl: validatedUrl,
        shortCode,
        title
      }
    })
    
    return NextResponse.json({
      shortCode: newUrl.shortCode,
      originalUrl: newUrl.originalUrl,
      title: newUrl.title,
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${newUrl.shortCode}`
    })
    
  } catch (error) {
    console.error('Error in shorten API:', error)
    
    if (error instanceof Error && error.message === '網址格式錯誤，請檢查') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: '伺服器錯誤，請稍後重試' }, { status: 500 })
  }
}