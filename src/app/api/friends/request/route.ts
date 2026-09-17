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

    const { targetUserId } = await req.json();

    if (!targetUserId || typeof targetUserId !== 'string') {
      return NextResponse.json({ error: 'Target user ID is required.' }, { status: 400 });
    }

    if (targetUserId === user.id) {
      return NextResponse.json({ error: 'You cannot send a friend request to yourself.' }, { status: 400 });
    }

    // Ensure current user exists in database to satisfy foreign key constraints
    await db.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name || 'Learner',
        email: user.email || `user_${user.id}@langualearn.app`,
        passwordHash: 'jwt_managed_user',
        preferredLanguage: user.preferredLanguage || 'Malayalam',
        englishLevel: user.englishLevel || 'BEGINNER',
        onboardingCompleted: true,
      },
    });

    // Verify target user exists
    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found in system.' }, { status: 404 });
    }

    // Check if already friends in either direction
    const existingFriendship = await db.friendship.findFirst({
      where: {
        OR: [
          { userId: user.id, friendId: targetUserId },
          { userId: targetUserId, friendId: user.id },
        ],
      },
    });

    if (existingFriendship) {
      return NextResponse.json({
        error: `You are already friends with ${targetUser.name}.`,
        relationshipStatus: 'FRIENDS',
      }, { status: 400 });
    }

    // Check if target user has already sent a pending request to current user -> auto-accept
    const reciprocalRequest = await db.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: targetUserId,
          receiverId: user.id,
        },
      },
    });

    if (reciprocalRequest && reciprocalRequest.status === 'PENDING') {
      // Accept reciprocal request and establish friendship using safe upserts
      await db.$transaction([
        db.friendRequest.update({
          where: { id: reciprocalRequest.id },
          data: { status: 'ACCEPTED' },
        }),
        db.friendship.upsert({
          where: {
            userId_friendId: {
              userId: user.id,
              friendId: targetUserId,
            },
          },
          update: {},
          create: {
            userId: user.id,
            friendId: targetUserId,
          },
        }),
        db.friendship.upsert({
          where: {
            userId_friendId: {
              userId: targetUserId,
              friendId: user.id,
            },
          },
          update: {},
          create: {
            userId: targetUserId,
            friendId: user.id,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        relationshipStatus: 'FRIENDS',
        message: `You and ${targetUser.name} are now friends!`,
      });
    }

    // Check if outgoing request already exists
    const existingRequest = await db.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: user.id,
          receiverId: targetUserId,
        },
      },
    });

    if (existingRequest && existingRequest.status === 'PENDING') {
      return NextResponse.json({
        success: true,
        error: 'Friend request is already pending.',
        relationshipStatus: 'PENDING_SENT',
        requestId: existingRequest.id,
        message: `Friend request to ${targetUser.name} is already pending.`,
      });
    }

    // Create or re-open friend request
    let request;
    if (existingRequest) {
      request = await db.friendRequest.update({
        where: { id: existingRequest.id },
        data: { status: 'PENDING' },
      });
    } else {
      request = await db.friendRequest.create({
        data: {
          senderId: user.id,
          receiverId: targetUserId,
          status: 'PENDING',
        },
      });
    }

    return NextResponse.json({
      success: true,
      relationshipStatus: 'PENDING_SENT',
      requestId: request.id,
      message: `Friend request sent to ${targetUser.name}!`,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Failed to send friend request.';
    const errStack = error instanceof Error ? error.stack : undefined;
    console.error('[API] Send friend request error:', errMessage, errStack);
    return NextResponse.json({
      error: errMessage,
      details: process.env.NODE_ENV !== 'production' ? errMessage : undefined,
    }, { status: 500 });
  }
}
