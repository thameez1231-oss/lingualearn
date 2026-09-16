import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch user stats
    const [completedLessonsCount, learnedWordsCount, speakingCount] = await Promise.all([
      db.userProgress.count({
        where: { userId: user.id, status: 'COMPLETED' },
      }),
      db.learnedWord.count({
        where: { userId: user.id },
      }),
      db.speakingHistory.count({
        where: { userId: user.id },
      }),
    ]);

    // Today's date YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    let dailyGoal = await db.dailyGoal.findUnique({
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

    return NextResponse.json({
      user: {
        ...user,
        stats: {
          completedLessonsCount,
          learnedWordsCount,
          speakingCount,
          dailyGoal,
        },
      },
    });
  } catch (error: unknown) {
    console.error('[API] Me endpoint error:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile.' }, { status: 500 });
  }
}
