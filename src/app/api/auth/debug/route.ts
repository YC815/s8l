import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔍 Debug endpoint called')
    
    // Test database connection
    const userCount = await prisma.user.count()
    console.log('📊 Database connection test - User count:', userCount)
    
    // Check environment variables
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    }
    console.log('🌍 Environment variables:', env)
    
    // Test Prisma connection
    const dbStatus = await prisma.$queryRaw`SELECT 1 as test`
    console.log('🗄️  Database query test:', dbStatus)
    
    return NextResponse.json({
      status: 'OK',
      userCount,
      environment: env,
      dbStatus,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Debug endpoint error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}