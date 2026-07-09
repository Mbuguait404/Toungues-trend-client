import { NextRequest, NextResponse } from 'next/server'

/**
 * Route protection middleware.
 * Reads the presence of a refresh_token cookie as the "is logged in" signal
 * (the actual token validation happens server-side on the API).
 * Role-based access is enforced by checking the role stored in a client-readable
 * `tt_role` cookie that the AuthContext sets after login.
 */

const PROTECTED: Record<string, string[]> = {
  '/learn': ['LEARNER', 'ADMIN'],
  '/teach': ['TEACHER', 'ADMIN'],
  '/admin': ['ADMIN'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Find matching protected prefix
  const matchedPrefix = Object.keys(PROTECTED).find((prefix) =>
    pathname.startsWith(prefix),
  )

  if (!matchedPrefix) return NextResponse.next()

  // Check for refresh token cookie (set by server as httpOnly)
  const hasSession = request.cookies.has('refresh_token')

  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role check via client-readable cookie set by AuthContext
  const role = request.cookies.get('tt_role')?.value

  if (role && !PROTECTED[matchedPrefix].includes(role)) {
    // Logged in but wrong role — redirect to their own portal
    if (role === 'TEACHER') return NextResponse.redirect(new URL('/teach/dashboard', request.url))
    if (role === 'LEARNER') return NextResponse.redirect(new URL('/learn/dashboard', request.url))
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/learn/:path*', '/teach/:path*', '/admin/:path*'],
}
