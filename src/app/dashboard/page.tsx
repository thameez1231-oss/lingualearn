import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AppShell } from '@/components/layout/AppShell';
import { LESSONS_DATA, getLessonById } from '@/data/lessons';
import {
  ArrowRight,
  Mic,
  Flame,
  Target,
  Users,
  Sparkles,
  Award,
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Redirect to onboarding if not done
  if (!user.onboardingCompleted) {
    redirect('/onboarding');
  }

  // Fetch user stats with resilient serverless fallbacks
  const [completedLessons, learnedWordsCount, speakingCount] = await Promise.all([
    db.userProgress
      .findMany({
        where: { userId: user.id, status: 'COMPLETED' },
      })
      .catch(() => []),
    db.learnedWord
      .count({
        where: { userId: user.id },
      })
      .catch(() => 0),
    db.speakingHistory
      .count({
        where: { userId: user.id },
      })
      .catch(() => 0),
  ]);

  // Today's daily goal with serverless fallback
  const today = new Date().toISOString().split('T')[0];
  let dailyGoal: { wordsLearned: number; speakingMinutes: number; lessonsCompleted: number; isCompleted?: boolean } | null = null;
  try {
    dailyGoal = await db.dailyGoal.findUnique({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
    });

    if (!dailyGoal) {
      dailyGoal = await db.dailyGoal.create({
        data: {
          userId: user.id,
          date: today,
        },
      });
    }
  } catch {
    dailyGoal = {
      wordsLearned: 0,
      speakingMinutes: 0,
      lessonsCompleted: 0,
      isCompleted: false,
    };
  }

  // Current lesson
  const currentLesson = getLessonById(user.currentLessonId || 'basics-1') || LESSONS_DATA[0];

  // Calculate overall progress percentage
  const completedCount = completedLessons.length;
  const progressPercent = Math.min(
    100,
    Math.round(((completedCount * 1.5 + learnedWordsCount * 0.5 + speakingCount * 0.5) / 20) * 100) || 15
  );

  // Time of day greeting
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Level display name
  const levelTitle =
    user.englishLevel === 'COMPLETE_BEGINNER'
      ? 'Level 1 — Starter Explorer'
      : user.englishLevel === 'BEGINNER'
      ? 'Level 2 — Beginner'
      : user.englishLevel === 'INTERMEDIATE'
      ? 'Level 3 — Everyday Speaker'
      : 'Level 4 — Fluent Communicator';

  return (
    <AppShell user={user}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Top Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {greetingTime}, {user.name}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Ready to improve your English through <strong className="text-indigo-600 font-semibold">{user.preferredLanguage}</strong>?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200/80 rounded-xl">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
              <div>
                <span className="text-xs font-bold text-amber-900 block leading-none">
                  {user.streak} Day Streak
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Keep it going!</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-50 border border-indigo-200/80 rounded-xl">
              <Award className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-indigo-900 block leading-none">
                  {user.xp} XP
                </span>
                <span className="text-[10px] text-indigo-700 font-medium">Total earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Primary Hero Progress & Continue Card */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-xl p-6 sm:p-8 shadow-lg dark:shadow-none shadow-indigo-950/10 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white dark:bg-slate-900/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900/15 text-indigo-200 text-xs font-semibold backdrop-blur-sm">
                <span>{levelTitle}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Your English Progress
              </h2>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold text-indigo-200">
                  <span>Overall Mastery</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-indigo-950/60 rounded-full h-3 p-0.5 border border-white/10">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-300 h-2 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Today's Stats snippet */}
              <p className="text-xs text-indigo-200 font-medium pt-1">
                Today: {dailyGoal.wordsLearned} words • {dailyGoal.lessonsCompleted} lesson • {dailyGoal.speakingMinutes} min speaking
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0">
              <Link
                href={`/learn/${currentLesson.id}`}
                className="inline-flex items-center justify-center gap-3 px-7 py-4 text-base font-extrabold text-indigo-900 bg-white dark:bg-slate-900 hover:bg-indigo-50 active:scale-95 rounded-xl shadow-sm dark:shadow-none transition-all"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-5 h-5 text-indigo-600" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Two Clear Split Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Practice: Speak & Translate */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Live Voice
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Speak & Translate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Say something in {user.preferredLanguage}. Instantly hear and see how to speak it in natural English.
              </p>

              <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 italic">
                &ldquo;Say: എനിക്ക് വിശക്കുന്നു or your own words...&rdquo;
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/speak"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-98 transition-all"
              >
                <Mic className="w-4 h-4" />
                <span>Start Speaking →</span>
              </Link>
            </div>
          </div>

          {/* Current Recommended Lesson Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center group-hover:scale-105 transition-transform text-2xl">
                  {currentLesson.icon}
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {currentLesson.moduleBadge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                {currentLesson.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                {currentLesson.subtitle}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>⏱️ {currentLesson.estimatedMinutes} mins</span>
                <span>⭐ +{currentLesson.xpReward} XP</span>
                <span>📖 {currentLesson.vocabulary.length} words</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                href={`/learn/${currentLesson.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 active:scale-98 transition-all"
              >
                <span>Continue Lesson →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Practice with Friends Banner */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-xl p-6 sm:p-7 text-white shadow-sm dark:shadow-none relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900/20 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>New Feature</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Learn & Chat with Friends
              </h3>
              <p className="text-xs text-indigo-100 max-w-md mt-0.5">
                Connect with fellow learners, send friend requests, practice English together, and chat in real time.
              </p>
            </div>
          </div>
          <Link
            href="/friends"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 text-indigo-900 font-bold text-sm shadow-sm dark:shadow-none hover:bg-indigo-50 active:scale-95 transition-all relative z-10"
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Open Friends & Chat →</span>
          </Link>
        </div>

        {/* 3. Daily Goals & Quick Stats Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-50">Today&apos;s Learning Goal</h3>
            </div>
            {dailyGoal.isCompleted ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                🎉 Daily Goal Complete!
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Keep practicing!</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <span>🎯 Learn 5 Words</span>
                <span className="font-bold text-slate-900 dark:text-slate-50">{dailyGoal.wordsLearned}/5</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (dailyGoal.wordsLearned / 5) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <span>🎯 Complete 1 Lesson</span>
                <span className="font-bold text-slate-900 dark:text-slate-50">{dailyGoal.lessonsCompleted}/1</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (dailyGoal.lessonsCompleted / 1) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <span>🎯 Speak for 5 Minutes</span>
                <span className="font-bold text-slate-900 dark:text-slate-50">{dailyGoal.speakingMinutes}/5 min</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (dailyGoal.speakingMinutes / 5) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
