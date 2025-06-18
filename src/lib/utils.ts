/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { toast } from 'sonner'
import authApiRequests from '@/apiRequests/auth'
import jwt from 'jsonwebtoken'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((err) => {
      setError(err.field as any, {
        type: 'server',
        message: err.message,
      })
    })
  } else {
    toast.error(error.message, {
      duration: duration || 3000,
      description: error.payload?.message || 'An unexpected error occurred.',
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem('accessToken') : null

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem('refreshToken') : null

export const setAccessTokenToLocalStorage = (token: string) =>
  isBrowser ? localStorage.setItem('accessToken', token) : null

export const setRefreshTokenToLocalStorage = (token: string) =>
  isBrowser ? localStorage.setItem('refreshToken', token) : null

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(number)
}

export const checkAndRefreshToken = async (params?: {
  onError?: () => void
  onSuccess?: () => void
}) => {
  // lay access toke va refresh moi nhat trong function checkAndRefreshToken
  // moi lan call checkAndRefreshToken se lay access token va refresh token moi nhat
  // tranh TH lay access token va refresh token truoc do roi goi cho cac lan sau

  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  if (!accessToken || !refreshToken) {
    return
  }

  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number
    iat: number
  }
  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number
    iat: number
  }
  // thoi diem het han toke tinh theo epoch time (s)
  // Dung new Date().getTime() thi reture epoch time (ms)

  const now = Date.now() / 1000 - 1 // epoch time in seconds

  //Token da het han
  if (decodedRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    return params?.onError && params.onError()
  }

  // ACTK thoi gian het han la 10s
  // kiem tra 1/3 thoi gian 3s thi RFTK
  // thoi gian co lai tinh dua vao cong thuc: decodedAccessToken.exp - now
  // thoi gian het han ACTK duoc tinh: decodedAccessToken.exp - decodedAccessToken.iat
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    // access token is still valid, no need to refresh
    try {
      const res = await authApiRequests.refreshToken()

      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      if (params?.onSuccess) params.onSuccess()
    } catch (error) {
      if (params?.onError) params.onError()
      console.error('Failed to refresh token:', error)
    }
  }
}
