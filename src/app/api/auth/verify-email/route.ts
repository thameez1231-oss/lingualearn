import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { createSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', req.url));
  }

  const record = await db.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) {
    return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
  }

  if (record.expiresAt < new Date()) {
    await db.emailVerificationToken.delete({ where: { id: record.id } });
    return NextResponse.redirect(new URL('/login?error=expired_token', req.url));
  }

  // Mark user verified in database
  await db.user.update({
    where: { id: record.userId },
    data: {
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });

  // Remove used token
  await db.emailVerificationToken.delete({ where: { id: record.id } });

  // Automatically create session and sign user in
  const jwt = await createSession(record.userId);

  // Redirect to verify success page (which celebrates and leads to onboarding)
  const redirectUrl = new URL('/verify-email?status=success', req.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: jwt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
    }

    const record = await db.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) {
      return NextResponse.json({ error: 'Invalid verification token.' }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      await db.emailVerificationToken.delete({ where: { id: record.id } });
      return NextResponse.json({ error: 'Verification token has expired.' }, { status: 400 });
    }

    await db.user.update({
      where: { id: record.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    await db.emailVerificationToken.delete({ where: { id: record.id } });

    const jwt = await createSession(record.userId);

    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully! 🎉',
      user: {
        id: record.user.id,
        name: record.user.name,
        email: record.user.email,
        onboardingCompleted: record.user.onboardingCompleted,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error('[API] Verify email error:', error);
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
