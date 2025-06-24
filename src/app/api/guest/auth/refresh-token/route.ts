/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import guestApiRequests from '@/apiRequests/guest'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const refreshTokenFromCookie = cookieStore.get('refreshToken')?.value

  if (!refreshTokenFromCookie) {
    return Response.json(
      {
        message: 'Can not find',
      },
      {
        status: 401,
      }
    )
  }
  try {
    const { payload } = await guestApiRequests.sRefreshToken({
      refreshToken: refreshTokenFromCookie,
    })
    const { accessToken, refreshToken } = payload.data
    const decodedAccessToken = jwt.decode(accessToken) as {
      exp: number
    }
    const decodedRefreshToken = jwt.decode(refreshToken) as {
      exp: number
    }

    cookieStore.set('accessToken', accessToken, {
      expires: decodedAccessToken.exp * 1000,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: true,
    })

    cookieStore.set('refreshToken', refreshToken, {
      expires: decodedRefreshToken.exp * 1000,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: true,
    })

    return Response.json(payload)
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ? error.message : 'Unknown error',
      },
      {
        status: 401,
      }
    )
  }
}
