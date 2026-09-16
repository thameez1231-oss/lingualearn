import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, ensureDatabaseSchema } from '@/lib/db';

export async function GET() {
  try {
    await ensureDatabaseSchema(db);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const friendships = await db.friendship.findMany({
      where: { userId: user.id },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            preferredLanguage: true,
            englishLevel: true,
            streak: true,
            xp: true,
            lastSeenAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date().getTime();

    const friends = friendships.map((f) => {
      const isOnline = f.friend.lastSeenAt
        ? now - new Date(f.friend.lastSeenAt).getTime() < 4 * 60 * 1000
        : false;

      return {
        id: f.friend.id,
        name: f.friend.name,
        email: f.friend.email,
        avatar: f.friend.avatar,
        preferredLanguage: f.friend.preferredLanguage,
        englishLevel: f.friend.englishLevel,
        streak: f.friend.streak,
        xp: f.friend.xp,
        isOnline,
        friendsSince: f.createdAt,
      };
    });

    return NextResponse.json({ friends });
  } catch (error) {
    console.error('[API] Get friends error:', error);
    return NextResponse.json({ error: 'Failed to fetch friends.' }, { status: 500 });
  }
}
