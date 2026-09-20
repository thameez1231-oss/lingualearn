import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getUserProgressStats, isLessonUnlocked } from '@/lib/progress';
import { getLessonById } from '@/data/lessons';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lessonId: string }>;
}) {
  const resolvedParams = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const stats = await getUserProgressStats(user.id);
  const lesson = getLessonById(resolvedParams.lessonId);

  if (!lesson) {
    redirect('/learn');
  }

  const unlocked = isLessonUnlocked(lesson.id, stats.completedLessonIds);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Lesson Locked
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            You must complete the previous lessons in the curriculum before you can access "{lesson.title}".
          </p>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Return to Learning Path
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
