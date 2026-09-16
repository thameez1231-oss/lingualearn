import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateSecureToken, createSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide full name, email, and password.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    const emailNorm = email.trim().toLowerCase();
    const existing = await db.user.findUnique({
      where: { email: emailNorm },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const hasSmtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

    // Create user: auto-verified if no external SMTP is configured (zero lockouts), or marked unverified if SMTP is ready
    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: emailNorm,
        passwordHash,
        emailVerified: !hasSmtp,
        emailVerifiedAt: !hasSmtp ? new Date() : null,
      },
    });

    // Attempt sending verification email in background (never blocks or crashes account creation)
    let previewUrl: string | null = null;
    try {
      const token = generateSecureToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await db.emailVerificationToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      const emailResult = await sendVerificationEmail(user.email, user.name, token);
      previewUrl = emailResult?.previewUrl || null;
    } catch (mailErr) {
      console.warn('[API] Background verification email dispatch notice:', mailErr);
    }

    // Immediately create session so user is logged in
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
      message: 'Account created successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        englishLevel: user.englishLevel,
        onboardingCompleted: user.onboardingCompleted,
        emailVerified: user.emailVerified,
      },
      previewUrl,
    });

    // Set authentication session cookie
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
    console.error('[API] Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
