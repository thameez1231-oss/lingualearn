'use client';

import React, { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';

interface AudioButtonProps {
  text: string;
  lang?: string;
  rate?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AudioButton({
  text,
  lang = 'en-US',
  rate = 0.9,
  label = 'Listen',
  size = 'md',
  className = '',
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Try finding natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-semibold',
  }[size];

  return (
    <button
      type="button"
      onClick={speak}
      disabled={isPlaying}
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 active:scale-95 shadow-sm border ${
        isPlaying
          ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300 animate-pulse'
          : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
      } ${sizeClasses} ${className}`}
      title="Listen to natural English pronunciation"
    >
      {isPlaying ? (
        <Loader2 className="w-4 h-4 animate-spin text-white select-none pointer-events-none" aria-hidden="true" />
      ) : (
        <Volume2 className="w-4 h-4 text-indigo-600 select-none pointer-events-none" aria-hidden="true" />
      )}
      {label && <span className="select-none">{isPlaying ? 'Speaking...' : label}</span>}
    </button>
  );
}
