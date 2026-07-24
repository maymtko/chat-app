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
    <form onSubmit={handleSubmit} className="space-y-4 p-20 border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-xl dark:shadow-black/40 rounded-xl shadow-sm">
      <div className="mb-6 text-center">
      <h1 className="text-3xl font-bold text-blue-500 dark:text-white">
        Welcome to ChatApp!
      </h1>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Sign in to continue your conversations.
      </p>
    </div>
      <input
        type="email"
        className="p-2 w-full border border-slate-200 dark:border-zinc-700 rounded focus:outline-none"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border border-slate-200 dark:border-zinc-700 p-2 w-full rounded focus:outline-none"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  )
}
