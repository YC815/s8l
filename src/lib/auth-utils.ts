import { z } from 'zod'

// Validation schemas
export const signInSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(1, '請輸入密碼'),
})

export const signUpSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string()
    .min(8, '密碼至少需要 8 個字符')
    .regex(/[a-zA-Z]/, '密碼必須包含英文字母')
    .regex(/\d/, '密碼必須包含數字'),
  name: z.string().optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, '重置令牌不能為空'),
  password: z.string()
    .min(8, '密碼至少需要 8 個字符')
    .regex(/[a-zA-Z]/, '密碼必須包含英文字母')
    .regex(/\d/, '密碼必須包含數字'),
})

// Type definitions
export type SignInData = z.infer<typeof signInSchema>
export type SignUpData = z.infer<typeof signUpSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>

// Auth error messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: '電子郵件或密碼錯誤',
  USER_EXISTS: '此電子郵件已被註冊',
  USER_NOT_FOUND: '找不到此用戶',
  INVALID_TOKEN: '無效的令牌',
  EXPIRED_TOKEN: '令牌已過期',
  MISSING_FIELDS: '請填寫所有必填字段',
  WEAK_PASSWORD: '密碼強度不足',
  REGISTRATION_FAILED: '註冊失敗，請稍後重試',
  LOGIN_FAILED: '登入失敗，請稍後重試',
  PASSWORD_RESET_FAILED: '密碼重置失敗，請稍後重試',
  EMAIL_SEND_FAILED: '郵件發送失敗，請稍後重試',
  EMAIL_NOT_VERIFIED: '電子郵件尚未驗證',
  RATE_LIMIT_EXCEEDED: '請求過於頻繁，請稍後重試',
  SERVER_ERROR: '服務器錯誤，請稍後重試',
} as const

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else feedback.push('密碼至少需要 8 個字符')

  if (/[a-z]/.test(password)) score += 1
  else feedback.push('需要包含小寫字母')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('建議包含大寫字母')

  if (/\d/.test(password)) score += 1
  else feedback.push('需要包含數字')

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push('建議包含特殊字符')

  return { score, feedback }
}

// Rate limiting helper
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, number[]>()

  return (key: string): boolean => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!requests.has(key)) {
      requests.set(key, [])
    }
    
    const userRequests = requests.get(key)!
    // Filter out old requests
    const recentRequests = userRequests.filter(time => time > windowStart)
    
    if (recentRequests.length >= maxRequests) {
      return false
    }
    
    recentRequests.push(now)
    requests.set(key, recentRequests)
    return true
  }
}

// Session helpers
export function getSessionExpiry(hours: number = 24): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000)
}

export function isSessionExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate
}

// Token generation
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input.trim().toLowerCase()
}