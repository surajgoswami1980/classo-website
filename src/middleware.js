import { NextResponse } from 'next/server';

const publicRoutes = ['/login', '/forgot-password', '/reset-password', '/api'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token in cookies or header
  // Note: actual auth check happens client-side via Redux hydration
  // This middleware is for SSR protection only
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
