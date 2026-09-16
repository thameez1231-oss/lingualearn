import { NextResponse } from 'next/server';
import { destroyCurrentSession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  try {
    await destroyCurrentSession();
    const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (error: unknown) {
    console.error('[API] Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
