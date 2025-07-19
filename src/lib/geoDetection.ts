import type { Language } from './translations'

export interface GeoLocation {
  country: string
  countryCode: string
  region?: string
  city?: string
}

// 地區到語言的映射
const COUNTRY_LANGUAGE_MAP: Record<string, Language> = {
  'TW': 'zh', // 台灣 → 繁體中文
  'JP': 'ja', // 日本 → 日文
  'CN': 'zh', // 中國 → 繁體中文 (可根據需求調整)
  'HK': 'zh', // 香港 → 繁體中文
  'MO': 'zh', // 澳門 → 繁體中文
  'SG': 'zh', // 新加坡 → 繁體中文 (可根據需求調整)
}

// 預設語言為英文
const DEFAULT_LANGUAGE: Language = 'en'

// 統一的 API 響應類型
type ApiResponse = Record<string, unknown>

// 多個免費 IP 地理位置 API 服務
const GEO_APIS = [
  {
    name: 'ipapi.co',
    url: 'https://ipapi.co/json/',
    parseResponse: (data: ApiResponse): GeoLocation => ({
      country: (data.country_name as string) || '',
      countryCode: (data.country_code as string) || '',
      region: (data.region as string) || '',
      city: (data.city as string) || ''
    })
  },
  {
    name: 'ip-api.com',
    url: 'https://ip-api.com/json/',
    parseResponse: (data: ApiResponse): GeoLocation => ({
      country: (data.country as string) || '',
      countryCode: (data.countryCode as string) || '',
      region: (data.regionName as string) || '',
      city: (data.city as string) || ''
    })
  },
  {
    name: 'ipinfo.io',
    url: 'https://ipinfo.io/json',
    parseResponse: (data: ApiResponse): GeoLocation => ({
      country: (data.country as string) || '',
      countryCode: (data.country as string) || '',
      region: (data.region as string) || '',
      city: (data.city as string) || ''
    })
  }
] as const

/**
 * 使用單一 API 獲取地理位置
 */
async function fetchGeoFromAPI(
  api: {
    readonly name: string
    readonly url: string
    readonly parseResponse: (data: ApiResponse) => GeoLocation
  }, 
  timeout: number = 3000
): Promise<GeoLocation> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(api.url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return api.parseResponse(data)
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

/**
 * 使用 fallback 機制獲取地理位置
 * 嘗試多個 API，直到成功或全部失敗
 */
export async function detectGeoLocation(): Promise<GeoLocation | null> {
  for (const api of GEO_APIS) {
    try {
      console.log(`嘗試使用 ${api.name} 獲取地理位置...`)
      const location = await fetchGeoFromAPI(api, 3000)
      console.log(`成功從 ${api.name} 獲取地理位置:`, location)
      return location
    } catch (error) {
      console.warn(`${api.name} 失敗:`, error)
      continue
    }
  }

  console.error('所有地理位置 API 都失敗了')
  return null
}

/**
 * 根據地理位置確定預設語言
 */
export function getLanguageFromGeo(location: GeoLocation): Language {
  const countryCode = location.countryCode?.toUpperCase()
  
  if (countryCode && COUNTRY_LANGUAGE_MAP[countryCode]) {
    return COUNTRY_LANGUAGE_MAP[countryCode]
  }
  
  return DEFAULT_LANGUAGE
}

/**
 * 從瀏覽器語言偏好推斷語言
 */
export function getLanguageFromBrowser(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE

  const browserLang = navigator.language || navigator.languages?.[0] || ''
  
  // 檢查瀏覽器語言設定
  if (browserLang.startsWith('zh')) {
    // 中文相關的語言碼
    if (browserLang.includes('TW') || browserLang.includes('HK') || browserLang.includes('MO')) {
      return 'zh' // 繁體中文
    }
    return 'zh' // 預設繁體中文
  } else if (browserLang.startsWith('ja')) {
    return 'ja' // 日文
  } else if (browserLang.startsWith('en')) {
    return 'en' // 英文
  }
  
  return DEFAULT_LANGUAGE
}

/**
 * 綜合地理位置和瀏覽器偏好確定最佳語言
 */
export async function detectBestLanguage(): Promise<Language> {
  try {
    // 1. 嘗試地理位置檢測
    const geoLocation = await detectGeoLocation()
    if (geoLocation) {
      const geoLanguage = getLanguageFromGeo(geoLocation)
      console.log(`基於地理位置 (${geoLocation.countryCode}) 推薦語言: ${geoLanguage}`)
      return geoLanguage
    }
  } catch (error) {
    console.warn('地理位置檢測失敗:', error)
  }

  // 2. 回退到瀏覽器語言偏好
  const browserLanguage = getLanguageFromBrowser()
  console.log(`基於瀏覽器偏好推薦語言: ${browserLanguage}`)
  return browserLanguage
}

/**
 * 緩存地理檢測結果（24小時）
 */
const GEO_CACHE_KEY = 'geo_detection_cache'
const GEO_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24小時

export function getCachedGeoLanguage(): Language | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(GEO_CACHE_KEY)
    if (!cached) return null

    const { language, timestamp } = JSON.parse(cached)
    const now = Date.now()

    // 檢查緩存是否過期
    if (now - timestamp > GEO_CACHE_DURATION) {
      localStorage.removeItem(GEO_CACHE_KEY)
      return null
    }

    return language as Language
  } catch {
    return null
  }
}

export function setCachedGeoLanguage(language: Language): void {
  if (typeof window === 'undefined') return

  try {
    const cacheData = {
      language,
      timestamp: Date.now()
    }
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cacheData))
  } catch {
    // 忽略存儲錯誤
  }
}