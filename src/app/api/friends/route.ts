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

    const [friendshipsAsUser, friendshipsAsFriend, acceptedRequests] = await Promise.all([
      db.friendship.findMany({
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
      }),
      db.friendship.findMany({
        where: { friendId: user.id },
        include: {
          user: {
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
      }),
      db.friendRequest.findMany({
        where: {
          status: 'ACCEPTED',
          OR: [
            { senderId: user.id },
            { receiverId: user.id },
          ],
        },
        include: {
          sender: {
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
          receiver: {
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
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    interface FriendSummary {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
      preferredLanguage: string;
      englishLevel: string;
      streak: number;
      xp: number;
      lastSeenAt: Date | null;
    }

    const friendsMap = new Map<string, { user: FriendSummary; friendsSince: Date }>();

    for (const f of friendshipsAsUser) {
      if (f.friend && f.friend.id !== user.id) {
        friendsMap.set(f.friend.id, { user: f.friend, friendsSince: f.createdAt });
      }
    }

    for (const f of friendshipsAsFriend) {
      if (f.user && f.user.id !== user.id && !friendsMap.has(f.user.id)) {
        friendsMap.set(f.user.id, { user: f.user, friendsSince: f.createdAt });
      }
    }

    for (const r of acceptedRequests) {
      const other = r.senderId === user.id ? r.receiver : r.sender;
      if (other && other.id !== user.id && !friendsMap.has(other.id)) {
        friendsMap.set(other.id, { user: other, friendsSince: r.updatedAt });
      }
    }

    const now = new Date().getTime();

    const friends = Array.from(friendsMap.values()).map(({ user: f, friendsSince }) => {
      const isOnline = f.lastSeenAt
        ? now - new Date(f.lastSeenAt).getTime() < 4 * 60 * 1000
        : false;

      return {
        id: f.id,
        name: f.name,
        email: f.email,
        avatar: f.avatar,
        preferredLanguage: f.preferredLanguage,
        englishLevel: f.englishLevel,
        streak: f.streak,
        xp: f.xp,
        isOnline,
        friendsSince,
      };
    });

    return NextResponse.json({ friends });
  } catch (error) {
    console.error('[API] Get friends error:', error);
    return NextResponse.json({ error: 'Failed to fetch friends.' }, { status: 500 });
  }
}
