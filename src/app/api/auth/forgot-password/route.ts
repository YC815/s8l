import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createTransporter, getEmailConfig, sendPasswordResetEmail, generateToken, generateShortTokenExpiry } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: '請提供電子郵件地址' }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    // Always return success to prevent email enumeration
    const successMessage = '如果此電子郵件地址存在於我們的系統中，您將收到重設密碼的指示。'
    
    if (!user) {
      return NextResponse.json({ message: successMessage })
    }
    
    if (!user.emailVerified) {
      return NextResponse.json({ error: '請先驗證您的電子郵件地址' }, { status: 400 })
    }
    
    // Delete existing password reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    })
    
    // Generate password reset token
    const token = generateToken()
    const expires = generateShortTokenExpiry() // 15 minutes
    
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expires
      }
    })
    
    // Send password reset email
    try {
      const emailConfig = getEmailConfig()
      const transporter = createTransporter(emailConfig)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      await sendPasswordResetEmail(transporter, user.email, token, baseUrl)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      return NextResponse.json({ error: '發送重設郵件失敗' }, { status: 500 })
    }
    
    return NextResponse.json({ message: successMessage })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: '請求失敗，請稍後重試' }, { status: 500 })
  }
}