'use client'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

export function Protected({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user)
  if (!user) return null
  return <>{children}</>
}
