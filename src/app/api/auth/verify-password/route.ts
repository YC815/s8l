import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: '請提供電子郵件和密碼' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return NextResponse.json({ error: '電子郵件或密碼錯誤' }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: '電子郵件或密碼錯誤' }, { status: 401 })
    }

    // TODO: Re-enable email verification when email service is configured
    // if (!user.emailVerified) {
    //   return NextResponse.json({ error: '電子郵件尚未驗證' }, { status: 401 })
    // }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    })
    
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json({ error: '驗證失敗，請稍後重試' }, { status: 500 })
  }
}