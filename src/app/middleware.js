import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookie } from './lib/auth';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/signup'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = getTokenFromCookie();

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current route is auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Redirect to dashboard if user is logged in and tries to access auth routes
  if (isAuthRoute && token) {
    try {
      await verifyToken(token);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Token is invalid, proceed to auth route
    }
  }

  // Redirect to login if user is not logged in and tries to access protected route
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await verifyToken(token);
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('next-auth-token');
      return response;
    }
  }

  return NextResponse.next();
}