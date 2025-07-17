import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    
    if (!token || !password) {
      return NextResponse.json({ error: '請提供重設令牌和新密碼' }, { status: 400 })
    }
    
    if (password.length < 8) {
      return NextResponse.json({ error: '密碼長度至少需要 8 個字符' }, { status: 400 })
    }
    
    // Check password requirements
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    if (!hasLetter || !hasNumber) {
      return NextResponse.json({ error: '密碼必須包含英文字母和數字' }, { status: 400 })
    }
    
    // Find password reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    })
    
    if (!resetToken) {
      return NextResponse.json({ error: '無效的重設令牌' }, { status: 400 })
    }
    
    // Check if token has expired
    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
      return NextResponse.json({ error: '重設令牌已過期' }, { status: 400 })
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword }
    })
    
    // Delete the reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })
    
    return NextResponse.json({ 
      message: '密碼重設成功！您現在可以使用新密碼登入。' 
    })
    
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json({ error: '密碼重設失敗，請稍後重試' }, { status: 500 })
  }
}