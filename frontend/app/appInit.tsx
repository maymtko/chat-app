'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from '@/lib/features/auth/authSlice'
import { AppDispatch } from '@/lib/store'
import { useAppSelector } from '@/lib/hooks'

export function AppInit({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>()
    const { loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

    if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return <>{children}</>
}
