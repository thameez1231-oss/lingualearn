import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ progress: [] });
    }

    const progress = await db.userProgress.findMany({
      where: { userId: user.id },
      select: {
        lessonId: true,
        status: true,
        score: true,
        completedAt: true,
      },
    });

    return NextResponse.json({ progress });
  } catch (error: unknown) {
    console.error('[API] Progress fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress.' }, { status: 500 });
  }
}
