/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { EntityError } from './http'
import { toast } from 'sonner'
import authApiRequests from '@/apiRequests/auth'
import jwt from 'jsonwebtoken'
import { DishStatus, OrderStatus, Role, TableStatus } from '@/constants/type'
import envConfig from '@/config'
import { TokenPayload } from '@/types/jwt.types'
import guestApiRequests from '@/apiRequests/guest'

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

  const decodedAccessToken = decodeToken(accessToken)

  const decodedRefreshToken = decodeToken(refreshToken)

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
      const role = decodedRefreshToken.role
      const res =
        role === Role.Guest
          ? await guestApiRequests.refreshToken()
          : await authApiRequests.refreshToken()

      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      if (params?.onSuccess) params.onSuccess()
    } catch (error) {
      if (params?.onError) params.onError()
      console.error('Failed to refresh token:', error)
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(number)
}

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseDishStatusOrder = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return 'Còn món nhen ^^'
    case DishStatus.Unavailable:
      return 'Hết món rồi :((('
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string
  tableNumber: number
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
  )
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}
