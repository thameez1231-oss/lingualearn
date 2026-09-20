import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';
import { LESSONS_DATA } from '@/data/lessons';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { getUserProgressStats, getHighestUnlockedOrder } from '@/lib/progress';

export const dynamic = 'force-dynamic';

export default async function LearnOverviewPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  const stats = await getUserProgressStats(user.id);
  const completedMap = new Set(stats?.completedLessonIds || []);
  const highestUnlockedOrder = stats ? getHighestUnlockedOrder(stats.completedLessonIds) : 1;

  const moduleDefinitions = [
    { id: 'beginner', title: 'Beginner', badge: '🌟', desc: 'Practical everyday English.' },
    { id: 'elementary', title: 'Elementary', badge: '🚶', desc: 'Longer sentences and common situations.' },
    { id: 'intermediate', title: 'Intermediate', badge: '💬', desc: 'Natural conversations and communication.' },
    { id: 'upper_intermediate', title: 'Upper-Intermediate', badge: '⚖️', desc: 'Nuanced vocabulary and problem solving.' },
    { id: 'advanced', title: 'Advanced', badge: '🎓', desc: 'Sophisticated communication and idioms.' },
    { id: 'professional', title: 'Professional', badge: '🏢', desc: 'Business meetings and leadership.' },
  ];

  const allModules = moduleDefinitions.map(def => ({
    ...def,
    lessons: LESSONS_DATA.filter((l) => l.moduleId === def.id).sort((a, b) => a.order - b.order)
  }));

  return (
    <AppShell user={user}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            Learning Path
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Complete lessons in order to unlock advanced content.
          </p>
        </div>

        <div className="space-y-12">
          {allModules.map((mod, index) => {
            if (mod.lessons.length === 0) return null;
            
            // Check if entire module is locked
            const isModuleLocked = mod.lessons[0].order > highestUnlockedOrder;
            const isModuleCompleted = mod.lessons.every(l => completedMap.has(l.id));

            return (
              <div
                key={mod.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border ${
                  isModuleLocked ? 'border-slate-200 dark:border-slate-700 opacity-75' : 'border-indigo-100 dark:border-indigo-900/50'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{mod.badge}</span>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {mod.title}
                      </h2>
                      {isModuleCompleted && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                      {mod.desc}
                    </p>
                  </div>
                  {isModuleLocked && (
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-3">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mod.lessons.map((lesson) => {
                    const isCompleted = completedMap.has(lesson.id);
                    const isUnlocked = lesson.order <= highestUnlockedOrder;
                    const isCurrent = isUnlocked && !isCompleted && lesson.order === highestUnlockedOrder;

                    return (
                      <div
                        key={lesson.id}
                        className={`group rounded-xl p-5 border transition-all duration-200 ${
                          isCompleted
                            ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                            : isCurrent
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 ring-2 ring-indigo-500/20'
                            : isUnlocked
                            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-3xl bg-white dark:bg-slate-800 shadow-sm rounded-lg w-12 h-12 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                            {lesson.icon}
                          </div>
                          {isCompleted ? (
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              DONE
                            </div>
                          ) : isCurrent ? (
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold">
                              <Sparkles className="w-3.5 h-3.5" />
                              {lesson.isCheckpoint ? 'CHECKPOINT' : 'CURRENT'}
                            </div>
                          ) : isUnlocked ? (
                            <div className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold">
                              READY
                            </div>
                          ) : (
                            <div className="bg-slate-100 dark:bg-slate-700 text-slate-500 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold">
                              <Lock className="w-3 h-3" />
                              LOCKED
                            </div>
                          )}
                        </div>

                        <h3 className={`font-bold text-lg mb-1 ${isCurrent ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'}`}>
                          {lesson.isCheckpoint ? lesson.title : `Lesson ${lesson.order}: ${lesson.title}`}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                          {lesson.subtitle}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-5">
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            {lesson.xpReward} XP
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {lesson.estimatedMinutes} min
                          </div>
                        </div>

                        {isUnlocked ? (
                          <Link
                            href={`/learn/${lesson.id}`}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                              isCurrent
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white'
                            }`}
                          >
                            {isCompleted ? 'Review' : isCurrent ? (lesson.isCheckpoint ? 'Start Checkpoint' : 'Start Lesson') : (lesson.isCheckpoint ? 'Start Checkpoint' : 'Start Lesson')}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed">
                            <Lock className="w-4 h-4" />
                            Complete Lesson {lesson.order - 1} to unlock
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
