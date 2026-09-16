import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
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

    // Update user profile and award 50 welcome XP
    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        preferredLanguage,
        englishLevel,
        onboardingCompleted: true,
        xp: { increment: 50 },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        preferredLanguage: updated.preferredLanguage,
        englishLevel: updated.englishLevel,
        xp: updated.xp,
        onboardingCompleted: updated.onboardingCompleted,
      },
    });
  } catch (error: unknown) {
    console.error('[API] Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding.' }, { status: 500 });
  }
}
