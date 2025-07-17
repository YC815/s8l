import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { validateUrl, fetchPageTitle } from '@/lib/url-shortener'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    const { url, customTitle, customDomainId, customPath } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: '請提供有效的網址' }, { status: 400 })
    }

    if (!customDomainId || !customPath) {
      return NextResponse.json({ error: '請提供自訂域名和路徑' }, { status: 400 })
    }

    const validatedUrl = validateUrl(url)

    // Check if URL is from our own domain
    try {
      const urlObj = new URL(validatedUrl)
      if (urlObj.hostname === 's8l.xyz' || urlObj.hostname === 'www.s8l.xyz') {
        return NextResponse.json({ error: '不能縮短本服務的網址' }, { status: 400 })
      }
    } catch {
      // If URL parsing fails, it will be caught by validateUrl
    }

    // Verify custom domain belongs to user
    const customDomain = await prisma.customDomain.findUnique({
      where: {
        id: customDomainId
      }
    })

    if (!customDomain || customDomain.userId !== session.user.id) {
      return NextResponse.json({ error: '自訂域名不存在或沒有權限使用' }, { status: 400 })
    }

    // Validate custom path
    if (customPath.length < 1 || customPath.length > 50) {
      return NextResponse.json({ error: '自訂路徑長度必須在 1-50 個字符之間' }, { status: 400 })
    }

    // Validate custom path format (URL-safe characters only)
    const urlSafeRegex = /^[A-Za-z0-9_-]+$/
    if (!urlSafeRegex.test(customPath)) {
      return NextResponse.json({ error: '自訂路徑只能包含英文字母、數字、連接號和底線' }, { status: 400 })
    }

    // Check if custom path already exists for this domain
    const existingCustomPath = await prisma.userUrl.findFirst({
      where: {
        customDomainId,
        customPath: customPath.toLowerCase()
      }
    })

    if (existingCustomPath) {
      return NextResponse.json({ error: '此路徑在該域名下已被使用' }, { status: 400 })
    }

    // Check if URL already exists in Url table
    let urlRecord = await prisma.url.findUnique({
      where: { originalUrl: validatedUrl }
    })

    if (!urlRecord) {
      // Fetch page title (use custom title if provided, otherwise fetch from page)
      const title = customTitle || await fetchPageTitle(validatedUrl)

      // Create new URL record
      urlRecord = await prisma.url.create({
        data: {
          originalUrl: validatedUrl,
          shortCode: `custom-${Date.now()}`, // Temporary shortCode for custom URLs
          title
        }
      })
    }

    // Create UserUrl record
    const userUrl = await prisma.userUrl.create({
      data: {
        userId: session.user.id,
        urlId: urlRecord.id,
        customDomainId,
        customPath: customPath.toLowerCase(),
        customTitle: customTitle || null
      },
      include: {
        url: true,
        customDomain: true
      }
    })

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${userUrl.customDomain!.prefix}.s8l.xyz/${userUrl.customPath}`

    return NextResponse.json({
      id: userUrl.id,
      originalUrl: userUrl.url.originalUrl,
      title: userUrl.customTitle || userUrl.url.title,
      shortUrl,
      customPath: userUrl.customPath,
      customDomain: userUrl.customDomain!.prefix,
      clickCount: userUrl.url.clickCount,
      createdAt: userUrl.createdAt
    })

  } catch (error) {
    console.error('Error in custom shorten API:', error)
    
    if (error instanceof Error && error.message === '網址格式錯誤，請檢查') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ error: '伺服器錯誤，請稍後重試' }, { status: 500 })
  }
}