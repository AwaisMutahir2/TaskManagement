import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await verifyToken(token)
    return NextResponse.next()
  } catch (error) {
    console.log("acha to yeh weeoror he",error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
}