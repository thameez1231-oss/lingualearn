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

    // Pending requests received by current user
    const incoming = await db.friendRequest.findMany({
      where: {
        receiverId: user.id,
        status: 'PENDING',
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Pending requests sent by current user
    const outgoing = await db.friendRequest.findMany({
      where: {
        senderId: user.id,
        status: 'PENDING',
      },
      include: {
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      incoming: incoming.map((r) => ({
        id: r.id,
        sender: r.sender,
        createdAt: r.createdAt,
      })),
      outgoing: outgoing.map((r) => ({
        id: r.id,
        receiver: r.receiver,
        createdAt: r.createdAt,
      })),
      count: incoming.length,
    });
  } catch (error) {
    console.error('[API] Get friend requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch friend requests.' }, { status: 500 });
  }
}
