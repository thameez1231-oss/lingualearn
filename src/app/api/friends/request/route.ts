import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
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

    // Verify target user exists
    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Check if already friends
    const existingFriendship = await db.friendship.findUnique({
      where: {
        userId_friendId: {
          userId: user.id,
          friendId: targetUserId,
        },
      },
    });

    if (existingFriendship) {
      return NextResponse.json({ error: 'You are already friends with this user.' }, { status: 400 });
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
      // Accept reciprocal request and establish friendship
      await db.$transaction([
        db.friendRequest.update({
          where: { id: reciprocalRequest.id },
          data: { status: 'ACCEPTED' },
        }),
        db.friendship.createMany({
          data: [
            { userId: user.id, friendId: targetUserId },
            { userId: targetUserId, friendId: user.id },
          ],
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
        error: 'Friend request is already pending.',
        relationshipStatus: 'PENDING_SENT',
        requestId: existingRequest.id,
      }, { status: 400 });
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
  } catch (error) {
    console.error('[API] Send friend request error:', error);
    return NextResponse.json({ error: 'Failed to send friend request.' }, { status: 500 });
  }
}
