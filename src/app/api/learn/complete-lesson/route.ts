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
    
    // CHECKPOINT VALIDATION LOGIC
    if (lesson.isCheckpoint) {
      if (numericScore < 80) {
        // Log the failure in DB but keep status as IN_PROGRESS or FAILED
        await db.userProgress.upsert({
          where: { userId_lessonId: { userId: user.id, lessonId } },
          update: { score: numericScore, updatedAt: new Date() },
          create: { userId: user.id, lessonId, status: 'IN_PROGRESS', score: numericScore }
        });
        
        return NextResponse.json({
          success: false,
          passed: false,
          score: numericScore,
          message: 'Checkpoint not passed. You need 80% to unlock the next lesson.',
          required: 80
        });
      }
    }

    // Check if already completed (to make XP idempotent)
    const existingProgress = await db.userProgress.findUnique({
      where: { userId_lessonId: { userId: user.id, lessonId } },
    });

    const isFirstTimeCompletion = !existingProgress || existingProgress.status !== 'COMPLETED';

    // 1. Record lesson progress (Status COMPLETED)
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

    // 2. Save learned words to database (only for non-checkpoints or if checkpoint has words)
    const preferredLang = user.preferredLanguage || 'English';
    if (lesson.vocabulary && lesson.vocabulary.length > 0) {
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
    }

    // 3. Advance next lesson and award XP
    const nextLessonId = getNextLessonId(lessonId);
    
    // Only increment XP if it is the first time completing this lesson/checkpoint
    const xpIncrement = isFirstTimeCompletion ? earnedXp : 0;
    
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        xp: { increment: xpIncrement },
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
      },
      create: {
        userId: user.id,
        date: today,
        lessonsCompleted: 1,
      },
    });

    // CRITICAL: Bust the Next.js Cache so Dashboard, Profile, and Learn pages show updated progress instantly
    revalidatePath('/dashboard');
    revalidatePath('/learn');
    revalidatePath('/profile');

    return NextResponse.json({
      success: true,
      passed: true,
      xpAwarded: xpIncrement,
      totalXp: updatedUser.xp,
      nextLessonId,
    });
  } catch (error) {
    console.error('[API] Complete lesson error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
