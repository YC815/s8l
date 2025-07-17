import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Get user's URLs with search and filter
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'newest' // newest, oldest, clicks
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const whereClause: {
      userId: string
      OR?: Array<{
        url?: { 
          title?: { contains: string; mode: 'insensitive' }
          originalUrl?: { contains: string; mode: 'insensitive' }
        }
        customTitle?: { contains: string; mode: 'insensitive' }
      }>
      createdAt?: {
        gte?: Date
        lte?: Date
      }
    } = {
      userId: session.user.id
    }

    // Add search filter (search in title and original URL)
    if (search) {
      whereClause.OR = [
        {
          url: {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          customTitle: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          url: {
            originalUrl: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    // Add date filter
    if (startDate || endDate) {
      whereClause.createdAt = {}
      if (startDate) {
        whereClause.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.createdAt.lte = new Date(endDate + 'T23:59:59.999Z')
      }
    }

    // Build order by clause
    let orderBy: 
      | { createdAt: 'desc' | 'asc' }
      | { url: { clickCount: 'desc' } } = { createdAt: 'desc' } // default
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' }
    } else if (sortBy === 'clicks') {
      orderBy = { url: { clickCount: 'desc' } }
    }

    // Get total count for pagination
    const totalCount = await prisma.userUrl.count({
      where: whereClause
    })

    // Get URLs with pagination
    const userUrls = await prisma.userUrl.findMany({
      where: whereClause,
      include: {
        url: true,
        customDomain: true
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    })

    // Format response
    const formattedUrls = userUrls.map(userUrl => {
      let shortUrl
      if (userUrl.customDomainId && userUrl.customPath) {
        // Custom domain URL
        shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${userUrl.customDomain!.prefix}.s8l.xyz/${userUrl.customPath}`
      } else {
        // Regular short URL
        shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${userUrl.url.shortCode}`
      }

      return {
        id: userUrl.id,
        originalUrl: userUrl.url.originalUrl,
        title: userUrl.customTitle || userUrl.url.title,
        shortUrl,
        shortCode: userUrl.url.shortCode,
        customPath: userUrl.customPath,
        customDomain: userUrl.customDomain?.prefix,
        clickCount: userUrl.url.clickCount,
        createdAt: userUrl.createdAt,
        isCustom: !!userUrl.customDomainId
      }
    })

    return NextResponse.json({
      urls: formattedUrls,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching user URLs:', error)
    return NextResponse.json({ error: '獲取短網址列表失敗' }, { status: 500 })
  }
}