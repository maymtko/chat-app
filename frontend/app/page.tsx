'use client'

import AuthForm from '@/app/components/authForm'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/chat')
    }
  }, [user, router])

  if (loading || user) {
    return (
      <main className="w-full h-screen flex items-center justify-center dark:bg-black">
      </main>
    )
  }
  return (
    <main className="w-full h-screen flex items-center justify-center dark:bg-black">
      <AuthForm />
    </main>
  )
}
