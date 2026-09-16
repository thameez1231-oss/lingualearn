import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
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
