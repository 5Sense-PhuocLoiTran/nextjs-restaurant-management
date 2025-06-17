/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHORIZED_PATHS = ['/login', '/register', '/refresh-token']

export default function RefreshToken() {
  const pathName = usePathname()
  useEffect(() => {
    if (UNAUTHORIZED_PATHS.includes(pathName)) {
      return
    }

    let interval: any = null

    // goi ngay 1 lan de check xem co can refresh token khong
    // neu khong goi ngay 1 lan thi khi load trang dau tien se khong refresh token
    // vi token da het han thi se khong refresh duoc
    // neu goi ngay 1 lan thi se refresh token neu can thiet
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      },
    })
    //timeout phai nho hon thoi gian het han ex ACTK 10s timeout -> interval nen set 1s
    const TIMEOUT = 1000 // 1 second
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
        },
      })
    }, TIMEOUT)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [pathName])
  return null
}
