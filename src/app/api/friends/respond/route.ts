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

    const { requestId, action } = await req.json();

    if (!requestId || (action !== 'ACCEPT' && action !== 'DECLINE')) {
      return NextResponse.json({ error: 'Valid requestId and action (ACCEPT or DECLINE) are required.' }, { status: 400 });
    }

    const request = await db.friendRequest.findUnique({
      where: { id: requestId },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
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
      // Ensure both users exist in database before creating friendship
      await Promise.all([
        db.user.upsert({
          where: { id: user.id },
          update: {},
          create: {
            id: user.id,
            name: user.name || 'Learner',
            email: user.email || `user_${user.id}@lingualearn.app`,
            passwordHash: 'jwt_managed_user',
            onboardingCompleted: true,
          },
        }).catch(() => {}),
        db.user.upsert({
          where: { id: request.senderId },
          update: {},
          create: {
            id: request.senderId,
            name: request.sender?.name || 'Learner',
            email: request.sender?.email || `user_${request.senderId}@lingualearn.app`,
            passwordHash: 'jwt_managed_user',
            onboardingCompleted: true,
          },
        }).catch(() => {}),
      ]);

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
