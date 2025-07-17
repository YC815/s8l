import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signUpSchema, AUTH_ERRORS, createRateLimiter } from '@/lib/auth-utils'
import { z } from 'zod'

// Rate limiter: 5 registration attempts per IP per hour
const rateLimiter = createRateLimiter(5, 60 * 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
    if (!rateLimiter(clientIP)) {
      return NextResponse.json({ error: AUTH_ERRORS.RATE_LIMIT_EXCEEDED }, { status: 429 })
    }

    const body = await request.json()
    
    // Validate input using Zod schema
    const validationResult = signUpSchema.safeParse(body)
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || AUTH_ERRORS.MISSING_FIELDS
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { email, password, name } = validationResult.data
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: AUTH_ERRORS.USER_EXISTS }, { status: 400 })
    }
    
    // Hash password with higher salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user with auto-verification (temporary until email service is set up)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        emailVerified: true, // Auto-verify for now
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    // Don't return sensitive information
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
    
    // Handle specific Prisma errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: AUTH_ERRORS.MISSING_FIELDS }, { status: 400 })
    }
    
    return NextResponse.json({ error: AUTH_ERRORS.REGISTRATION_FAILED }, { status: 500 })
  }
}