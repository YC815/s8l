const URL_SAFE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

// Reserved words that cannot be used as short codes to avoid route conflicts
const RESERVED_WORDS = ['line', 'auth', 'api', 'dashboard', 'admin', 'app', 'www', 'ftp', 'mail', 'docs']

export function generateShortCode(length: number = 6): string {
  let result = ''
  let attempts = 0
  const maxAttempts = 50
  
  do {
    result = ''
    for (let i = 0; i < length; i++) {
      result += URL_SAFE_CHARS.charAt(Math.floor(Math.random() * URL_SAFE_CHARS.length))
    }
    attempts++
  } while (RESERVED_WORDS.includes(result.toLowerCase()) && attempts < maxAttempts)
  
  // If we couldn't generate a non-reserved code, add a random suffix
  if (RESERVED_WORDS.includes(result.toLowerCase())) {
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
    const timeoutId = setTimeout(() => controller.abort(), 1000)
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URL-Shortener/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      },
      method: 'GET',
      redirect: 'follow'
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      console.warn(`Failed to fetch title for ${url}: ${response.status}`)
      return '無法獲取標題'
    }
    
    // 只讀取前 64KB 來避免大文件問題
    const reader = response.body?.getReader()
    if (!reader) {
      return '無法獲取標題'
    }
    
    let html = ''
    let totalBytes = 0
    const maxBytes = 64 * 1024 // 64KB
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      totalBytes += value.length
      if (totalBytes > maxBytes) {
        reader.cancel()
        break
      }
      
      html += new TextDecoder().decode(value, { stream: true })
      
      // 如果已經找到 title 標籤，就停止讀取
      if (html.includes('</title>')) {
        reader.cancel()
        break
      }
    }
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : '無法獲取標題'
    
    // 清理標題中的多餘空白和特殊字符
    return title.replace(/\s+/g, ' ').substring(0, 200)
    
  } catch (error) {
    console.warn(`Error fetching title for ${url}:`, error)
    return '無法獲取標題'
  }
}