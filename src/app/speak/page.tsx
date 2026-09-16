'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SUPPORTED_LANGUAGES, getSpeechCodeForLanguage } from '@/lib/languages';
import { AudioButton } from '@/components/ui/AudioButton';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Award,
  Globe,
  Edit3,
  BookMarked,
  Check,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TranslationData {
  detectedLanguage: string;
  nativeText: string;
  englishText: string;
  phoneticGuide: string;
  breakdown: { word: string; meaning: string }[];
  naturalTip?: string;
  confidence: number;
  didYouMean?: string[];
}

type PipelineStage = 'idle' | 'listening' | 'transcribing' | 'translating' | 'ready';

interface ISpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: ISpeechRecognitionResult;
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognitionInstance;

export default function SpeakPage() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    xp?: number;
    streak?: number;
    preferredLanguage?: string;
    englishLevel?: string;
  } | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState('Malayalam');
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [textInput, setTextInput] = useState('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [translation, setTranslation] = useState<TranslationData | null>(null);
  const [isListeningEnglishTry, setIsListeningEnglishTry] = useState(false);
  const [englishAttempt, setEnglishAttempt] = useState('');
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [pronunciationFeedback, setPronunciationFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSavedToLearn, setIsSavedToLearn] = useState(false);
  const [savingLearn, setSavingLearn] = useState(false);

  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);

  // Fetch current user and set default language from profile
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          if (data.user.preferredLanguage) {
            setSelectedLanguage(data.user.preferredLanguage);
          }
        }
      })
      .catch(() => {});
  }, []);

  const currentLangInfo =
    SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const handleTranslate = async (textToTranslate: string) => {
    const clean = textToTranslate.trim();
    if (!clean) return;

    setErrorMessage('');
    setPipelineStage('translating');
    setTranslation(null);
    setPronunciationScore(null);
    setPronunciationFeedback('');
    setEnglishAttempt('');
    setIsSavedToLearn(false);
    setIsEditingTranscript(false);

    try {
      const res = await fetch('/api/speak/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setTranslation(data.result);
        setEditedTranscript(clean);
        setPipelineStage('ready');
        if (data.awardedXp && user) {
          setUser({ ...user, xp: (user.xp || 0) + data.awardedXp });
        }
      } else {
        setErrorMessage(data.error || 'We couldn’t translate that right now. Please try again.');
        setPipelineStage('idle');
      }
    } catch {
      setErrorMessage('We couldn’t translate that right now. Please check your connection and try again.');
      setPipelineStage('idle');
    }
  };

  // Start speech recognition for native speech
  const startNativeSpeech = () => {
    const windowSpeech = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = windowSpeech.SpeechRecognition || windowSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type below or use Google Chrome/Microsoft Edge.');
      return;
    }

    try {
      // Abort previous if any
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      const targetSpeechCode = getSpeechCodeForLanguage(selectedLanguage);
      recognition.lang = targetSpeechCode;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      setErrorMessage('');
      setInterimText('');
      setPipelineStage('listening');

      recognition.onstart = () => {
        setPipelineStage('listening');
      };

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimText(interim);
        }

        if (final) {
          setPipelineStage('transcribing');
          setTextInput(final);
          setEditedTranscript(final);
          setInterimText('');
          handleTranslate(final);
        }
      };

      recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          setErrorMessage('We couldn’t clearly hear that. Please try again.');
        } else if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else {
          setErrorMessage('We couldn’t clearly hear that. Please try again or type below.');
        }
        setPipelineStage('idle');
      };

      recognition.onend = () => {
        if (pipelineStage === 'listening') {
          setPipelineStage('idle');
        }
      };

      recognition.start();
    } catch (e) {
      console.error('Recognition startup error:', e);
      setErrorMessage('Could not initialize microphone. Please type your phrase below.');
      setPipelineStage('idle');
    }
  };

  const stopNativeSpeech = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setPipelineStage('idle');
    }
  };

  // English Pronunciation Check ("Try saying it")
  const startEnglishPronunciationCheck = () => {
    const windowSpeech = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition = windowSpeech.SpeechRecognition || windowSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListeningEnglishTry(true);
      recognition.onend = () => setIsListeningEnglishTry(false);
      recognition.onerror = () => {
        setIsListeningEnglishTry(false);
        setPronunciationFeedback('Could not detect your voice. Please try again.');
      };

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        const spoken = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence || 0.85;
        setEnglishAttempt(spoken);

        const targetClean = translation?.englishText.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim() || '';
        const spokenClean = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

        if (targetClean === spokenClean || targetClean.includes(spokenClean) || spokenClean.includes(targetClean)) {
          const score = Math.min(100, Math.round(confidence * 100) + 12);
          setPronunciationScore(score);
          setPronunciationFeedback('Great job! ⭐ You spoke with wonderful clarity and confidence!');
          try {
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
          } catch {}
        } else {
          setPronunciationScore(75);
          setPronunciationFeedback(
            `Almost there! Listen again and try: "${translation?.phoneticGuide || translation?.englishText}"`
          );
        }
      };

      recognition.start();
    } catch {
      setIsListeningEnglishTry(false);
    }
  };

  // Save to Learning List / Dictionary
  const handleSaveToLearn = async () => {
    if (!translation || !user) return;
    setSavingLearn(true);
    try {
      await fetch('/api/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: translation.englishText,
          nativeTranslation: translation.nativeText,
          definition: `Everyday spoken sentence in ${selectedLanguage}`,
        }),
      });
      setIsSavedToLearn(true);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      } catch {}
    } catch {
      alert('Failed to save to practice list.');
    } finally {
      setSavingLearn(false);
    }
  };

  return (
    <AppShell
      user={
        user || {
          id: 'guest',
          name: 'Guest Learner',
          email: '',
          preferredLanguage: selectedLanguage,
        }
      }
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header & Explicit Language Selection (Section 4) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sentence-Level Meaning Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Speak & Translate
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Speak in your language. LinguaLearn understands the complete meaning and converts it to natural English.
            </p>
          </div>

          {/* "What language are you speaking?" Selector */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              What language are you speaking?
            </label>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setTranslation(null);
                  setTextInput('');
                  setErrorMessage('');
                }}
                className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer pr-2"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pipeline State Banner (Section 22) */}
        {pipelineStage !== 'idle' && pipelineStage !== 'ready' && (
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center gap-3 animate-in fade-in duration-200">
            {pipelineStage === 'listening' && (
              <>
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold text-indigo-900">
                  🎤 Listening in {currentLangInfo.name}... Speak naturally now
                </span>
              </>
            )}
            {pipelineStage === 'transcribing' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900">
                  📝 Understanding your sentence...
                </span>
              </>
            )}
            {pipelineStage === 'translating' && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900">
                  🌐 Translating complete meaning into natural English...
                </span>
              </>
            )}
          </div>
        )}

        {/* Error / Silence Notification (Section 21) */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800 font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage('')}
              className="text-rose-600 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Primary Speaking Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Press the button and speak in {currentLangInfo.name}
          </p>

          {/* Big Mic Button */}
          <div className="relative inline-block mb-6">
            {pipelineStage === 'listening' && (
              <div className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping" />
            )}
            <button
              type="button"
              onClick={pipelineStage === 'listening' ? stopNativeSpeech : startNativeSpeech}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-xl active:scale-95 ${
                pipelineStage === 'listening'
                  ? 'bg-rose-500 text-white shadow-rose-200 ring-8 ring-rose-100 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-200 hover:scale-105'
              }`}
              title="Click to speak"
            >
              {pipelineStage === 'listening' ? (
                <>
                  <MicOff className="w-9 h-9" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Stop</span>
                </>
              ) : (
                <>
                  <Mic className="w-9 h-9" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Tap to Speak</span>
                </>
              )}
            </button>
          </div>

          {/* Live Interim Speech Preview */}
          {interimText && (
            <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl mb-4 max-w-md mx-auto text-xs text-slate-600 italic">
              Hearing: &ldquo;{interimText}&rdquo;
            </div>
          )}

          {/* Quick Examples */}
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-medium">Or try saying / typing:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setTextInput(currentLangInfo.samplePhrase);
                  handleTranslate(currentLangInfo.samplePhrase);
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                &ldquo;{currentLangInfo.samplePhrase}&rdquo;
              </button>
              {selectedLanguage === 'Malayalam' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const phrase = 'ഞാൻ നാളെ സ്കൂളിൽ പോകും';
                      setTextInput(phrase);
                      handleTranslate(phrase);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800"
                  >
                    &ldquo;ഞാൻ നാളെ സ്കൂളിൽ പോകും&rdquo;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const phrase = 'എനിക്ക് ഒരു ചായ വേണം';
                      setTextInput(phrase);
                      handleTranslate(phrase);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800"
                  >
                    &ldquo;എനിക്ക് ഒരു ചായ വേണം&rdquo;
                  </button>
                </>
              )}
              {selectedLanguage === 'Hindi' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const phrase = 'मुझे पानी चाहिए';
                      setTextInput(phrase);
                      handleTranslate(phrase);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800"
                  >
                    &ldquo;मुझे पानी चाहिए&rdquo;
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Text Input Option (Section 15) */}
          <div className="mt-6 pt-6 border-t border-slate-100 max-w-md mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTranslate(textInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Type in ${currentLangInfo.name} or English...`}
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              />
              <button
                type="submit"
                disabled={pipelineStage === 'translating' || !textInput.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {pipelineStage === 'translating' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Translate'}
              </button>
            </form>
          </div>
        </div>

        {/* TRANSLATION RESULT UI (Section 8, 16, 17) */}
        {translation && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-100 shadow-xl shadow-indigo-50 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Step A: "You Said" with ✏️ Edit (Section 8) */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span>🗣️ You said ({translation.detectedLanguage})</span>
                </span>

                {!isEditingTranscript ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingTranscript(true);
                      setEditedTranscript(translation.nativeText);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                    title="Edit transcription if speech recognition misheard"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>✏️ Edit</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingTranscript(false)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!isEditingTranscript ? (
                <p className="text-2xl font-bold text-slate-900 leading-snug">
                  {translation.nativeText}
                </p>
              ) : (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={editedTranscript}
                    onChange={(e) => setEditedTranscript(e.target.value)}
                    className="w-full px-3 py-2 text-base font-bold bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleTranslate(editedTranscript)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      Re-translate
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Uncertainty Warning / Did You Mean (Section 9) */}
            {translation.confidence < 0.7 && translation.didYouMean && translation.didYouMean.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>We aren&apos;t completely sure what you said.</span>
                </div>
                <p className="text-amber-800 font-medium">Did you mean:</p>
                <div className="flex flex-wrap gap-2">
                  {translation.didYouMean.map((alt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTranslate(alt)}
                      className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
                    >
                      &ldquo;{alt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step B: "English" with Audio & Phonetics (Section 16) */}
            <div className="p-6 bg-gradient-to-br from-indigo-50/90 to-violet-50/90 rounded-2xl border border-indigo-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <span>🇬🇧 Natural English</span>
                </span>
                <div className="flex items-center gap-2">
                  <AudioButton text={translation.englishText} label="Listen" size="sm" />
                  <AudioButton text={translation.englishText} label="Slow" rate={0.65} size="sm" />
                </div>
              </div>

              <p className="text-2xl sm:text-3xl font-black text-indigo-950 leading-snug">
                &ldquo;{translation.englishText}&rdquo;
              </p>

              {translation.phoneticGuide && (
                <div className="mt-3 pt-3 border-t border-indigo-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Phonetic:</span>
                  <span className="text-slate-800 font-bold bg-white/70 px-2 py-0.5 rounded-md border border-indigo-100">
                    {translation.phoneticGuide}
                  </span>
                </div>
              )}
            </div>

            {/* Step C: Pronunciation Practice ("Try saying it") */}
            <div className="p-6 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block mb-1">
                    🎤 Practice saying it
                  </span>
                  <p className="text-base font-bold text-slate-800">
                    Say aloud: &ldquo;{translation.englishText}&rdquo;
                  </p>
                  {englishAttempt && (
                    <p className="text-xs text-slate-600 mt-1">
                      We heard: <strong className="text-slate-900">{englishAttempt}</strong>
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={startEnglishPronunciationCheck}
                  disabled={isListeningEnglishTry}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                    isListeningEnglishTry
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{isListeningEnglishTry ? 'Listening...' : 'Try saying it'}</span>
                </button>
              </div>

              {/* Feedback */}
              {pronunciationScore !== null && (
                <div className="mt-4 pt-4 border-t border-amber-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {pronunciationScore >= 80 ? '⭐' : '💪'}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {pronunciationFeedback}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                    {pronunciationScore}% Clarity
                  </span>
                </div>
              )}
            </div>

            {/* Step D: "Learn this sentence" Mode (Section 16 & 17) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Turn this translation into long-term learning by saving it to your vocabulary list.
              </div>

              <button
                type="button"
                onClick={handleSaveToLearn}
                disabled={savingLearn || isSavedToLearn}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  isSavedToLearn
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100'
                }`}
              >
                {savingLearn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSavedToLearn ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <BookMarked className="w-4 h-4" />
                )}
                <span>{isSavedToLearn ? 'Saved to Learn List' : 'Learn this sentence'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
