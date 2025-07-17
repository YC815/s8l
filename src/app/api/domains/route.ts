import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-simple'
import { prisma } from '@/lib/db'

const RESERVED_PREFIXES = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'support']

// GET - Get user's custom domains
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    const domains = await prisma.customDomain.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ domains })
  } catch (error) {
    console.error('Error fetching domains:', error)
    return NextResponse.json({ error: '獲取域名失敗' }, { status: 500 })
  }
}

// POST - Create new custom domain
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    const { prefix } = await request.json()

    if (!prefix || typeof prefix !== 'string') {
      return NextResponse.json({ error: '請提供域名前綴' }, { status: 400 })
    }

    // Validate prefix length
    if (prefix.length < 3 || prefix.length > 10) {
      return NextResponse.json({ error: '域名前綴長度必須在 3-10 個字符之間' }, { status: 400 })
    }

    // Validate prefix format (URL-safe characters only)
    const urlSafeRegex = /^[A-Za-z0-9_-]+$/
    if (!urlSafeRegex.test(prefix)) {
      return NextResponse.json({ error: '域名前綴只能包含英文字母、數字、連接號和底線' }, { status: 400 })
    }

    // Check if prefix is reserved
    if (RESERVED_PREFIXES.includes(prefix.toLowerCase())) {
      return NextResponse.json({ error: '此域名前綴為保留詞彙，請選擇其他名稱' }, { status: 400 })
    }

    // Check user's domain limit (max 2 domains per user)
    const userDomainCount = await prisma.customDomain.count({
      where: {
        userId: session.user.id
      }
    })

    if (userDomainCount >= 2) {
      return NextResponse.json({ error: '每位用戶最多只能創建 2 個自訂域名' }, { status: 400 })
    }

    // Check if prefix already exists
    const existingDomain = await prisma.customDomain.findUnique({
      where: {
        prefix: prefix.toLowerCase()
      }
    })

    if (existingDomain) {
      return NextResponse.json({ error: '此域名前綴已被使用，請選擇其他名稱' }, { status: 400 })
    }

    // Create new domain
    const newDomain = await prisma.customDomain.create({
      data: {
        prefix: prefix.toLowerCase(),
        userId: session.user.id
      }
    })

    return NextResponse.json({
      message: '自訂域名創建成功',
      domain: newDomain
    })

  } catch (error) {
    console.error('Error creating domain:', error)
    return NextResponse.json({ error: '創建域名失敗，請稍後重試' }, { status: 500 })
  }
}