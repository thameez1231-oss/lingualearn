import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { name, preferredLanguage, englishLevel } = await req.json();

    const data: { name?: string; preferredLanguage?: string; englishLevel?: string } = {};
    if (name && typeof name === 'string' && name.trim()) data.name = name.trim();
    if (preferredLanguage && typeof preferredLanguage === 'string') data.preferredLanguage = preferredLanguage;
    if (englishLevel && typeof englishLevel === 'string') data.englishLevel = englishLevel;

    const updated = await db.user.update({
      where: { id: user.id },
      data,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        preferredLanguage: updated.preferredLanguage,
        englishLevel: updated.englishLevel,
      },
    });
  } catch (error: unknown) {
    console.error('[API] Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
