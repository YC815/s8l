import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signUpSchema, AUTH_ERRORS, createRateLimiter } from '@/lib/auth-utils'
import { z } from 'zod'

// Rate limiter: 5 registration attempts per IP per hour
const rateLimiter = createRateLimiter(5, 60 * 60 * 1000)

export async function POST(request: NextRequest) {
  console.log('📝 API: Registration request received')
  
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
    console.log('🔍 API: Client IP:', clientIP)
    
    if (!rateLimiter(clientIP)) {
      console.log('❌ API: Rate limit exceeded for IP:', clientIP)
      return NextResponse.json({ error: AUTH_ERRORS.RATE_LIMIT_EXCEEDED }, { status: 429 })
    }

    const body = await request.json()
    console.log('📝 API: Request body:', { email: body.email, hasPassword: !!body.password, name: body.name })
    
    // Validate input using Zod schema
    const validationResult = signUpSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('❌ API: Validation failed:', validationResult.error.issues)
      const errorMessage = validationResult.error.issues[0]?.message || AUTH_ERRORS.MISSING_FIELDS
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { email, password, name } = validationResult.data
    console.log('✅ API: Validation passed')
    
    // Check if user already exists
    console.log('🔍 API: Checking if user exists:', email)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('❌ API: User already exists')
      return NextResponse.json({ error: AUTH_ERRORS.USER_EXISTS }, { status: 400 })
    }
    
    console.log('✅ API: User doesn\'t exist, creating new user')
    
    // Hash password with higher salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('✅ API: Password hashed')
    
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
    
    console.log('✅ API: User created:', { id: user.id, email: user.email, name: user.name })
    
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
    console.error('❌ API: Registration error:', error)
    
    // Handle specific Prisma errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: AUTH_ERRORS.MISSING_FIELDS }, { status: 400 })
    }
    
    return NextResponse.json({ error: AUTH_ERRORS.REGISTRATION_FAILED }, { status: 500 })
  }
}