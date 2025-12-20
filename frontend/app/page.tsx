'use client'

import AuthForm from '@/app/components/authForm'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/chat')
    }
  }, [user, router])
  return (
    <main className="w-full h-screen flex items-center justify-center">
      {/* {user ? (
        <h1 className="text-xl">Welcome {user.email}</h1>
      ) : 
      ( */}
        <AuthForm />
       {/* )}  */}
    </main>
  )
}
