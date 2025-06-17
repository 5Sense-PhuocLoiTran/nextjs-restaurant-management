import { NextResponse, type NextRequest } from 'next/server'

const PRIVATE_PATHS = ['/manage', '/orders']
const UNAUTHENTICATED_PATHS = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Chua dang nhap thi khong cho vao private path
  if (
    PRIVATE_PATHS.some((path) => pathname.startsWith(path)) &&
    !refreshToken
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // dang nhap roi, nhung accessToken het han
  if (
    PRIVATE_PATHS.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL('/refresh-token', request.url)
    url.searchParams.set('refreshToken', refreshToken)
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Dang nhap roi, khong cho vao login page
  if (
    UNAUTHENTICATED_PATHS.some((path) => pathname.startsWith(path)) &&
    refreshToken
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login'],
}
