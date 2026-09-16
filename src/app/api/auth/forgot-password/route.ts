import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateSecureToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

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

    if (user) {
      // Invalidate existing reset tokens
      await db.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      // Token expires in 1 hour
      const token = generateSecureToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await db.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      const emailResult = await sendPasswordResetEmail(user.email, user.name, token);

      return NextResponse.json({
        success: true,
        message: 'Password reset link sent to your email.',
        previewUrl: emailResult.previewUrl,
      });
    }

    // Always respond with success to prevent user enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error: unknown) {
    console.error('[API] Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request.' },
      { status: 500 }
    );
  }
}
