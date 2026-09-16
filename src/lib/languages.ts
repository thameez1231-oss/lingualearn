export interface LanguageInfo {
  id: string;
  name: string;
  nativeName: string;
  code: string; // ISO 639-1 code for neural translation (ml, hi, ta, etc.)
  flag: string;
  speechCode: string; // BCP-47 for speech recognition (ml-IN, hi-IN, etc.)
  samplePhrase: string;
  sampleTranslation: string;
  direction?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    id: 'Malayalam',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    code: 'ml',
    flag: '🌴',
    speechCode: 'ml-IN',
    samplePhrase: 'എനിക്ക് വിശക്കുന്നു',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    code: 'hi',
    flag: '🇮🇳',
    speechCode: 'hi-IN',
    samplePhrase: 'मुझे भूख लगी है',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Tamil',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    code: 'ta',
    flag: '🪔',
    speechCode: 'ta-IN',
    samplePhrase: 'எனக்கு பசிக்கிறது',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Telugu',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    code: 'te',
    flag: '🌾',
    speechCode: 'te-IN',
    samplePhrase: 'నాకు ఆకలిగా ఉంది',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Kannada',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    code: 'kn',
    flag: '🐘',
    speechCode: 'kn-IN',
    samplePhrase: 'ನನಗೆ ಹಸಿವಾಗಿದೆ',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Bengali',
    name: 'Bengali',
    nativeName: 'বাংলা',
    code: 'bn',
    flag: '🐯',
    speechCode: 'bn-IN',
    samplePhrase: 'আমার ক্ষুধা পেয়েছে',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Arabic',
    name: 'Arabic',
    nativeName: 'العربية',
    code: 'ar',
    flag: '🌙',
    speechCode: 'ar-SA',
    samplePhrase: 'أنا جائع',
    sampleTranslation: 'I am hungry.',
    direction: 'rtl',
  },
  {
    id: 'Spanish',
    name: 'Spanish',
    nativeName: 'Español',
    code: 'es',
    flag: '🇪🇸',
    speechCode: 'es-ES',
    samplePhrase: 'Tengo hambre',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'French',
    name: 'French',
    nativeName: 'Français',
    code: 'fr',
    flag: '🇫🇷',
    speechCode: 'fr-FR',
    samplePhrase: "J'ai faim",
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'German',
    name: 'German',
    nativeName: 'Deutsch',
    code: 'de',
    flag: '🇩🇪',
    speechCode: 'de-DE',
    samplePhrase: 'Ich habe Hunger',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Portuguese',
    name: 'Portuguese',
    nativeName: 'Português',
    code: 'pt',
    flag: '🇧🇷',
    speechCode: 'pt-BR',
    samplePhrase: 'Estou com fome',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Chinese',
    name: 'Chinese',
    nativeName: '中文 (Mandarin)',
    code: 'zh',
    flag: '🇨🇳',
    speechCode: 'zh-CN',
    samplePhrase: '我饿了',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Japanese',
    name: 'Japanese',
    nativeName: '日本語',
    code: 'ja',
    flag: '🇯🇵',
    speechCode: 'ja-JP',
    samplePhrase: 'お腹が空きました',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Korean',
    name: 'Korean',
    nativeName: '한국어',
    code: 'ko',
    flag: '🇰🇷',
    speechCode: 'ko-KR',
    samplePhrase: '배고파요',
    sampleTranslation: 'I am hungry.',
  },
  {
    id: 'Other',
    name: 'Other',
    nativeName: 'International',
    code: 'auto',
    flag: '🌐',
    speechCode: 'en-US',
    samplePhrase: 'Hello friend',
    sampleTranslation: 'Hello friend.',
  },
];

export const ENGLISH_LEVELS = [
  {
    id: 'COMPLETE_BEGINNER',
    tag: '🟢 Complete Beginner',
    title: 'Complete Beginner',
    description: 'I know little or no English.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    starterLessons: 'Alphabet, Numbers, Colors, Simple Everyday Greetings',
  },
  {
    id: 'BEGINNER',
    tag: '🔵 Beginner',
    title: 'Beginner',
    description: 'I know some basic English words.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    starterLessons: 'Everyday Sentences, Asking Questions, Introducing Yourself',
  },
  {
    id: 'INTERMEDIATE',
    tag: '🟡 Intermediate',
    title: 'Intermediate',
    description: 'I can understand simple English.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    starterLessons: 'Conversations, Verb Tenses, Practical Work & Travel',
  },
  {
    id: 'ADVANCED',
    tag: '🟣 Advanced',
    title: 'Advanced',
    description: 'I can speak and understand English fairly well.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    starterLessons: 'Nuanced Pronunciation, Idioms, Confident Fluency',
  },
];

export function getLanguageById(id: string): LanguageInfo {
  return (
    SUPPORTED_LANGUAGES.find((lang) => lang.id.toLowerCase() === id.toLowerCase()) ||
    SUPPORTED_LANGUAGES[0]
  );
}

export function getLanguageCode(id: string): string {
  const lang = SUPPORTED_LANGUAGES.find(
    (l) => l.id.toLowerCase() === id.toLowerCase() || l.name.toLowerCase() === id.toLowerCase()
  );
  return lang?.code || 'auto';
}

export function getSpeechCodeForLanguage(langName: string): string {
  const lang = SUPPORTED_LANGUAGES.find(
    (l) => l.id.toLowerCase() === langName.toLowerCase() || l.name.toLowerCase() === langName.toLowerCase()
  );
  return lang?.speechCode || 'en-US';
}
