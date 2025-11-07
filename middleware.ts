import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Allow public files and login
  if (PUBLIC_FILE.test(pathname) || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/login')) {
    return NextResponse.next()
  }
  // Check for Supabase session cookie set by client (sb-access-token)
  const token = req.cookies.get('sb-access-token')?.value || ''
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}
