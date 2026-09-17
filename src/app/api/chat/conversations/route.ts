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

    // 1. Fetch all accepted friends bidirectionally
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

    const friendsMap = new Map<string, { user: FriendSummary; createdAt: Date }>();

    for (const f of friendshipsAsUser) {
      if (f.friend && f.friend.id !== user.id) {
        friendsMap.set(f.friend.id, { user: f.friend, createdAt: f.createdAt });
      }
    }

    for (const f of friendshipsAsFriend) {
      if (f.user && f.user.id !== user.id && !friendsMap.has(f.user.id)) {
        friendsMap.set(f.user.id, { user: f.user, createdAt: f.createdAt });
      }
    }

    for (const r of acceptedRequests) {
      const other = r.senderId === user.id ? r.receiver : r.sender;
      if (other && other.id !== user.id && !friendsMap.has(other.id)) {
        friendsMap.set(other.id, { user: other, createdAt: r.updatedAt });
      }
    }

    const friendIds = Array.from(friendsMap.keys());
    if (friendIds.length === 0) {
      return NextResponse.json({ conversations: [], totalUnread: 0 });
    }

    // 2. Fetch existing conversations involving the user and their friends
    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { user1Id: user.id, user2Id: { in: friendIds } },
          { user2Id: user.id, user1Id: { in: friendIds } },
        ],
      },
      include: {
        user1: {
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
        user2: {
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
        messages: {
          where: {
            receiverId: user.id,
            isRead: false,
          },
          select: { id: true },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    const now = new Date().getTime();
    const conversationMap = new Map<string, (typeof conversations)[0]>();

    let totalUnread = 0;

    const formattedExisting = conversations.map((c) => {
      const otherUser = c.user1Id === user.id ? c.user2 : c.user1;
      conversationMap.set(otherUser.id, c);

      const unreadCount = c.messages.length;
      totalUnread += unreadCount;

      const isOnline = otherUser.lastSeenAt
        ? now - new Date(otherUser.lastSeenAt).getTime() < 4 * 60 * 1000
        : false;

      return {
        id: c.id,
        friendId: otherUser.id,
        friendName: otherUser.name,
        friendEmail: otherUser.email,
        friendAvatar: otherUser.avatar,
        friendLanguage: otherUser.preferredLanguage,
        friendLevel: otherUser.englishLevel,
        isOnline,
        lastMessageText: c.lastMessageText || 'No messages yet',
        lastMessageAt: c.lastMessageAt,
        unreadCount,
      };
    });

    // 3. For any accepted friends without conversation records yet, synthesize entry so they can be clicked
    const friendsWithoutConversation: typeof formattedExisting = [];
    friendsMap.forEach(({ user: friendUser, createdAt }, friendId) => {
      if (!conversationMap.has(friendId)) {
        const isOnline = friendUser.lastSeenAt
          ? now - new Date(friendUser.lastSeenAt).getTime() < 4 * 60 * 1000
          : false;

        friendsWithoutConversation.push({
          id: `new-${friendId}`,
          friendId,
          friendName: friendUser.name,
          friendEmail: friendUser.email,
          friendAvatar: friendUser.avatar,
          friendLanguage: friendUser.preferredLanguage,
          friendLevel: friendUser.englishLevel,
          isOnline,
          lastMessageText: 'Say hello!',
          lastMessageAt: createdAt,
          unreadCount: 0,
        });
      }
    });

    const allConversations = [...formattedExisting, ...friendsWithoutConversation];

    return NextResponse.json({
      conversations: allConversations,
      totalUnread,
    });
  } catch (error) {
    console.error('[API] Get conversations error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations.' }, { status: 500 });
  }
}
