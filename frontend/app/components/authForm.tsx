'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { loginUser } from '@/lib/features/auth/authSlice'
import { RootState } from '@/lib/store'
import { useAppDispatch } from '@/lib/hooks'
export default function AuthForm() {
  const dispatch = useAppDispatch()
  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if(!email.trim().length && !password.trim().length) return;
    dispatch(loginUser({ email, password }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-20 border border-gray-300 rounded-xl shadow-sm">
      <input
        type="email"
        className="border  border-gray-300 p-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border border-gray-300  p-2 w-full"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white px-4 py-2"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  )
}
