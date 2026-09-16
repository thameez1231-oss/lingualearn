import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateSecureToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const emailNorm = email.trim().toLowerCase();
    const user = await db.user.findUnique({
      where: { email: emailNorm },
    });

    if (!user) {
      // Return success to avoid leaking email registration status
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.',
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'This email is already verified. You can log in directly.',
      });
    }

    // Delete existing tokens
    await db.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Create fresh token
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

    return NextResponse.json({
      success: true,
      message: 'A new verification link has been sent to your email.',
      previewUrl: emailResult.previewUrl,
    });
  } catch (error: unknown) {
    console.error('[API] Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email.' },
      { status: 500 }
    );
  }
}
