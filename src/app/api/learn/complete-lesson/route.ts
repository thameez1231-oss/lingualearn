import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getLessonById, getNextLessonId } from '@/data/lessons';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { lessonId, score } = await req.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required.' }, { status: 400 });
    }

    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });
    }

    const numericScore = typeof score === 'number' ? score : 100;
    const earnedXp = lesson.xpReward || 50;

    // 1. Record lesson progress
    await db.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        status: 'COMPLETED',
        score: numericScore,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        status: 'COMPLETED',
        score: numericScore,
        completedAt: new Date(),
      },
    });

    // 2. Save learned words to database
    const preferredLang = user.preferredLanguage || 'English';
    for (const vocab of lesson.vocabulary) {
      const nativeTranslation = vocab.translations[preferredLang] || vocab.translations['English'] || '';
      await db.learnedWord.upsert({
        where: {
          userId_word: {
            userId: user.id,
            word: vocab.word,
          },
        },
        update: {
          mastered: true,
          nativeTranslation,
        },
        create: {
          userId: user.id,
          word: vocab.word,
          nativeTranslation,
          definition: vocab.exampleSentence,
          exampleSentence: vocab.exampleSentence,
          mastered: true,
        },
      });
    }

    // 3. Advance next lesson and award XP
    const nextLessonId = getNextLessonId(lessonId);
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: earnedXp },
        currentLessonId: nextLessonId,
      },
    });

    // 4. Update daily goal
    const today = new Date().toISOString().split('T')[0];
    await db.dailyGoal.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        lessonsCompleted: { increment: 1 },
        wordsLearned: { increment: lesson.vocabulary.length },
      },
      create: {
        userId: user.id,
        date: today,
        lessonsCompleted: 1,
        wordsLearned: lesson.vocabulary.length,
      },
    });

    // FORCE REVALIDATION OF DASHBOARD AND LEARN ROUTES
    revalidatePath('/dashboard');
    revalidatePath('/learn');
    revalidatePath('/profile');
    revalidatePath('/words');

    return NextResponse.json({
      success: true,
      earnedXp,
      nextLessonId,
      totalXp: updatedUser.xp,
    });
  } catch (error: unknown) {
    console.error('[API] Complete lesson error:', error);
    return NextResponse.json({ error: 'Failed to record lesson completion.' }, { status: 500 });
  }
}
