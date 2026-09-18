import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { User } from '@prisma/client';
import { verifyPassword, createSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both email and password.' },
        { status: 400 }
      );
    }

    const emailNorm = email.trim().toLowerCase();
    let user = await db.user.findUnique({
      where: { email: emailNorm },
    }).catch(() => null);

    // Auto-provision demo account if not found in this replica
    if (!user && emailNorm === 'demo@langualearn.com' && password === 'Password123!') {
      const { hashPassword } = await import('@/lib/auth');
      const passwordHash = await hashPassword('Password123!');
      try {
        user = await db.user.upsert({
          where: { email: 'demo@langualearn.com' },
          update: {},
          create: {
            name: 'Alex Kumar',
            email: 'demo@langualearn.com',
            passwordHash,
            emailVerified: true,
            emailVerifiedAt: new Date(),
            preferredLanguage: 'English',
            englishLevel: 'BEGINNER',
            onboardingCompleted: true,
            xp: 420,
            streak: 7,
            currentLessonId: 'everyday-intro',
          },
        });
      } catch {
        user = {
          id: 'demo-user-alex',
          name: 'Alex Kumar',
          email: 'demo@langualearn.com',
          passwordHash,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          preferredLanguage: 'English',
          englishLevel: 'BEGINNER',
          onboardingCompleted: true,
          xp: 420,
          streak: 7,
          currentLessonId: 'everyday-intro',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown as User;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please check your email or create an account.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again or click "Forgot Password".' },
        { status: 401 }
      );
    }

    // Create session embedding user claims
    const jwt = await createSession(user.id, {
      id: user.id,
      name: user.name,
      email: user.email,
      preferredLanguage: user.preferredLanguage,
      englishLevel: user.englishLevel,
      onboardingCompleted: user.onboardingCompleted,
      xp: user.xp,
      streak: user.streak,
      currentLessonId: user.currentLessonId,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        englishLevel: user.englishLevel,
        onboardingCompleted: user.onboardingCompleted,
      },
    });

    // Set secure cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: unknown) {
    console.error('[API] Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
