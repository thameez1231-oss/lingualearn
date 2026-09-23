import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getUserProgressStats, isLessonUnlocked } from '@/lib/progress';
import { getLessonById } from '@/data/lessons';
import LessonRunnerClient from './LessonRunnerClient';

export default async function LessonRunnerPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const lesson = getLessonById(resolvedParams.lessonId);
  if (!lesson) {
    redirect('/learn');
  }

  // DIRECT URL SECURITY: Validate if the lesson is unlocked
  const stats = await getUserProgressStats(user.id);
  const completedIds = stats ? stats.completedLessonIds : [];
  
  if (!isLessonUnlocked(lesson.id, completedIds)) {
    // If the lesson is locked, redirect them back to the Learn page
    redirect('/learn?error=locked');
  }

  return (
    <LessonRunnerClient 
      lessonId={lesson.id} 
      initialUserLanguage={user.preferredLanguage || 'English'} 
    />
  );
}
