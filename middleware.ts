import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = new Set([
  '/',
  '/signin',
  '/register',
])

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  // Allow Next internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // Public routes
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  // Check auth status by calling backend via the same origin (rewritten to Express)
  try {
    const statusResponse = await fetch(`${origin}/api/auth/status`, {
      headers: { Cookie: request.headers.get('cookie') || '' },
      credentials: 'include',
    })

    if (!statusResponse.ok) {
      const url = new URL('/signin', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    const data = await statusResponse.json()
    const isAuthenticated = !!data?.isAuthenticated

    if (!isAuthenticated) {
      const url = new URL('/signin', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (_error) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/((?!_next|api|favicon|images|public).*)'],
}

