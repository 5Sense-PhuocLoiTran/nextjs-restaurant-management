import { NextResponse, type NextRequest } from 'next/server'
import { decodeToken } from './lib/utils'
import { Role } from './constants/type'

const MANAGE_PATH = ['/manage']
const GUEST_PATH = ['/guest']
const PRIVATE_PATHS = [...MANAGE_PATH, ...GUEST_PATH]
const UNAUTHENTICATED_PATHS = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  // 1. Chua dang nhap thi khong cho vao private path
  if (
    PRIVATE_PATHS.some((path) => pathname.startsWith(path)) &&
    !refreshToken
  ) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearToken', 'true')

    return NextResponse.redirect(url)
  }

  // 2. Dang nhap roi

  if (refreshToken) {
    // 2.1 neu co tinh vao login thi redirect ve trang chu
    if (UNAUTHENTICATED_PATHS.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 2.2 nhung accessToken het han
    if (
      PRIVATE_PATHS.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }

    // 2.3 Vao khong dung role redirect ve trang chu
    const role = decodeToken(refreshToken)?.role
    // Guest can only access guest paths, not manage paths
    const isGuestPathGoToManage =
      role === Role.Guest &&
      MANAGE_PATH.some((path) => pathname.startsWith(path))

    // Not a guest but trying to access guest paths
    const isNotGuestPathGoToGuest =
      role !== Role.Guest &&
      GUEST_PATH.some((path) => pathname.startsWith(path))

    if (isGuestPathGoToManage || isNotGuestPathGoToGuest) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/login', '/guest/:path*'],
}
