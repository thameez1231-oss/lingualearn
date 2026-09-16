import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch all accepted friends first
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
    });

    const friendIds = friendships.map((f) => f.friend.id);
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
    const conversationMap = new Map<string, typeof conversations[0]>();

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
    const friendsWithoutConversation = friendships
      .filter((f) => !conversationMap.has(f.friend.id))
      .map((f) => {
        const isOnline = f.friend.lastSeenAt
          ? now - new Date(f.friend.lastSeenAt).getTime() < 4 * 60 * 1000
          : false;

        return {
          id: `new-${f.friend.id}`,
          friendId: f.friend.id,
          friendName: f.friend.name,
          friendEmail: f.friend.email,
          friendAvatar: f.friend.avatar,
          friendLanguage: f.friend.preferredLanguage,
          friendLevel: f.friend.englishLevel,
          isOnline,
          lastMessageText: 'Say hello!',
          lastMessageAt: f.createdAt,
          unreadCount: 0,
        };
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
