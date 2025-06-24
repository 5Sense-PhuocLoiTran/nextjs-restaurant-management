import guestApiRequests from '@/apiRequests/guest'
import { cookies } from 'next/headers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: 'Missing access token or refresh token',
      },
      {
        status: 200, // Successful response, but with missing tokens
      }
    )
  }

  try {
    const result = await guestApiRequests.sLogout({
      accessToken,
      refreshToken,
    })

    return Response.json(result.payload)
  } catch (error) {
    return Response.json(
      {
        message: 'An unexpected error occurred during logout.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
      }
    )
  }
}
