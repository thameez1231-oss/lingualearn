import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { translateNativeToEnglish } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const { text, language, score, context } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
    }

    const preferredLanguage = language || user?.preferredLanguage || 'Malayalam';
    const translation = await translateNativeToEnglish(text, preferredLanguage, context);

    // If user is authenticated, log speaking practice and update XP & DailyGoal
    let awardedXp = 0;
    if (user) {
      await db.speakingHistory.create({
        data: {
          userId: user.id,
          nativeText: text,
          detectedLanguage: translation.detectedLanguage,
          englishTranslation: translation.englishText,
          pronunciationScore: typeof score === 'number' ? score : null,
        },
      });

      awardedXp = 15;
      await db.user.update({
        where: { id: user.id },
        data: { xp: { increment: awardedXp } },
      });

      // Update today's daily goal
      const today = new Date().toISOString().split('T')[0];
      await db.dailyGoal.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
        update: {
          speakingMinutes: { increment: 1 },
        },
        create: {
          userId: user.id,
          date: today,
          speakingMinutes: 1,
        },
      });
    }

    return NextResponse.json({
      success: true,
      result: translation,
      awardedXp,
    });
  } catch (error: unknown) {
    console.error('[API] Translate error:', error);
    return NextResponse.json({ error: 'We couldn’t translate that right now. Please try again.' }, { status: 500 });
  }
}
