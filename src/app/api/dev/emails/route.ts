import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const emails = await db.outboxEmail.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ emails });
  } catch (error: unknown) {
    console.error('[API] Dev emails error:', error);
    return NextResponse.json({ error: 'Failed to fetch emails.' }, { status: 500 });
  }
}
