// Debug utility for authentication
export function debugAuth(message: string, data?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH DEBUG] ${message}`, data)
  }
}

// Environment check
export function checkEnvironment() {
  const requiredEnvVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'DATABASE_URL',
    'NEXT_PUBLIC_BASE_URL'
  ]
  
  const missing = requiredEnvVars.filter(env => !process.env[env])
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing)
    return false
  }
  
  console.log('✅ All required environment variables are set')
  return true
}

// Log current environment
export function logEnvironment() {
  console.log('🌍 Environment:', process.env.NODE_ENV)
  console.log('🔗 NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
  console.log('🔗 NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL)
  console.log('🔐 NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '***SET***' : 'NOT SET')
  console.log('🗄️  DATABASE_URL:', process.env.DATABASE_URL ? '***SET***' : 'NOT SET')
}