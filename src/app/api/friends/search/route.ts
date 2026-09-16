import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim();

    if (!query || query.length < 1) {
      return NextResponse.json({ users: [] });
    }

    // Search users matching name or email, excluding current user
    const users = await db.user.findMany({
      where: {
        id: { not: user.id },
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
        ],
      },
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
      take: 25,
    });

    if (users.length === 0) {
      return NextResponse.json({ users: [] });
    }

    const targetUserIds = users.map((u) => u.id);

    // Fetch existing friendships
    const existingFriendships = await db.friendship.findMany({
      where: {
        userId: user.id,
        friendId: { in: targetUserIds },
      },
      select: { friendId: true },
    });
    const friendSet = new Set(existingFriendships.map((f) => f.friendId));

    // Fetch pending sent requests
    const sentRequests = await db.friendRequest.findMany({
      where: {
        senderId: user.id,
        receiverId: { in: targetUserIds },
        status: 'PENDING',
      },
      select: { receiverId: true, id: true },
    });
    const sentMap = new Map(sentRequests.map((r) => [r.receiverId, r.id]));

    // Fetch pending received requests
    const receivedRequests = await db.friendRequest.findMany({
      where: {
        senderId: { in: targetUserIds },
        receiverId: user.id,
        status: 'PENDING',
      },
      select: { senderId: true, id: true },
    });
    const receivedMap = new Map(receivedRequests.map((r) => [r.senderId, r.id]));

    const now = new Date().getTime();

    const formattedUsers = users.map((u) => {
      let relationshipStatus: 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'FRIENDS' = 'NONE';
      let requestId: string | undefined = undefined;

      if (friendSet.has(u.id)) {
        relationshipStatus = 'FRIENDS';
      } else if (sentMap.has(u.id)) {
        relationshipStatus = 'PENDING_SENT';
        requestId = sentMap.get(u.id);
      } else if (receivedMap.has(u.id)) {
        relationshipStatus = 'PENDING_RECEIVED';
        requestId = receivedMap.get(u.id);
      }

      const isOnline = u.lastSeenAt ? now - new Date(u.lastSeenAt).getTime() < 4 * 60 * 1000 : false;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        preferredLanguage: u.preferredLanguage,
        englishLevel: u.englishLevel,
        streak: u.streak,
        xp: u.xp,
        isOnline,
        relationshipStatus,
        requestId,
      };
    });

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('[API] Friends search error:', error);
    return NextResponse.json({ error: 'Failed to search users.' }, { status: 500 });
  }
}
