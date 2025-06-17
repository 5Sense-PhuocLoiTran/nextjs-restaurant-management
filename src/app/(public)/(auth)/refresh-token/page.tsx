'use client'

import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function RefreshToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const redirectPathNameFromUrl = searchParams.get('redirectPathName')

  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathNameFromUrl || '/')
        },
      })
    }
  }, [, router, refreshTokenFromUrl, redirectPathNameFromUrl])

  return (
    <div className="min-h-screen flex items-center justify-center">
      Refresh Token
    </div>
  )
}
