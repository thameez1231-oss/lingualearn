import { NextResponse } from 'next/server';
import { getCurrentUser, createSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { preferredLanguage, englishLevel } = await req.json();

    if (!preferredLanguage || !englishLevel) {
      return NextResponse.json(
        { error: 'Please select both your preferred language and your English level.' },
        { status: 400 }
      );
    }

    // Update user profile in DB (with fallback handling)
    let updatedUserData = {
      ...user,
      preferredLanguage,
      englishLevel,
      onboardingCompleted: true,
      xp: (user.xp || 0) + 50,
    };

    try {
      const updated = await db.user.update({
        where: { id: user.id },
        data: {
          preferredLanguage,
          englishLevel,
          onboardingCompleted: true,
          xp: { increment: 50 },
        },
      });
      if (updated) {
        updatedUserData = {
          ...updatedUserData,
          id: updated.id,
          name: updated.name,
          preferredLanguage: updated.preferredLanguage,
          englishLevel: updated.englishLevel,
          xp: updated.xp,
          onboardingCompleted: updated.onboardingCompleted,
        };
      }
    } catch (err) {
      console.warn('[API] DB update notice during onboarding:', err);
    }

    // Re-issue session token so the JWT claims reflect onboardingCompleted = true
    const jwt = await createSession(user.id);

    const response = NextResponse.json({
      success: true,
      user: updatedUserData,
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
    console.error('[API] Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding.' }, { status: 500 });
  }
}
