import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { requestId, action } = await req.json();

    if (!requestId || (action !== 'ACCEPT' && action !== 'DECLINE')) {
      return NextResponse.json({ error: 'Valid requestId and action (ACCEPT or DECLINE) are required.' }, { status: 400 });
    }

    const request = await db.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: { id: true, name: true },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Friend request not found.' }, { status: 404 });
    }

    // Security Check: Only the designated receiver can accept or decline!
    if (request.receiverId !== user.id) {
      return NextResponse.json({ error: 'You are not authorized to respond to this friend request.' }, { status: 403 });
    }

    if (request.status !== 'PENDING') {
      return NextResponse.json({ error: `This request has already been ${request.status.toLowerCase()}.` }, { status: 400 });
    }

    if (action === 'ACCEPT') {
      // In transaction: update request to ACCEPTED, create bidirectional friendship rows
      await db.$transaction([
        db.friendRequest.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' },
        }),
        db.friendship.upsert({
          where: {
            userId_friendId: {
              userId: user.id,
              friendId: request.senderId,
            },
          },
          update: {},
          create: {
            userId: user.id,
            friendId: request.senderId,
          },
        }),
        db.friendship.upsert({
          where: {
            userId_friendId: {
              userId: request.senderId,
              friendId: user.id,
            },
          },
          update: {},
          create: {
            userId: request.senderId,
            friendId: user.id,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        action: 'ACCEPTED',
        message: `You are now friends with ${request.sender.name}!`,
      });
    } else {
      // Decline request
      await db.friendRequest.update({
        where: { id: requestId },
        data: { status: 'DECLINED' },
      });

      return NextResponse.json({
        success: true,
        action: 'DECLINED',
        message: 'Friend request declined.',
      });
    }
  } catch (error) {
    console.error('[API] Respond to friend request error:', error);
    return NextResponse.json({ error: 'Failed to process response.' }, { status: 500 });
  }
}
