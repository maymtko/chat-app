import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')
  const pathname = req.nextUrl.pathname

  if (
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/chat') && !token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:path*'],
}
