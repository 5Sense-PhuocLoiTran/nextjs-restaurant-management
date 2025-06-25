'use client'

import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLoggedIn?: boolean
}[] = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'Menu',
    href: '/guest/menu',
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLoggedIn: true,
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee],
  },
]

export default function NavItems({ className }: { className?: string }) {
  const router = useRouter()
  const { role, setRole } = useAppContext()
  const logoutMutation = useLogoutMutation()

  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole(undefined)
      router.push('/')
    } catch (error) {
      handleErrorApi({
        error,
      })
    }
  }

  return (
    <>
      {menuItems.map((item) => {
        const isAuth = item.role && role && item.role.includes(role)
        const canShow =
          (item.role === undefined && !item.hideWhenLoggedIn) ||
          (!role && item.hideWhenLoggedIn)

        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }
        return null
      })}
      {role && (
        <button
          className={`${className} cursor-pointer`}
          onClick={logout}
          disabled={logoutMutation.isPending}
        >
          Đăng xuất
        </button>
      )}
    </>
  )
}
