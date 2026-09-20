import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getUserProgressStats } from '@/lib/progress';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const stats = await getUserProgressStats(user.id);

    const today = new Date().toISOString().split('T')[0];
    let dailyGoal = null;
    try {
      dailyGoal = await db.dailyGoal.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
      });

      if (!dailyGoal) {
        dailyGoal = await db.dailyGoal.create({
          data: {
            userId: user.id,
            date: today,
          },
        });
      }
    } catch {
      dailyGoal = {
        wordsLearned: 0,
        speakingMinutes: 0,
        lessonsCompleted: 0,
      };
    }

    return NextResponse.json({
      user: {
        ...user,
        xp: stats.xp,
        streak: stats.streak,
        stats: {
          completedLessonsCount: stats.completedLessonsCount,
          learnedWordsCount: stats.learnedWordsCount,
          speakingCount: stats.speakingCount,
          completedLessonIds: stats.completedLessonIds,
          dailyGoal,
        },
      },
    });
  } catch (error: unknown) {
    console.error('[API] Me endpoint error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile.' }, { status: 500 });
  }
}
