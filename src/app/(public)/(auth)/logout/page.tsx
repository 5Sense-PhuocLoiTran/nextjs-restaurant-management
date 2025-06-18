'use client'

import { Suspense } from 'react'
import LogoutContent from './_components/page-content'

export default function Logout() {
  return (
    <Suspense fallback={<div>Logging out...</div>}>
      <LogoutContent />
    </Suspense>
  )
}
