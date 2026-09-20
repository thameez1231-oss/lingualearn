import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'langua_session_token';
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'langualearn_super_secure_default_secret_key_32_bytes_long_!'
);

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/friends',
  '/learn',
  '/speak',
  '/words',
  '/tutor',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);

  let isAuthenticated = false;
  let isEmailVerified = false;
  if (sessionCookie?.value) {
    try {
      const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
      if (payload?.userId) {
        isAuthenticated = true;
        const userPayload = (payload.user as any) || {};
        isEmailVerified = userPayload.emailVerified !== false;

      }
    } catch {
      isAuthenticated = false;
    }
  }

  // If cookie exists but cannot be verified, purge the corrupt/stale cookie immediately
  if (sessionCookie?.value && !isAuthenticated) {
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  // If accessing protected routes while unauthenticated, redirect to login
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && isAuthenticated && !isEmailVerified) {
    const verifyUrl = new URL('/verify-email', req.url);
    if (pathname !== '/dashboard') {
      verifyUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(verifyUrl);
  }

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Explicit logout or cookie clear query
  if (req.nextUrl.searchParams.has('clear') || req.nextUrl.searchParams.has('logout')) {
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/friends/:path*',
    '/learn/:path*',
    '/speak/:path*',
    '/words/:path*',
    '/tutor/:path*',
    '/login',
    '/signup',
  ],
};

