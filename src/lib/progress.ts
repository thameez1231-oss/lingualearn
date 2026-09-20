import { db } from './db';

export interface UserProgressStats {
  xp: number;
  streak: number;
  completedLessonsCount: number;
  learnedWordsCount: number;
  speakingCount: number;
  completedLessonIds: string[];
  level: string; // e.g., 'BEGINNER', 'INTERMEDIATE'
}

export async function getUserProgressStats(userId: string): Promise<UserProgressStats> {
  const [user, progress, words, speaking] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { xp: true, streak: true, englishLevel: true },
    }).catch(() => null),
    
    db.userProgress.findMany({
      where: { userId, status: 'COMPLETED' },
      select: { lessonId: true },
    }).catch(() => []),

    db.learnedWord.count({
      where: { userId, mastered: true },
    }).catch(() => 0),

    db.speakingHistory.count({
      where: { userId },
    }).catch(() => 0),
  ]);

  return {
    xp: user?.xp || 0,
    streak: user?.streak || 1,
    level: user?.englishLevel || 'COMPLETE_BEGINNER',
    completedLessonsCount: progress.length,
    completedLessonIds: progress.map((p) => p.lessonId),
    learnedWordsCount: words,
    speakingCount: speaking,
  };
}

export function calculateProgressPercentage(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.min(100, Math.round((completedCount / totalCount) * 100));
}
