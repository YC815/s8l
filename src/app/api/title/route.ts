import { NextRequest, NextResponse } from 'next/server'
import { fetchPageTitle, validateUrl } from '@/lib/url-shortener'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: '請提供網址參數' }, { status: 400 })
    }
    
    const validatedUrl = validateUrl(url)
    const title = await fetchPageTitle(validatedUrl)
    
    return NextResponse.json({ title })
    
  } catch (error) {
    console.error('Error in title API:', error)
    
    if (error instanceof Error && error.message === '網址格式錯誤，請檢查') {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json({ title: '無法獲取標題' })
  }
}