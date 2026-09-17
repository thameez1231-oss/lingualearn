import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AppShell } from '@/components/layout/AppShell';
import { LESSONS_DATA } from '@/data/lessons';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';

export default async function LearnOverviewPage() {
  const user = await getCurrentUser();

  // Fetch completed lessons from DB
  const userProgress = user
    ? await db.userProgress
        .findMany({
          where: { userId: user.id, status: 'COMPLETED' },
        })
        .catch(() => [])
    : [];

  const completedMap = new Set(userProgress.map((p) => p.lessonId));

  // Group lessons by module
  const modules = [
    {
      id: 'basics',
      title: '🟢 English Basics',
      desc: 'Alphabet, Numbers 1-10, Colors, Days & Simple Everyday Words',
      lessons: LESSONS_DATA.filter((l) => l.moduleId === 'basics'),
    },
    {
      id: 'everyday',
      title: '🔵 Everyday English',
      desc: 'Greetings, Introducing Yourself, Ordering Food & Cafe English',
      lessons: LESSONS_DATA.filter((l) => l.moduleId === 'everyday'),
    },
    {
      id: 'speaking',
      title: '🟡 Speaking & Conversation',
      desc: 'Asking Questions (What, Where, Who), Common Answers & Small Talk',
      lessons: LESSONS_DATA.filter((l) => l.moduleId === 'speaking'),
    },
    {
      id: 'grammar',
      title: '🟣 Grammar Made Simple',
      desc: 'Am, Is, Are, Simple Sentences & Action Verbs without confusing rules',
      lessons: LESSONS_DATA.filter((l) => l.moduleId === 'grammar'),
    },
    {
      id: 'vocabulary',
      title: '🟠 Essential Vocabulary',
      desc: 'Top 100 Most Used English Words with Visual Flashcards',
      lessons: LESSONS_DATA.filter((l) => l.moduleId === 'vocabulary'),
    },
  ];

  return (
    <AppShell
      user={
        user || {
          id: 'guest',
          name: 'Learner',
          email: '',
          preferredLanguage: 'Malayalam',
        }
      }
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Track</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            English Lessons
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Step-by-step interactive lessons with native translations, audio, visual cards, and quizzes.
          </p>
        </div>

        {/* Modules List */}
        <div className="space-y-10">
          {modules.map((mod) => (
            <div key={mod.id} className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-xl font-extrabold text-slate-900">{mod.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{mod.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mod.lessons.map((lesson) => {
                  const isCompleted = completedMap.has(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between hover:shadow-md ${
                        isCompleted
                          ? 'border-emerald-200 shadow-xs'
                          : 'border-slate-200/80 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl">{lesson.icon}</span>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                              +{lesson.xpReward} XP
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 leading-snug">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {lesson.subtitle}
                        </p>

                        <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{lesson.estimatedMinutes} mins</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{lesson.vocabulary.length} words</span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <Link
                          href={`/learn/${lesson.id}`}
                          className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                            isCompleted
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100'
                          }`}
                        >
                          <span>{isCompleted ? 'Review Lesson' : 'Start Lesson'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
