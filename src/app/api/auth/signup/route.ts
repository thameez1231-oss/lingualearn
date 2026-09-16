import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateSecureToken } from '@/lib/auth';
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
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user
    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: emailNorm,
        passwordHash,
        emailVerified: false,
      },
    });

    // Generate real verification token (expires in 24h)
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

    // Send real verification email
    const emailResult = await sendVerificationEmail(user.email, user.name, token);

    return NextResponse.json({
      success: true,
      message: 'Account created! Please check your email for the verification link.',
      email: user.email,
      previewUrl: emailResult.previewUrl,
    });
  } catch (error: unknown) {
    console.error('[API] Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
