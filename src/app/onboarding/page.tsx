'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SUPPORTED_LANGUAGES,
  ENGLISH_LEVELS,
} from '@/lib/languages';
import { ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLanguage, setSelectedLanguage] = useState('Malayalam');
  const [selectedLevel, setSelectedLevel] = useState('COMPLETE_BEGINNER');
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferredLanguage: selectedLanguage,
          englishLevel: selectedLevel,
        }),
      });

      if (res.ok) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {
          // Ignore
        }
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        alert('Failed to save preferences. Please try again.');
        setSaving(false);
      }
    } catch {
      alert('Network error. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Step Indicator */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step {step} of 2</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            {step === 1
              ? 'What language do you understand best?'
              : 'How much English do you know?'}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {step === 1
              ? 'LanguaLearn will explain English words and phrases in this language.'
              : 'We will personalize your starting lessons and AI tutor to match your speed.'}
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 shadow-lg dark:shadow-none shadow-slate-200/60 border border-slate-200 dark:border-slate-700/80">
          {step === 1 ? (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between relative group active:scale-95 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-200'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{lang.flag}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-50 leading-tight">
                          {lang.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          {lang.nativeName}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm dark:shadow-none shadow-indigo-100 active:scale-95 transition-all"
                >
                  <span>Next: Choose English Level</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-3.5">
                {ENGLISH_LEVELS.map((level) => {
                  const isSelected = selectedLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSelectedLevel(level.id)}
                      className={`w-full p-4.5 rounded-xl border-2 text-left transition-all flex items-start gap-4 active:scale-98 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-200'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="text-2xl mt-0.5">
                        {level.tag.slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-base text-slate-900 dark:text-slate-50">
                            {level.title}
                          </h3>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                          {level.description}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          Starter Topics: {level.starterLessons}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  ← Back to Language
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm dark:shadow-none shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Personalizing Dashboard...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Learning English</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
