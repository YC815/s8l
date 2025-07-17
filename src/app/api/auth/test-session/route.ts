import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    console.log('🔍 Test session endpoint called')
    
    const session = await auth()
    console.log('📝 Session result:', session)
    
    return NextResponse.json({
      session,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Test session error:', error)
    return NextResponse.json({
      error: 'Session test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}