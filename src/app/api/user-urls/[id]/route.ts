import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// DELETE - Delete user URL
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    const { id: userUrlId } = await params

    // Check if UserUrl exists and belongs to user
    const userUrl = await prisma.userUrl.findUnique({
      where: {
        id: userUrlId
      },
      include: {
        url: true
      }
    })

    if (!userUrl) {
      return NextResponse.json({ error: '短網址不存在' }, { status: 404 })
    }

    if (userUrl.userId !== session.user.id) {
      return NextResponse.json({ error: '沒有權限刪除此短網址' }, { status: 403 })
    }

    // Delete the UserUrl record
    await prisma.userUrl.delete({
      where: {
        id: userUrlId
      }
    })

    // Check if this was the last UserUrl for this URL record
    const remainingUserUrls = await prisma.userUrl.count({
      where: {
        urlId: userUrl.urlId
      }
    })

    // If no other UserUrls reference this URL, delete the URL record too
    if (remainingUserUrls === 0) {
      await prisma.url.delete({
        where: {
          id: userUrl.urlId
        }
      })
    }

    return NextResponse.json({ message: '短網址已刪除' })

  } catch (error) {
    console.error('Error deleting user URL:', error)
    return NextResponse.json({ error: '刪除短網址失敗，請稍後重試' }, { status: 500 })
  }
}