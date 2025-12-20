import { NextResponse } from 'next/server'

export async function GET() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}rooms`, {
  })

  if (!res.ok) {
    return NextResponse.json(null, { status: 401 })
  }

  const data = await res.json()

  return NextResponse.json(data)
}
