'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { getLessonById } from '@/data/lessons';
import { AudioButton } from '@/components/ui/AudioButton';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Home,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default function LessonRunnerPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const lesson = getLessonById(resolvedParams.lessonId);

  const [userLanguage, setUserLanguage] = useState('Malayalam');
  const [currentStage, setCurrentStage] = useState<'vocab' | 'exercises' | 'completed'>('vocab');
  const [vocabIndex, setVocabIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);

  // Exercise states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [matchingSelectedLeft, setMatchingSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [sentenceTokens, setSentenceTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>(() =>
    lesson?.exercises[0]?.type === 'sentence_builder' && lesson.exercises[0].scrambledWords
      ? [...lesson.exercises[0].scrambledWords]
      : []
  );
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(100);

  // Load user language preference
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.preferredLanguage) {
          setUserLanguage(data.user.preferredLanguage);
        }
      })
      .catch(() => {});
  }, []);

  const resetExerciseState = (nextIndex: number) => {
    const nextExercise = lesson?.exercises[nextIndex];
    if (nextExercise?.type === 'sentence_builder' && nextExercise.scrambledWords) {
      setAvailableTokens([...nextExercise.scrambledWords]);
    } else {
      setAvailableTokens([]);
    }
    setSentenceTokens([]);
    setSelectedOption(null);
    setMatchingSelectedLeft(null);
    setMatchedPairs([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
  };

  const currentExercise = lesson?.exercises[exerciseIndex];

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Lesson not found</h1>
          <Link href="/learn" className="mt-4 inline-block text-indigo-600 font-bold">
            ← Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  const currentVocab = lesson.vocabulary[vocabIndex];

  // Multiple Choice check
  const handleCheckMultipleChoice = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
    const correct = currentExercise?.options?.[index]?.isCorrect ?? false;
    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      playSuccessSound();
    } else {
      setScore((s) => Math.max(50, s - 10));
    }
  };

  // Matching click
  const handleMatchClick = (side: 'left' | 'right', text: string) => {
    if (side === 'left') {
      setMatchingSelectedLeft(text);
    } else if (side === 'right' && matchingSelectedLeft) {
      const isPair = currentExercise?.pairs?.some(
        (p) => p.left === matchingSelectedLeft && p.right === text
      );
      if (isPair) {
        setMatchedPairs((prev) => [...prev, matchingSelectedLeft, text]);
        setMatchingSelectedLeft(null);
        playSuccessSound();

        // Check if all matched
        if (matchedPairs.length + 2 === (currentExercise?.pairs?.length || 0) * 2) {
          setIsAnswerChecked(true);
          setIsCorrect(true);
        }
      } else {
        setMatchingSelectedLeft(null);
      }
    }
  };

  // Sentence Builder click
  const handleAddToken = (token: string, idx: number) => {
    if (isAnswerChecked) return;
    setSentenceTokens((prev) => [...prev, token]);
    setAvailableTokens((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveToken = (token: string, idx: number) => {
    if (isAnswerChecked) return;
    setSentenceTokens((prev) => prev.filter((_, i) => i !== idx));
    setAvailableTokens((prev) => [...prev, token]);
  };

  const handleCheckSentenceBuilder = () => {
    const assembled = sentenceTokens.join(' ').trim();
    const target = currentExercise?.correctSentence?.trim() || '';
    const correct = assembled.toLowerCase() === target.toLowerCase();
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    if (correct) {
      playSuccessSound();
    } else {
      setScore((s) => Math.max(50, s - 10));
    }
  };

  const playSuccessSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  const handleNextExercise = async () => {
    if (exerciseIndex < lesson.exercises.length - 1) {
      const nextIndex = exerciseIndex + 1;
      resetExerciseState(nextIndex);
      setExerciseIndex(nextIndex);
    } else {
      // Completed all exercises! Record in database
      try {
        await fetch('/api/learn/complete-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId: lesson.id,
            score,
          }),
        });
      } catch (err) {
        console.error('Save progress error:', err);
      }

      setCurrentStage('completed');
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Bar */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between pb-4">
        <Link
          href="/learn"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Progress Bar */}
        <div className="flex-1 mx-4">
          <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300"
              style={{
                width:
                  currentStage === 'vocab'
                    ? `${((vocabIndex + 1) / (lesson.vocabulary.length + lesson.exercises.length)) * 100}%`
                    : currentStage === 'exercises'
                    ? `${((lesson.vocabulary.length + exerciseIndex + 1) / (lesson.vocabulary.length + lesson.exercises.length)) * 100}%`
                    : '100%',
              }}
            />
          </div>
        </div>

        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
          +{lesson.xpReward} XP
        </span>
      </div>

      {/* Main Body */}
      <div className="max-w-xl mx-auto w-full my-auto py-4">
        {/* 1. VISUAL VOCABULARY STAGE */}
        {currentStage === 'vocab' && currentVocab && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg dark:shadow-none shadow-slate-200/50 border border-slate-200 dark:border-slate-700 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              <span>Word {vocabIndex + 1} of {lesson.vocabulary.length}</span>
            </div>

            {/* Large Visual Emoji / Icon */}
            <div className="w-28 h-28 mx-auto rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-6xl shadow-inner">
              {currentVocab.emoji}
            </div>

            {/* Word & Audio */}
            <div>
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                  {currentVocab.word}
                </h2>
                <AudioButton text={currentVocab.word} label="" size="sm" />
              </div>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                Phonetic: <span className="text-slate-700 dark:text-slate-300">{currentVocab.phonetic}</span>
              </p>
            </div>

            {/* Native Translation Bridge */}
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Meaning in {userLanguage}
              </span>
              <p className="text-xl font-bold text-indigo-900">
                {currentVocab.translations[userLanguage] || currentVocab.translations['Malayalam']}
              </p>
            </div>

            {/* Example Sentence */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Example Sentence
              </span>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  &ldquo;{currentVocab.exampleSentence}&rdquo;
                </p>
                <AudioButton text={currentVocab.exampleSentence} label="" size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentVocab.exampleTranslations[userLanguage] ||
                  currentVocab.exampleTranslations['Malayalam']}
              </p>
            </div>

            {/* Next Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (vocabIndex < lesson.vocabulary.length - 1) {
                    setVocabIndex((i) => i + 1);
                  } else {
                    resetExerciseState(0);
                    setCurrentStage('exercises');
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-sm dark:shadow-none shadow-indigo-100"
              >
                <span>
                  {vocabIndex < lesson.vocabulary.length - 1
                    ? 'Next Word →'
                    : 'Start Interactive Practice →'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 2. INTERACTIVE EXERCISE STAGE */}
        {currentStage === 'exercises' && currentExercise && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 shadow-lg dark:shadow-none shadow-slate-200/50 border border-slate-200 dark:border-slate-700 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Exercise {exerciseIndex + 1} of {lesson.exercises.length}
              </span>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
                {currentExercise.type.replace('_', ' ')}
              </span>
            </div>

            {/* Question */}
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
                {currentExercise.question}
              </h3>
              {currentExercise.audioPrompt && (
                <div className="mt-4 flex items-center justify-center py-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                  <AudioButton text={currentExercise.audioPrompt} label="Play Audio" size="lg" />
                </div>
              )}
            </div>

            {/* Exercise Type 1 & 3: Multiple Choice & Listen Choose */}
            {(currentExercise.type === 'multiple_choice' ||
              currentExercise.type === 'listen_choose') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentExercise.options?.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnStyle = 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200';

                  if (isAnswerChecked) {
                    if (opt.isCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-300';
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-300';
                    }
                  } else if (isSelected) {
                    btnStyle = 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-200';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswerChecked}
                      onClick={() => handleCheckMultipleChoice(idx)}
                      className={`p-4 rounded-xl border-2 text-left transition-all active:scale-98 font-bold text-sm flex flex-col justify-between ${btnStyle}`}
                    >
                      <span>{opt.text}</span>
                      {opt.subtext && (
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mt-1">
                          {opt.subtext}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Exercise Type 2: Matching */}
            {currentExercise.type === 'matching' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Left Column */}
                <div className="space-y-2">
                  {currentExercise.pairs?.map((p) => {
                    const isMatched = matchedPairs.includes(p.left);
                    const isSelected = matchingSelectedLeft === p.left;
                    return (
                      <button
                        key={p.left}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClick('left', p.left)}
                        className={`w-full p-3.5 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 opacity-60'
                            : isSelected
                            ? 'bg-indigo-100 border-indigo-600 text-indigo-900 ring-2 ring-indigo-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {p.left}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  {currentExercise.pairs?.map((p) => {
                    const isMatched = matchedPairs.includes(p.right);
                    return (
                      <button
                        key={p.right}
                        type="button"
                        disabled={isMatched || !matchingSelectedLeft}
                        onClick={() => handleMatchClick('right', p.right)}
                        className={`w-full p-3.5 rounded-xl border-2 text-center text-sm font-bold transition-all ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 opacity-60'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {p.right}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Exercise Type 4: Sentence Builder */}
            {currentExercise.type === 'sentence_builder' && (
              <div className="space-y-6 pt-2">
                {/* Assembled Sentence Area */}
                <div className="min-h-[64px] p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-wrap items-center gap-2">
                  {sentenceTokens.length === 0 ? (
                    <span className="text-xs text-slate-400 font-medium pl-1">
                      Tap words below to arrange your sentence...
                    </span>
                  ) : (
                    sentenceTokens.map((token, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={isAnswerChecked}
                        onClick={() => handleRemoveToken(token, i)}
                        className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-xs hover:bg-indigo-700 transition-colors"
                      >
                        {token}
                      </button>
                    ))
                  )}
                </div>

                {/* Available Scrambled Tokens */}
                <div className="flex flex-wrap justify-center gap-2.5">
                  {availableTokens.map((token, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={isAnswerChecked}
                      onClick={() => handleAddToken(token, i)}
                      className="px-4 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 shadow-xs active:scale-95 transition-all"
                    >
                      {token}
                    </button>
                  ))}
                </div>

                {!isAnswerChecked && (
                  <button
                    type="button"
                    disabled={sentenceTokens.length === 0}
                    onClick={handleCheckSentenceBuilder}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm dark:shadow-none shadow-indigo-100 disabled:opacity-50 transition-all"
                  >
                    Check Sentence
                  </button>
                )}
              </div>
            )}

            {/* Explanation & Feedback Bottom Banner */}
            {isAnswerChecked && (
              <div
                className={`p-4 rounded-xl border flex items-start justify-between gap-3 animate-in fade-in duration-200 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-extrabold text-sm block">
                      {isCorrect ? 'Awesome! That is correct! 🎉' : 'Not quite right yet.'}
                    </span>
                    <p className="text-xs mt-0.5 opacity-90">{currentExercise.explanation}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextExercise}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. LESSON COMPLETE CELEBRATION STAGE */}
        {currentStage === 'completed' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 sm:p-10 shadow-lg dark:shadow-none shadow-slate-200/50 border border-slate-200 dark:border-slate-700 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-24 h-24 mx-auto rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-4xl shadow-lg dark:shadow-none shadow-amber-200">
              🏆
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Lesson Complete!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                You just completed <strong className="text-slate-800 dark:text-slate-200">{lesson.title}</strong>!
              </p>
            </div>

            {/* Score & Reward Pills */}
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-2xl font-black text-indigo-700 block">+{lesson.xpReward}</span>
                <span className="text-[11px] font-bold uppercase text-indigo-500">XP Earned</span>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-2xl font-black text-emerald-700 block">{score}%</span>
                <span className="text-[11px] font-bold uppercase text-emerald-500">Accuracy</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lesson.vocabulary.length} new words added to your personal dictionary.
            </p>

            {/* Next actions */}
            <div className="pt-4 space-y-3">
              <Link
                href="/learn"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all shadow-sm dark:shadow-none shadow-indigo-100"
              >
                <span>Continue to Next Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
