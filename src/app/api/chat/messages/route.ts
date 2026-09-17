import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, ensureDatabaseSchema } from '@/lib/db';
import { areUsersFriends } from '@/lib/friends';

function sanitizeMessage(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

export async function GET(req: Request) {
  try {
    await ensureDatabaseSchema(db);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get('friendId');

    if (!friendId) {
      return NextResponse.json({ error: 'friendId parameter is required.' }, { status: 400 });
    }

    // Security Check: Verify that caller and target user are accepted friends!
    const isFriend = await areUsersFriends(user.id, friendId);

    if (!isFriend) {
      return NextResponse.json(
        { error: 'You can only view messages with accepted friends.' },
        { status: 403 }
      );
    }

    const friendUser = await db.user.findUnique({
      where: { id: friendId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        preferredLanguage: true,
        englishLevel: true,
        lastSeenAt: true,
      },
    });

    if (!friendUser) {
      return NextResponse.json({ error: 'Friend user not found.' }, { status: 404 });
    }

    const [user1Id, user2Id] = [user.id, friendId].sort();

    // Find conversation
    const conversation = await db.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
    });

    if (!conversation) {
      const now = new Date().getTime();
      const isOnline = friendUser.lastSeenAt
        ? now - new Date(friendUser.lastSeenAt).getTime() < 4 * 60 * 1000
        : false;

      return NextResponse.json({
        messages: [],
        friend: {
          ...friendUser,
          isOnline,
        },
      });
    }

    // Automatically mark all received unread messages as read
    await db.message.updateMany({
      where: {
        conversationId: conversation.id,
        receiverId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    // Fetch messages in chronological order
    const messages = await db.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    const now = new Date().getTime();
    const isOnline = friendUser.lastSeenAt
      ? now - new Date(friendUser.lastSeenAt).getTime() < 4 * 60 * 1000
      : false;

    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        content: m.content,
        isRead: m.isRead,
        readAt: m.readAt,
        createdAt: m.createdAt,
        isMine: m.senderId === user.id,
      })),
      friend: {
        ...friendUser,
        isOnline,
      },
    });
  } catch (error) {
    console.error('[API] Get messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseSchema(db);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content, clientMessageId } = await req.json();

    if (!receiverId || typeof receiverId !== 'string') {
      return NextResponse.json({ error: 'receiverId is required.' }, { status: 400 });
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    // Ensure sender and receiver exist in DB to prevent foreign key errors
    await db.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name || 'Learner',
        email: user.email || `user_${user.id}@lingualearn.app`,
        passwordHash: 'jwt_managed_user',
        onboardingCompleted: true,
      },
    });

    await db.user.upsert({
      where: { id: receiverId },
      update: {},
      create: {
        id: receiverId,
        name: 'Friend',
        email: `user_${receiverId}@lingualearn.app`,
        passwordHash: 'jwt_managed_user',
        onboardingCompleted: true,
      },
    });

    const cleanContent = sanitizeMessage(content);
    if (!cleanContent) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    if (cleanContent.length > 2000) {
      return NextResponse.json({ error: 'Message cannot exceed 2000 characters.' }, { status: 400 });
    }

    // Security Check: Verify caller and receiver are accepted friends!
    console.log(`[Message API] Checking friendship for ${user.id} and ${receiverId}`);
    const isFriend = await areUsersFriends(user.id, receiverId);

    if (!isFriend) {
      console.log(`[Message API] Friendship authorization failed for ${user.id} and ${receiverId}`);
      return NextResponse.json(
        { error: 'You can only message accepted friends.' },
        { status: 403 }
      );
    }

    const [user1Id, user2Id] = [user.id, receiverId].sort();

    // Find or create conversation
    const conversation = await db.conversation.upsert({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
      update: {
        lastMessageAt: new Date(),
        lastMessageText: cleanContent.slice(0, 100),
      },
      create: {
        user1Id,
        user2Id,
        lastMessageAt: new Date(),
        lastMessageText: cleanContent.slice(0, 100),
      },
    });

    // Create message idempotently if clientMessageId is provided
    let message;
    if (clientMessageId) {
      // Upsert using the client ID to prevent duplicates on retry
      message = await db.message.upsert({
        where: { id: clientMessageId },
        update: {}, // Do nothing if it already exists
        create: {
          id: clientMessageId,
          conversationId: conversation.id,
          senderId: user.id,
          receiverId,
          content: cleanContent,
          isRead: false,
        },
      });
    } else {
      message = await db.message.create({
        data: {
          conversationId: conversation.id,
          senderId: user.id,
          receiverId,
          content: cleanContent,
          isRead: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        isRead: message.isRead,
        createdAt: message.createdAt,
        isMine: true,
      },
    });
  } catch (error) {
    console.error('[API] Send message error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
