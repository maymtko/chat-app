import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: "include", 
  })

  const apiResponse = await res.json()
  console.log('data usuer',apiResponse);
  
  if (!res.ok) {
    return NextResponse.json(apiResponse, { status: res.status })
  }


  const { access_token, user } = apiResponse.data 
  const response = NextResponse.json({ user })
  //store JWT in cookie
  response.cookies.set('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  return response

}
