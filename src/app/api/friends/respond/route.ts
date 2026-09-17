import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, ensureDatabaseSchema } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await ensureDatabaseSchema(db);

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { requestId, senderId, senderName, senderEmail, action } = body;

    if ((!requestId && !senderId) || (action !== 'ACCEPT' && action !== 'DECLINE')) {
      return NextResponse.json(
        { error: 'Valid requestId or senderId, and action (ACCEPT or DECLINE) are required.' },
        { status: 400 }
      );
    }

    // Try finding by primary key ID first, or fallback to senderId/receiverId
    const targetSenderId = senderId || (requestId && requestId !== user.id ? requestId : undefined);

    const request = await db.friendRequest.findFirst({
      where: {
        OR: [
          ...(requestId ? [{ id: requestId }] : []),
          ...(targetSenderId ? [{ senderId: targetSenderId, receiverId: user.id }] : []),
        ],
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Security check: If request is found, ensure the current user is the designated recipient!
    if (request && request.receiverId !== user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to respond to this friend request.' },
        { status: 403 }
      );
    }

    // If request was already accepted, return idempotently
    if (request && request.status === 'ACCEPTED') {
      return NextResponse.json({
        success: true,
        action: 'ACCEPTED',
        message: `You are already friends with ${request.sender?.name || 'this user'}!`,
      });
    }

    const finalSenderId = request?.senderId || targetSenderId;
    const finalSenderName = request?.sender?.name || senderName || 'Learner';
    const finalSenderEmail = request?.sender?.email || senderEmail || `user_${finalSenderId}@langualearn.app`;

    if (!finalSenderId) {
      return NextResponse.json({ error: 'Friend request not found.' }, { status: 404 });
    }

    // Ensure both users exist in database before proceeding
    await db.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name || 'Learner',
        email: user.email || `user_${user.id}@langualearn.app`,
        passwordHash: 'jwt_managed_user',
        onboardingCompleted: true,
      },
    });

    await db.user.upsert({
      where: { id: finalSenderId },
      update: {},
      create: {
        id: finalSenderId,
        name: finalSenderName,
        email: finalSenderEmail,
        passwordHash: 'jwt_managed_user',
        onboardingCompleted: true,
      },
    });

    if (action === 'ACCEPT') {
      // 1. Update or create accepted friend request
      if (request) {
        await db.friendRequest.update({
          where: { id: request.id },
          data: { status: 'ACCEPTED' },
        });
      } else {
        await db.friendRequest.upsert({
          where: {
            senderId_receiverId: {
              senderId: finalSenderId,
              receiverId: user.id,
            },
          },
          update: { status: 'ACCEPTED' },
          create: {
            id: requestId || undefined,
            senderId: finalSenderId,
            receiverId: user.id,
            status: 'ACCEPTED',
          },
        });
      }

      // 2. Upsert bidirectional friendship records
      // Executed sequentially to prevent Prisma P2002 concurrency issues on PostgreSQL
      await db.friendship.upsert({
        where: {
          userId_friendId: {
            userId: user.id,
            friendId: finalSenderId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          friendId: finalSenderId,
        },
      });

      await db.friendship.upsert({
        where: {
          userId_friendId: {
            userId: finalSenderId,
            friendId: user.id,
          },
        },
        update: {},
        create: {
          userId: finalSenderId,
          friendId: user.id,
        },
      });

      // 3. Fetch sender user profile details to return immediately
      const senderUser = await db.user.findUnique({
        where: { id: finalSenderId },
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
      });

      // 4. Ensure canonical conversation record exists
      const [user1Id, user2Id] = [user.id, finalSenderId].sort();
      let conversation = await db.conversation.findUnique({
        where: {
          user1Id_user2Id: { user1Id, user2Id },
        },
      });

      if (!conversation) {
        conversation = await db.conversation.create({
          data: {
            user1Id,
            user2Id,
            lastMessageText: null,
            lastMessageAt: new Date(),
          },
        }).catch(() => null);
      }

      const now = Date.now();
      const isOnline = senderUser?.lastSeenAt
        ? now - new Date(senderUser.lastSeenAt).getTime() < 4 * 60 * 1000
        : false;

      const friendPayload = {
        id: finalSenderId,
        name: senderUser?.name || finalSenderName,
        email: senderUser?.email || finalSenderEmail,
        avatar: senderUser?.avatar || null,
        preferredLanguage: senderUser?.preferredLanguage || 'Malayalam',
        englishLevel: senderUser?.englishLevel || 'Beginner',
        streak: senderUser?.streak || 0,
        xp: senderUser?.xp || 0,
        isOnline,
        friendsSince: new Date(),
      };

      const conversationPayload = {
        id: conversation?.id || `conv-${user1Id}-${user2Id}`,
        friendId: finalSenderId,
        friendName: senderUser?.name || finalSenderName,
        friendEmail: senderUser?.email || finalSenderEmail,
        friendAvatar: senderUser?.avatar || null,
        friendLanguage: senderUser?.preferredLanguage || 'Malayalam',
        friendLevel: senderUser?.englishLevel || 'Beginner',
        isOnline,
        lastMessageText: conversation?.lastMessageText || 'No messages yet',
        lastMessageAt: conversation?.lastMessageAt || new Date().toISOString(),
        unreadCount: 0,
      };

      return NextResponse.json({
        success: true,
        action: 'ACCEPTED',
        friend: friendPayload,
        conversation: conversationPayload,
        message: `You are now friends with ${finalSenderName}!`,
      });
    } else {
      // DECLINE
      if (request) {
        await db.friendRequest.update({
          where: { id: request.id },
          data: { status: 'DECLINED' },
        });
      } else {
        await db.friendRequest.upsert({
          where: {
            senderId_receiverId: {
              senderId: finalSenderId,
              receiverId: user.id,
            },
          },
          update: { status: 'DECLINED' },
          create: {
            id: requestId || undefined,
            senderId: finalSenderId,
            receiverId: user.id,
            status: 'DECLINED',
          },
        });
      }

      return NextResponse.json({
        success: true,
        action: 'DECLINED',
        message: 'Friend request declined.',
      });
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to process response.';
    const errStack = error instanceof Error ? error.stack : undefined;
    console.error('[API] Respond to friend request error:', errMessage, errStack);
    return NextResponse.json({
      error: errMessage,
      details: process.env.NODE_ENV !== 'production' ? errMessage : undefined,
    }, { status: 500 });
  }
}
