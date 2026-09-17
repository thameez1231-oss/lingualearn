import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { getCurrentUser } from '@/lib/auth';
import { DevMailboxDrawer } from '@/components/email/DevMailboxDrawer';
import {
  Mic,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { InteractiveHeroDemo } from '@/components/home/InteractiveHeroDemo';

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <Navbar user={user ? { name: user.name, email: user.email } : null} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-violet-200/30 to-teal-200/30 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI-Powered English Learning for Absolute Beginners</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Learn English.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
              Speak with Confidence.
            </span>
          </h1>

          {/* Subtitles */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Understand English, practice speaking, and learn step by step — in a language you already understand.
          </p>

          <p className="mt-2 text-sm sm:text-base font-semibold text-indigo-600 max-w-xl mx-auto">
            “Speak in the language you know. Learn the English you need.”
          </p>

          {/* Dual CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-2xl shadow-lg shadow-indigo-200 transition-all"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/speak"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-slate-800 bg-white hover:bg-slate-50 active:scale-95 rounded-2xl border-2 border-slate-200 transition-all shadow-xs"
            >
              <Mic className="w-5 h-5 text-emerald-600" />
              <span>Practice Speaking</span>
            </Link>
          </div>

          {/* Interactive Live Translation Preview Card */}
          <InteractiveHeroDemo />
        </div>
      </section>

      {/* How LinguaLearn Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50/75 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold tracking-widest text-indigo-600 uppercase mb-3">
              How LinguaLearn Works
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Three Simple Steps to Fluency
            </h3>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              You never have to guess. LinguaLearn connects English concepts directly to your native language.
            </p>
          </div>

          {/* Three Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Speak */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Mic className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Feature 1
                </span>
                <h4 className="text-2xl font-bold text-slate-900">🎤 Speak</h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mt-3">
                Speak in your own language and instantly learn how to say it in natural English. Practice your pronunciation with real-time feedback.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
                <span>Instant Speech-to-Speech Translation →</span>
              </div>
            </div>

            {/* 2. Learn */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Feature 2
                </span>
                <h4 className="text-2xl font-bold text-slate-900">📚 Learn</h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mt-3">
                Learn vocabulary, grammar, sentences, and everyday English step by step with rich visual flashcards, matching games, and quizzes.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center text-xs font-bold text-indigo-600">
                <span>Visual 5-Module Curriculum →</span>
              </div>
            </div>

            {/* 3. Practice */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 border border-violet-200 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                  Feature 3
                </span>
                <h4 className="text-2xl font-bold text-slate-900">💬 Practice</h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mt-3">
                Practice conversations with your friendly AI English tutor. Receive gentle corrections when you make mistakes without feeling judged.
              </p>
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center text-xs font-bold text-violet-600">
                <span>Adaptive Level-1 Tutor Partner →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* English Learning Made Easier Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Designed For Beginners</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                English learning made easier.
              </h3>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Most platforms throw complete beginners into English-only immersion, causing frustration and abandonment. LinguaLearn takes a fundamentally better approach:
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Clear Explanations in Your Native Tongue</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Grammar rules, sentence structures, and meanings are explained in Malayalam, Hindi, Tamil, Spanish, and 10+ other languages.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Gentle AI Mistake Explanations</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      When you say &quot;I am go to school&quot;, we don&apos;t just say &quot;Wrong&quot;. We show you: &quot;I am going to school&quot; and explain why simply.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Audio at Normal and Slow Speeds</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Hear native English accents clearly with 1-click audio playback and phonetic pronunciations on every word.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                >
                  <span>Create Your Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Graphic Comparison */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase mb-2">
                  <span>❌ Traditional English Apps</span>
                </div>
                <p className="text-xs text-slate-600">
                  Complicated grammar rules explained entirely in advanced English. Users feel lost and give up in days.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500/80 shadow-md shadow-emerald-50">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase mb-2">
                  <span>✨ The LinguaLearn Advantage</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-400">YOU MAKE A MISTAKE:</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">&ldquo;I am go to school.&rdquo;</p>
                  </div>
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                    <p className="text-xs font-bold text-emerald-800">BETTER ENGLISH:</p>
                    <p className="text-base font-bold text-emerald-950 mt-0.5">&ldquo;I am going to school.&rdquo;</p>
                    <p className="text-xs text-emerald-700 mt-1 font-medium">
                      💡 Why? &ldquo;Going&rdquo; (-ing) is used after &ldquo;am&rdquo;.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center font-extrabold text-sm">
                L
              </div>
              <span className="font-extrabold text-lg tracking-tight">LinguaLearn</span>
              <span className="text-xs text-slate-400">| Learn English. Speak with Confidence.</span>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400">
              <Link href="/login" className="hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="hover:text-white transition-colors">
                Create Account
              </Link>
              <Link href="/speak" className="hover:text-white transition-colors">
                Speak & Translate
              </Link>
              <Link href="/dev/mailbox" className="hover:text-white text-indigo-400 font-semibold">
                Dev Mailbox
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} LinguaLearn Inc. All rights reserved. Commercial EdTech for English Beginners.
          </div>
        </div>
      </footer>

      {/* Dev Mailbox Drawer */}
      <DevMailboxDrawer />
    </div>
  );
}
