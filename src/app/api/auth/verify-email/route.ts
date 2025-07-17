import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ error: '驗證令牌缺失' }, { status: 400 })
    }
    
    // Find verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true }
    })
    
    if (!verificationToken) {
      return NextResponse.json({ error: '無效的驗證令牌' }, { status: 400 })
    }
    
    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id }
      })
      return NextResponse.json({ error: '驗證令牌已過期' }, { status: 400 })
    }
    
    // Update user as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true }
    })
    
    // Delete the verification token
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id }
    })
    
    return NextResponse.json({ 
      message: '電子郵件驗證成功！您現在可以登入了。' 
    })
    
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: '驗證失敗，請稍後重試' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: '請提供電子郵件地址' }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({ error: '找不到此電子郵件的用戶' }, { status: 404 })
    }
    
    if (user.emailVerified) {
      return NextResponse.json({ error: '電子郵件已經驗證過了' }, { status: 400 })
    }
    
    // Delete existing tokens for this user
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id }
    })
    
    // Generate new verification token
    const { generateToken, generateTokenExpiry } = await import('@/lib/email')
    const token = generateToken()
    const expires = generateTokenExpiry()
    
    await prisma.emailVerificationToken.create({
      data: {
        token,
        userId: user.id,
        expires
      }
    })
    
    // Send verification email
    try {
      const { createTransporter, getEmailConfig, sendVerificationEmail } = await import('@/lib/email')
      const emailConfig = getEmailConfig()
      const transporter = createTransporter(emailConfig)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      await sendVerificationEmail(transporter, user.email, token, baseUrl)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      return NextResponse.json({ error: '發送驗證郵件失敗' }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: '驗證郵件已重新發送！請檢查您的郵箱。' 
    })
    
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ error: '重新發送驗證郵件失敗' }, { status: 500 })
  }
}