import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, ensureDatabaseSchema } from '@/lib/db';

export async function GET() {
  try {
    await ensureDatabaseSchema(db);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ count: 0, pendingRequests: 0, unreadMessages: 0 });
    }

    const [pendingRequests, unreadMessages] = await Promise.all([
      db.friendRequest.count({
        where: {
          receiverId: user.id,
          status: 'PENDING',
        },
      }).catch(() => 0),
      db.message.count({
        where: {
          receiverId: user.id,
          isRead: false,
        },
      }).catch(() => 0),
    ]);

    return NextResponse.json({
      count: pendingRequests + unreadMessages,
      pendingRequests,
      unreadMessages,
    });
  } catch {
    return NextResponse.json({ count: 0, pendingRequests: 0, unreadMessages: 0 });
  }
}
