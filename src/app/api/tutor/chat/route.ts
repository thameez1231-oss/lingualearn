import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { chatWithAITutor } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const { message, history, userLanguage, proficiencyLevel } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const preferredLanguage = user?.preferredLanguage || userLanguage || 'English';
    const englishLevel = user?.englishLevel || proficiencyLevel || 'COMPLETE_BEGINNER';

    const tutorResponse = await chatWithAITutor(message, preferredLanguage, englishLevel, history || []);

    // Reward active practice XP
    let awardedXp = 0;
    if (user) {
      try {
        awardedXp = 10;
        await db.user.update({
          where: { id: user.id },
          data: { xp: { increment: awardedXp } },
        });

        // Update daily goal
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
      } catch (dbErr) {
        console.warn('[API] Tutor practice XP persist notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      response: tutorResponse,
      awardedXp,
    });
  } catch (error: unknown) {
    console.error('[API] Tutor chat error:', error);
    return NextResponse.json({ error: 'Tutor service temporarily unavailable.' }, { status: 500 });
  }
}
