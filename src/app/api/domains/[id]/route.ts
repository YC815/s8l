import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth-simple'
import { prisma } from '@/lib/db'

// DELETE - Delete custom domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '請先登入' }, { status: 401 })
    }

    const { id: domainId } = await params

    // Check if domain exists and belongs to user
    const domain = await prisma.customDomain.findUnique({
      where: {
        id: domainId
      }
    })

    if (!domain) {
      return NextResponse.json({ error: '域名不存在' }, { status: 404 })
    }

    if (domain.userId !== session.user.id) {
      return NextResponse.json({ error: '沒有權限刪除此域名' }, { status: 403 })
    }

    // Delete domain (this will cascade delete related UserUrls)
    await prisma.customDomain.delete({
      where: {
        id: domainId
      }
    })

    return NextResponse.json({ message: '域名已刪除' })

  } catch (error) {
    console.error('Error deleting domain:', error)
    return NextResponse.json({ error: '刪除域名失敗，請稍後重試' }, { status: 500 })
  }
}