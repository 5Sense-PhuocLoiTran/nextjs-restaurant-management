import { NextResponse, type NextRequest } from 'next/server'

const PRIVATE_PATHS = ['/manage', '/orders']
const UNAUTHENTICATED_PATHS = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthenticated = Boolean(
    request.cookies.get('accessToken')?.value
  )
  if (
    PRIVATE_PATHS.some((path) =>
      pathname.startsWith(path)
    ) &&
    !isAuthenticated
  ) {
    // Redirect to login if trying to access a private path without authentication
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  if (
    UNAUTHENTICATED_PATHS.some((path) =>
      pathname.startsWith(path)
    ) &&
    isAuthenticated
  ) {
    // Redirect to home if trying to access a public path while authenticated
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login'],
}
