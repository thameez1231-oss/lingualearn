import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

function sanitizeMessage(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

export async function GET(req: Request) {
  try {
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
    const friendship = await db.friendship.findUnique({
      where: {
        userId_friendId: {
          userId: user.id,
          friendId,
        },
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            preferredLanguage: true,
            englishLevel: true,
            lastSeenAt: true,
          },
        },
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { error: 'You can only view messages with accepted friends.' },
        { status: 403 }
      );
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
      return NextResponse.json({
        messages: [],
        friend: friendship.friend,
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
    const isOnline = friendship.friend.lastSeenAt
      ? now - new Date(friendship.friend.lastSeenAt).getTime() < 4 * 60 * 1000
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
        ...friendship.friend,
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
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content } = await req.json();

    if (!receiverId || typeof receiverId !== 'string') {
      return NextResponse.json({ error: 'receiverId is required.' }, { status: 400 });
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const cleanContent = sanitizeMessage(content);
    if (!cleanContent) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    if (cleanContent.length > 2000) {
      return NextResponse.json({ error: 'Message cannot exceed 2000 characters.' }, { status: 400 });
    }

    // Security Check: Verify caller and receiver are accepted friends!
    const friendship = await db.friendship.findUnique({
      where: {
        userId_friendId: {
          userId: user.id,
          friendId: receiverId,
        },
      },
    });

    if (!friendship) {
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

    // Create message
    const message = await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        receiverId,
        content: cleanContent,
        isRead: false,
      },
    });

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
