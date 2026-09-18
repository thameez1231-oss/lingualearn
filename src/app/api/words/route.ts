import { NextResponse, NextRequest } from 'next/server';
import { searchDictionary } from '@/data/dictionary';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const user = await getCurrentUser();
    const lang = user?.preferredLanguage || 'English';

    const words = searchDictionary(query);

    // Fetch user saved words if logged in
    let savedWordList: string[] = [];
    if (user) {
      try {
        const userWords = await db.learnedWord.findMany({
          where: { userId: user.id },
          select: { word: true },
        });
        savedWordList = userWords.map((w) => w.word.toLowerCase());
      } catch (err) {
        console.warn('[API] Fetch saved words DB warning:', err);
      }
    }

    return NextResponse.json({
      words,
      savedWords: savedWordList,
      language: lang,
    });
  } catch (error: unknown) {
    console.error('[API] Dictionary search error:', error);
    return NextResponse.json({ error: 'Search failed.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { word, nativeTranslation, definition } = await req.json();

    if (!word) {
      return NextResponse.json({ error: 'Word is required.' }, { status: 400 });
    }

    let saved = true;
    try {
      const existing = await db.learnedWord.findUnique({
        where: {
          userId_word: {
            userId: user.id,
            word,
          },
        },
      });

      if (existing) {
        await db.learnedWord.delete({
          where: { id: existing.id },
        });
        saved = false;
      } else {
        await db.learnedWord.create({
          data: {
            userId: user.id,
            word,
            nativeTranslation: nativeTranslation || '',
            definition: definition || '',
            mastered: true,
          },
        });

        await db.user.update({
          where: { id: user.id },
          data: { xp: { increment: 5 } },
        }).catch(() => {});
        saved = true;
      }
    } catch (dbErr) {
      console.warn('[API] Word toggle DB warning:', dbErr);
    }

    return NextResponse.json({ saved });
  } catch (error: unknown) {
    console.error('[API] Word bookmark error:', error);
    return NextResponse.json({ error: 'Failed to bookmark word.' }, { status: 500 });
  }
}
