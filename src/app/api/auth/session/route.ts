import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth-simple'

export async function GET() {
  try {
    console.log('🔍 Session API endpoint called')
    
    const session = await auth()
    console.log('📝 Session result:', session)
    
    if (!session) {
      console.log('❌ No session found')
      return NextResponse.json(null)
    }
    
    console.log('✅ Session found:', { userId: session.user?.id, email: session.user?.email })
    
    return NextResponse.json(session)
    
  } catch (error) {
    console.error('❌ Session API error:', error)
    return NextResponse.json({
      error: 'Session retrieval failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}