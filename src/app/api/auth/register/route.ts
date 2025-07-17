import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: '請提供電子郵件和密碼' }, { status: 400 })
    }
    
    if (password.length < 8) {
      return NextResponse.json({ error: '密碼長度至少需要 8 個字符' }, { status: 400 })
    }
    
    // Check password requirements (must contain numbers and letters)
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    if (!hasLetter || !hasNumber) {
      return NextResponse.json({ error: '密碼必須包含英文字母和數字' }, { status: 400 })
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: '此電子郵件已被註冊' }, { status: 400 })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user with auto-verification (temporary until email service is set up)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        emailVerified: true // Auto-verify for now
      }
    })
    
    return NextResponse.json({ 
      message: '註冊成功！您現在可以直接登入。',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: '註冊失敗，請稍後重試' }, { status: 500 })
  }
}