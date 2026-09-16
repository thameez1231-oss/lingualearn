import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'lingua_session_token';
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'lingualearn_super_secure_default_secret_key_32_bytes_long_!'
);

const PROTECTED_ROUTES = [
  '/dashboard',
  '/learn',
  '/speak',
  '/tutor',
  '/pronounce',
  '/words',
  '/profile',
  '/onboarding',
];

const AUTH_ONLY_ROUTES = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);

  let isAuthenticated = false;
  if (sessionCookie?.value) {
    try {
      const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
      if (payload?.sessionToken && payload?.userId) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. If accessing protected routes while unauthenticated, redirect to login
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If visiting auth routes (login/signup)
  const isAuthRoute = AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute) {
    // If arriving with a redirect query param, or logout/clear signal,
    // clear any existing session cookie so the user is NEVER trapped in a redirect loop
    if (
      req.nextUrl.searchParams.has('redirect') ||
      req.nextUrl.searchParams.has('logout') ||
      req.nextUrl.searchParams.has('clear')
    ) {
      const response = NextResponse.next();
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // Otherwise, if already authenticated, take them straight to the dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/speak/:path*',
    '/tutor/:path*',
    '/pronounce/:path*',
    '/words/:path*',
    '/profile/:path*',
    '/onboarding/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ],
};
