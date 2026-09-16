import { NextResponse } from 'next/server';
import { getCurrentUser, destroyCurrentSession, SESSION_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Delete user (cascades sessions, progress, tokens)
    await db.user.delete({
      where: { id: user.id },
    });

    await destroyCurrentSession();

    const res = NextResponse.json({
      success: true,
      message: 'Account deleted successfully.',
    });
    res.cookies.delete(SESSION_COOKIE_NAME);
    return res;
  } catch (error: unknown) {
    console.error('[API] Delete account error:', error);
    return NextResponse.json({ error: 'Failed to delete account.' }, { status: 500 });
  }
}
