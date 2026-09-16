import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ friendId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { friendId } = await params;
    if (!friendId) {
      return NextResponse.json({ error: 'Friend ID is required.' }, { status: 400 });
    }

    // Delete friendship both ways
    await db.$transaction([
      db.friendship.deleteMany({
        where: {
          OR: [
            { userId: user.id, friendId },
            { userId: friendId, friendId: user.id },
          ],
        },
      }),
      db.friendRequest.deleteMany({
        where: {
          OR: [
            { senderId: user.id, receiverId: friendId },
            { senderId: friendId, receiverId: user.id },
          ],
        },
      }),
    ]);

    return NextResponse.json({ success: true, message: 'Friend removed.' });
  } catch (error) {
    console.error('[API] Remove friend error:', error);
    return NextResponse.json({ error: 'Failed to remove friend.' }, { status: 500 });
  }
}
