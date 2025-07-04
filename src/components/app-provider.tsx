'use client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import RefreshToken from './refresh-token'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage,
} from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRole: (role: RoleType | undefined) => {},
})

export const useAppContext = () => useContext(AppContext)

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodeToken(accessToken)?.role
      setRoleState(role)
    }
  }, [])

  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) removeTokensFromLocalStorage()
  }

  const isAuth = Boolean(role)

  return (
    <AppContext.Provider value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
