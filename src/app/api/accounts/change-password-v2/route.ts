/* eslint-disable @typescript-eslint/no-explicit-any */

import accountApiRequest from '@/apiRequests/account'
import { ChangePasswordV2BodyType } from '@/schemaValidations/account.schema'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function PUT(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const body = (await request.json()) as ChangePasswordV2BodyType

  if (!accessToken) {
    return Response.json(
      {
        message: 'Can not find Access Token in cookies',
      },
      {
        status: 401,
      }
    )
  }
  try {
    const { payload } = await accountApiRequest.sChangePasswordV2(
      accessToken,
      body
    )

    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number
    }
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number
    }

    cookieStore.set('accessToken', payload.data.accessToken, {
      expires: decodedAccessToken.exp * 1000,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: true,
    })

    cookieStore.set('refreshToken', payload.data.refreshToken, {
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
        status: error.status || 500,
      }
    )
  }
}
