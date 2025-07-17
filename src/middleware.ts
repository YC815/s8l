import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Protected routes
  const protectedRoutes = ['/dashboard']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // If it's a protected route and user is not authenticated, redirect to signin
  if (isProtectedRoute && !req.auth) {
    const callbackUrl = encodeURIComponent(pathname)
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}