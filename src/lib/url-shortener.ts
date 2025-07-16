const URL_SAFE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

export function generateShortCode(length: number = 6): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += URL_SAFE_CHARS.charAt(Math.floor(Math.random() * URL_SAFE_CHARS.length))
  }
  return result
}

export function validateUrl(url: string): string {
  let processedUrl = url.trim()
  
  if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
    processedUrl = 'https://' + processedUrl
  }
  
  try {
    new URL(processedUrl)
    return processedUrl
  } catch {
    throw new Error('網址格式錯誤，請檢查')
  }
}

export async function fetchPageTitle(url: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URL-Shortener/1.0)'
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      return '無法獲取標題'
    }
    
    const html = await response.text()
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    
    return titleMatch ? titleMatch[1].trim() : '無法獲取標題'
  } catch {
    return '無法獲取標題'
  }
}