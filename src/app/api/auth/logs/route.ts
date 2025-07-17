import { NextRequest, NextResponse } from 'next/server'
import { getLogs, addLog } from '@/lib/logging'

export async function GET() {
  return NextResponse.json({
    logs: getLogs(),
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    addLog(message)
    
    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString() 
    })
    
  } catch (error) {
    console.error('❌ Log endpoint error:', error)
    return NextResponse.json({
      error: 'Failed to log message',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}