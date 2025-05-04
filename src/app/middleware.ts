import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Get JWT token cookie name from env or use default
const JWT_COOKIE_NAME = process.env.NEXT_PUBLIC_JWT_TOKEN_COOKIE_NAME || 'serika_jwt';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthRoute = request.nextUrl.pathname === '/login';
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isRootRoute = request.nextUrl.pathname === '/';

  // If navigating to root, check auth status
  if (isRootRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If navigating to dashboard without token, redirect to login
  if (isDashboardRoute && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    url.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(url);
  }

  // If navigating to login with token, redirect to dashboard
  if (isAuthRoute && token) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login'],
}; 