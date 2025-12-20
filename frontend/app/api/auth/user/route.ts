import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || ''

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/user`, {
    headers: {
      cookie,
    },
  })

  if (!res.ok) {
    return NextResponse.json(null, { status: 401 })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
