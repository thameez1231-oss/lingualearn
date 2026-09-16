import { getLanguageCode } from './languages';

export interface TranslationResult {
  detectedLanguage: string;
  nativeText: string;
  englishText: string;
  phoneticGuide: string;
  breakdown: { word: string; meaning: string }[];
  naturalTip?: string;
  confidence: number; // 0 to 1
  didYouMean?: string[];
  isCodeSwitched?: boolean;
}

export interface GrammarCorrection {
  original: string;
  better: string;
  explanation: string;
}

export interface TutorResponse {
  replyEnglish: string;
  replyNative: string;
  correction?: GrammarCorrection;
  suggestions: string[];
}

// Generates beginner-friendly phonetic pronunciation guides for English words
const PHONETIC_MAP: Record<string, string> = {
  i: 'eye',
  am: 'am',
  hungry: 'HUHNG-gree',
  thirsty: 'THUR-stee',
  tired: 'TY-urd',
  water: 'WAH-ter',
  food: 'food',
  where: 'wair',
  what: 'wut',
  when: 'wen',
  who: 'hoo',
  why: 'wy',
  how: 'how',
  are: 'ahr',
  you: 'yoo',
  going: 'GOH-ing',
  doing: 'DOO-ing',
  coming: 'KUHM-ing',
  school: 'skool',
  tomorrow: 'tuh-MAH-roh',
  yesterday: 'YES-ter-day',
  today: 'tuh-DAY',
  help: 'help',
  please: 'pleez',
  thank: 'thank',
  hello: 'heh-LOH',
  good: 'good',
  morning: 'MOR-ning',
  night: 'nyt',
  beautiful: 'BYOO-tih-ful',
  friend: 'frend',
  house: 'hows',
  home: 'hohm',
  car: 'kahr',
  bus: 'buss',
  train: 'trayn',
  cost: 'kawst',
  much: 'much',
  many: 'MEH-nee',
  want: 'wahnt',
  need: 'need',
  understand: 'un-der-STAND',
  speak: 'speek',
  english: 'ING-glish',
  name: 'naym',
};

export function generatePhoneticGuide(englishSentence: string): string {
  const words = englishSentence
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return englishSentence;

  return words
    .map((w) => PHONETIC_MAP[w] || w)
    .join(' ');
}

// Clean and naturalize English output
function naturalizeEnglish(rawText: string): string {
  let cleaned = rawText.trim();

  // Strip XML/HTML tags (e.g. <g id="1"> from translation APIs)
  cleaned = cleaned.replace(/<[^>]+>/g, '').trim();

  // Decode common HTML entities
  cleaned = cleaned
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Remove surrounding quotes if model added them
  cleaned = cleaned.replace(/^["']|["']$/g, '').trim();

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Ensure ending punctuation
  if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  // Fix common robotic capitalization/spacings
  cleaned = cleaned.replace(/\s+([,.!?])/g, '$1');

  return cleaned;
}

// Server-side Neural Machine Translation Engine (Translates complete sentences, preserves syntax & tenses)
// Server-side Neural Machine Translation Engine (Bidirectional, translates complete sentences)
export async function fetchNeuralTranslation(
  text: string,
  sourceLangCode: string,
  targetLangCode: string = 'en'
): Promise<string | null> {
  const query = encodeURIComponent(text);
  const sl = sourceLangCode && sourceLangCode !== 'auto' ? sourceLangCode : 'auto';
  const tl = targetLangCode || 'en';

  // 1. Primary: Google Neural Translation Engine (Fast, preserves idioms and grammar)
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${query}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data[0])) {
        const translatedParts = data[0]
          .map((item: unknown) => (Array.isArray(item) && typeof item[0] === 'string' ? item[0] : ''))
          .filter(Boolean);
        const combined = translatedParts.join(' ').trim();
        if (combined && combined.toLowerCase() !== text.toLowerCase()) {
          return tl === 'en' ? naturalizeEnglish(combined) : combined;
        }
      }
    }
  } catch (err) {
    console.warn('[Translation] Primary engine notice:', err);
  }

  // 2. High-Reliability Neural Secondary Engine (MyMemory Translation API)
  if (sl !== 'auto') {
    try {
      const fallbackUrl = `https://api.mymemory.translated.net/get?q=${query}&langpair=${sl}|${tl}`;
      const fallbackRes = await fetch(fallbackUrl);
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const translated = fallbackData?.responseData?.translatedText;
        if (
          translated &&
          typeof translated === 'string' &&
          !translated.toUpperCase().includes('MYMEMORY WARNING') &&
          translated.toLowerCase() !== text.toLowerCase()
        ) {
          return tl === 'en' ? naturalizeEnglish(translated) : translated;
        }
      }
    } catch (err) {
      console.warn('[Translation] Secondary engine notice:', err);
    }
  }

  return null;
}

/**
 * Strips raw HTML, XML, SVG tags, "svg" artifacts, and markdown debris from tutor output.
 */
export function sanitizeTutorText(text: string): string {
  if (!text) return '';
  let cleaned = text
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<\/?[a-z0-9]+(?:\s+[^>]*?)?>/gi, '')
    .replace(/(?:^|\b)\*?\*?svg\*?\*?(?:\b|$)/gi, '')
    .replace(/\[\s*svg\s*\]/gi, '')
    .replace(/\bXML\b/gi, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Balance unclosed quotes if model omitted closing quote before punctuation
  // Ignore contractions (like don't, doesn't, it's, I'm) when counting quotation marks
  const nonContractionQuotes = cleaned.replace(/\b[a-zA-Z]+'[a-zA-Z]+\b/g, '').match(/'/g) || [];
  if (nonContractionQuotes.length % 2 !== 0 && /(?:^|[\s:,"'])'[^']*$/.test(cleaned)) {
    if (cleaned.endsWith('.')) {
      cleaned = cleaned.slice(0, -1) + ".'";
    } else {
      cleaned += "'";
    }
  }

  // Also clean up any accidental trailing dangling quotes
  cleaned = cleaned.replace(/([a-zA-Z0-9]+)\'\s*$/, '$1');

  return cleaned;
}

// Comprehensive grammar mistake detector for beginner English learners
const GRAMMAR_MISTAKES = [
  {
    regex: /\b(he|she|it)\s+don'?t\s+like\s+tea\b/i,
    better: "$1 doesn't like tea",
    explanation: "We use 'doesn't' with 'he, she, and it.'",
  },
  {
    regex: /\bi\s+(?:am\s+)?go\s+(?:to\s+)?(?:school|market|office|work|home)?\s*yesterday\b/i,
    better: 'I went to school yesterday',
    explanation: "For actions in the past ('yesterday'), use the past tense 'went', not 'am go'.",
  },
  {
    regex: /\bi\s+am\s+go\s+to\b/i,
    better: 'I am going to',
    explanation: 'After "am", use the continuous "-ing" form ("going") for actions happening now or planned.',
  },
  {
    regex: /\bi\s+am\s+agree\b/i,
    better: 'I agree',
    explanation: '"Agree" is already a verb; say "I agree", without "am".',
  },
  {
    regex: /\bi\s+am\s+know\b/i,
    better: 'I know',
    explanation: '"Know" is a state verb; simply say "I know", not "I am know".',
  },
  {
    regex: /\bi\s+go\s+(yesterday|last\s+\w+)\b/i,
    better: 'I went',
    explanation: 'Use the past tense "went" for actions that occurred in the past.',
  },
  {
    regex: /\b(yesterday|last\s+\w+)\s+i\s+go\b/i,
    better: 'I went',
    explanation: 'Use the past tense "went" for completed past actions.',
  },
  {
    regex: /\b(he|she|it)\s+have\b/i,
    better: 'has',
    explanation: 'With singular third-person subjects ("He", "She", "It"), use "has" instead of "have".',
  },
  {
    regex: /\b(he|she|it)\s+don'?t\b/i,
    better: "doesn't",
    explanation: 'With "He", "She", or "It", use "does not" or "doesn\'t" instead of "don\'t".',
  },
  {
    regex: /\bi\s+didn'?t\s+went\b/i,
    better: "I didn't go",
    explanation: 'After "didn\'t", always use the base verb form ("go", not "went").',
  },
  {
    regex: /\bi\s+didn'?t\s+saw\b/i,
    better: "I didn't see",
    explanation: 'After "didn\'t", use the base verb ("see", not "saw").',
  },
  {
    regex: /\bi\s+didn'?t\s+ate\b/i,
    better: "I didn't eat",
    explanation: 'After "didn\'t", use the base verb ("eat", not "ate").',
  },
  {
    regex: /\bhow\s+much\s+years\b/i,
    better: 'How old are you?',
    explanation: 'When asking someone\'s age, in English we say "How old are you?".',
  },
  {
    regex: /\bi\s+am\s+in\s+bus\b/i,
    better: 'I am on the bus',
    explanation: 'For public transit (buses, trains, planes), use "on the bus/train".',
  },
  {
    regex: /\bi\s+am\s+in\s+train\b/i,
    better: 'I am on the train',
    explanation: 'In English, we say "on the train" rather than "in train".',
  },
  {
    regex: /\blisten\s+me\b/i,
    better: 'listen to me',
    explanation: '"Listen" requires the preposition "to" before an object ("listen to me").',
  },
  {
    regex: /\bdiscuss\s+about\b/i,
    better: 'discuss',
    explanation: '"Discuss" means talk about, so do not say "discuss about".',
  },
  {
    regex: /\bmarried\s+with\b/i,
    better: 'married to',
    explanation: 'In English, we say someone is "married to" their partner.',
  },
  {
    regex: /\bi\s+am\s+engineer\b/i,
    better: 'I am an engineer',
    explanation: 'Use the article "an" before singular professions starting with a vowel sound.',
  },
  {
    regex: /\bi\s+am\s+doctor\b/i,
    better: 'I am a doctor',
    explanation: 'Use the article "a" before singular professions ("a doctor").',
  },
  {
    regex: /\bi\s+am\s+teacher\b/i,
    better: 'I am a teacher',
    explanation: 'Say "I am a teacher" with the indefinite article "a".',
  },
  {
    regex: /\bi\s+am\s+student\b/i,
    better: 'I am a student',
    explanation: 'Say "I am a student" with the indefinite article "a".',
  },
  {
    regex: /\bmyself\s+([a-zA-Z]+)\b/i,
    better: 'My name is $1',
    explanation: 'In English introductions, say "My name is [Name]" or "I am [Name]".',
  },
  {
    regex: /\bwhere\s+you\s+are\s+going\b/i,
    better: 'Where are you going?',
    explanation: 'In English questions, invert the subject and helping verb: "Where are you going?".',
  },
  {
    regex: /\bwhat\s+you\s+are\s+doing\b/i,
    better: 'What are you doing?',
    explanation: 'In English questions, place the helping verb first: "What are you doing?".',
  },
  {
    regex: /\bmore\s+better\b/i,
    better: 'better',
    explanation: '"Better" is already comparative; avoid double comparatives like "more better".',
  },
  {
    regex: /\bmore\s+taller\b/i,
    better: 'taller',
    explanation: '"Taller" already has "-er"; avoid saying "more taller".',
  },
  {
    regex: /\bno\s+mention\b/i,
    better: "You're welcome",
    explanation: 'A more natural English response to "Thank you" is "You\'re welcome" or "My pleasure".',
  },
];

/**
 * Detects Manglish (Malayalam written in Latin/English script) and mixed Malayalam-English.
 * Understands phrases and converts into equivalent English meaning.
 */
export function resolveManglishAndMixed(text: string): {
  isManglish: boolean;
  englishMeaning?: string;
  naturalTip?: string;
  extractedName?: string;
} {
  const lower = text.toLowerCase().trim();

  // Name patterns: "ente per shukoor aan", "ente peru shukoor", "ente per shukoor"
  const nameMatch = lower.match(/\bente\s+per(?:u)?\s+([a-zA-Z]+)(?:\s+aan(?:u)?)?\b/i);
  if (nameMatch) {
    const rawName = nameMatch[1];
    const capitalized = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    return {
      isManglish: true,
      englishMeaning: `My name is ${capitalized}.`,
      extractedName: capitalized,
      naturalTip: `Say: "My name is ${capitalized}."`,
    };
  }

  // 1. Direct Manglish phrases and common colloquial sentences
  const directPhrases: Array<{ pattern: RegExp; meaning: string; tip?: string }> = [
    {
      pattern: /\b(?:enikk(?:u)?\s+)?english\s+padikkan\s+sahayikkumo\b/i,
      meaning: "Can you help me learn English?",
      tip: "Say: 'Can you help me learn English?'",
    },
    {
      pattern: /\b(?:enikk(?:u)?\s+)?english\s+ariyilla\b/i,
      meaning: "I don't know English well yet.",
      tip: "Say: 'I don't know English well yet.'",
    },
    {
      pattern: /\bnjan\s+(?:innu\s+)?(?:school(?:il)?|office(?:il)?|college(?:il)?)\s+poyi\b/i,
      meaning: "I went to school today.",
      tip: "Say: 'I went to school today.'",
    },
    {
      pattern: /\bente\s+english\s+correct\s+aano\b|\bcorrect\s+aano\b/i,
      meaning: "Is my English correct?",
      tip: "Say: 'Is my English correct?'",
    },
    {
      pattern: /\b(enthokke\s*(?:undu?|yundu?)|enthokke\s+vishesham|vishesham\s+entha|visheshangal\s+entha)\b/i,
      meaning: "What is up? How is everything going?",
      tip: "To say 'enthokke und vishesham' in English, say: 'How's it going?' or 'What's new?'",
    },
    {
      pattern: /\b(sukhamano|sukham\s+aano|sukham\s+alle|sukham\s+thanne)\b/i,
      meaning: "How are you? Are you doing well?",
      tip: "To ask 'sukhamano' in English, say: 'How are you doing today?'",
    },
    {
      pattern: /\b(food\s+kazhicho|lunch\s+kazhicho|dinner\s+kazhicho|choru\s+kazhicho|kazhicho)\b/i,
      meaning: "Did you have food? Have you eaten yet?",
      tip: "To ask 'food kazhicho' in English, say: 'Have you had lunch yet?' or 'Did you eat?'",
    },
    {
      pattern: /\b(ith(?:u)?\s+engane\s+(?:english(?:il)?\s+)?parayum|engane\s+parayum)\b/i,
      meaning: "How do I say this in English?",
      tip: "You can ask: 'How do you say this in English?'",
    },
    {
      pattern: /\b(njan|njaan)\s+(?:english\s+)?(?:padikkan|padikkanam|padikkan\s+aagrahikkunnu)\b/i,
      meaning: "I want to learn English.",
      tip: "Say: 'I want to improve my English speaking skills.'",
    },
    {
      pattern: /\b(oru\s+doubt(?:\s+und)?|oru\s+chodyam\s+chodichotte|doubt\s+chodikkam)\b/i,
      meaning: "May I ask a question or doubt?",
      tip: "In English, instead of saying 'I have a doubt', native speakers usually say: 'I have a question.'",
    },
    {
      pattern: /\b(njan|njaan)\s+(?:innale|yesterday)\s+(?:office-?il|veettil|college-?il)\s+(?:poyi|aayirunnu)\b/i,
      meaning: "I was at the office yesterday.",
      tip: "Say: 'I was at the office yesterday.'",
    },
    {
      pattern: /\b(njan|njaan)\s+office-?il\s+(?:aanu|aayirunnu)\b/i,
      meaning: "I am at the office.",
      tip: "Say: 'I am currently at the office.'",
    },
    {
      pattern: /\b(njan|njaan)\s+veettil\s+(?:aanu|ethi)\b/i,
      meaning: "I am at home / I reached home.",
      tip: "Say: 'I am at home now.'",
    },
    {
      pattern: /\b(njan|njaan)\s+train-?il\s+aanu\b/i,
      meaning: "I am on the train.",
      tip: "In English, remember to say 'on the train', not 'in the train'.",
    },
    {
      pattern: /\b(njan|njaan)\s+naale\s+varilla\b/i,
      meaning: "I will not come tomorrow.",
      tip: "Say: 'I won't be able to come tomorrow.'",
    },
    {
      pattern: /\b(ith(?:u)?\s+(?:correct\s+aano|thettundo|mistake\s+undo))\b/i,
      meaning: "Is this correct, or is there any mistake?",
      tip: "Say: 'Is this sentence grammatically correct?'",
    },
    {
      pattern: /\b(english\s+(?:speak|talk)\s+cheyyan\s+help\s+cheyyumo)\b/i,
      meaning: "Can you help me practice speaking English?",
      tip: "Say: 'Could you please help me practice speaking English?'",
    },
    {
      pattern: /\b(office-?il\s+late\s+aayi|late\s+aayi\s+poyi)\b/i,
      meaning: "I was late to the office.",
      tip: "Say: 'I got delayed on the way to the office.'",
    },
    {
      pattern: /\b(valare\s+nanni|nanni\s+und)\b/i,
      meaning: "Thank you very much!",
      tip: "Say: 'Thank you so much!'",
    },
  ];

  for (const item of directPhrases) {
    if (item.pattern.test(lower)) {
      return { isManglish: true, englishMeaning: item.meaning, naturalTip: item.tip };
    }
  }

  // 2. Detect common Manglish vocabulary tokens
  const manglishTokenPattern = /\b(njan|njaan|ente|enikku|enikk|ningal|ningalkk|avide|ivide|evide|entha|enthaanu|enthina|enthokke|vishesham|sukham|sukhamano|kazhicho|kazhichu|cheyyo|cheyyam|cheyyan|cheythatha|poyi|pokum|pokunnu|varum|vannu|undo|und|illa|athe|alla|alle|engane|engana|eppol|eppozha|chodyam|padikkan|padipikku|parayum|parayamo|veettil|thettundo|thettu|ariyilla|ariyumo|aagrahikkunnu|aano|aanu|aayirunnu|kandu|nokkam|sherikkum|karyam|pinnentha|pinne|nanni)\b/i;

  if (manglishTokenPattern.test(lower)) {
    const substituted = lower
      .replace(/\bnjan\b|\bnjaan\b/g, 'I')
      .replace(/\benikk(?:u)?\b/g, 'for me')
      .replace(/\bente\b/g, 'my')
      .replace(/\bningal(?:kku)?\b/g, 'you')
      .replace(/\bkazhicho\b/g, 'did you eat')
      .replace(/\bsukhamano\b/g, 'how are you')
      .replace(/\bvishesham\b/g, 'news')
      .replace(/\bentha(?:anu)?\b/g, 'what is')
      .replace(/\benthokke\b/g, 'what all')
      .replace(/\bevide(?:ya)?\b/g, 'where')
      .replace(/\bengane(?:ya)?\b/g, 'how')
      .replace(/\bpoyi\b/g, 'went')
      .replace(/\bvarum\b/g, 'will come')
      .replace(/\baanu\b/g, 'is')
      .replace(/\baayirunnu\b/g, 'was')
      .replace(/\billa\b/g, 'not')
      .replace(/\bundo\b/g, 'is there')
      .replace(/\bund\b/g, 'have')
      .replace(/\bpadikkan\b/g, 'to learn')
      .replace(/\bparayum\b/g, 'say')
      .replace(/\bthettundo\b/g, 'is it wrong')
      .replace(/\bcheyyo\b/g, 'will do')
      .replace(/\bcheyyan\b/g, 'to do')
      .replace(/\bhelp\s+cheyyumo\b/g, 'can you help');

    return {
      isManglish: true,
      englishMeaning: substituted.trim(),
      naturalTip: 'You used Manglish! Practice expressing this in natural English.',
    };
  }

  return { isManglish: false };
}

export async function translateNativeToEnglish(
  text: string,
  preferredLanguage: string,
  context?: string
): Promise<TranslationResult> {
  const trimmed = text.trim();
  const sourceLangCode = getLanguageCode(preferredLanguage);

  // 1. Manglish and Mixed Malayalam-English Detection
  const manglishCheck = resolveManglishAndMixed(trimmed);
  if (manglishCheck.isManglish && manglishCheck.englishMeaning) {
    const natural = naturalizeEnglish(manglishCheck.englishMeaning);
    return {
      detectedLanguage: 'Manglish (Malayalam)',
      nativeText: trimmed,
      englishText: natural,
      phoneticGuide: generatePhoneticGuide(natural),
      breakdown: [],
      naturalTip: manglishCheck.naturalTip || 'Practice speaking this in natural English!',
      confidence: 0.96,
    };
  }

  // 2. DO NOT OVER-TRANSLATE: Check if user input is already pure English
  const isPureEnglish = /^[a-zA-Z0-9\s.,!?'"-]+$/.test(trimmed);
  if (isPureEnglish && trimmed.split(/\s+/).length <= 4) {
    const natural = naturalizeEnglish(trimmed);
    return {
      detectedLanguage: 'English',
      nativeText: trimmed,
      englishText: natural,
      phoneticGuide: generatePhoneticGuide(natural),
      breakdown: [],
      naturalTip: 'Already natural English! Practice speaking it aloud.',
      confidence: 0.98,
    };
  }

  // 3. High-Quality AI LLM Translation (Tier 1: Google Gemini API)
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
    ];
    for (const model of candidateModels) {
      try {
        const strictInstruction = `You are a highly accurate multilingual translation engine.
Translate the user's sentence from ${preferredLanguage} into natural, grammatically correct English.
First understand the complete meaning and context of the sentence.
Do not translate word-by-word.
Preserve the user's intended meaning.
Do not invent information.
Do not remove important information.
Do not add information that was not present.
If the source sentence is informal or conversational, produce natural conversational English.
If the source contains an idiom or expression, translate its meaning rather than translating the individual words literally.
If the source sentence is ambiguous, preserve the ambiguity rather than guessing an unrelated meaning.
Handle code-switching (e.g. Malayalam mixed with English words, or Manglish in Latin alphabet) naturally.
${context ? `Context of conversation: "${context}"` : ''}

User's sentence: "${trimmed}"

Respond in JSON only with format:
{
  "detectedLanguage": "${preferredLanguage}",
  "englishText": "Natural, grammatically correct English translation preserving full meaning",
  "phoneticGuide": "Easy phonetic breakdown for beginners like eye am HUHNG-gree",
  "breakdown": [{"word": "native phrase", "meaning": "English meaning"}],
  "naturalTip": "1 short practical tip about how to use this English phrase naturally",
  "confidence": 0.95,
  "didYouMean": [] // include alternative interpretations if ambiguous, otherwise empty array
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: strictInstruction }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            const cleanJson = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed?.englishText) {
              const natural = naturalizeEnglish(parsed.englishText);
              return {
                detectedLanguage: parsed.detectedLanguage || preferredLanguage,
                nativeText: trimmed,
                englishText: natural,
                phoneticGuide: parsed.phoneticGuide || generatePhoneticGuide(natural),
                breakdown: parsed.breakdown || [],
                naturalTip: parsed.naturalTip || 'Practice saying this sentence aloud to build muscle memory.',
                confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.95,
                didYouMean: parsed.didYouMean || [],
              };
            }
          }
        }
      } catch (err) {
        console.warn(`[AI] Gemini ${model} translation notice:`, err);
      }
    }
  }

  // 3. Full-Sentence Neural Translation Engine (Tier 2: Full Syntax & Meaning Translation)
  const neuralResult = await fetchNeuralTranslation(trimmed, sourceLangCode);
  if (neuralResult) {
    const phonetic = generatePhoneticGuide(neuralResult);
    return {
      detectedLanguage: preferredLanguage,
      nativeText: trimmed,
      englishText: neuralResult,
      phoneticGuide: phonetic,
      breakdown: [],
      naturalTip: 'Speak naturally in short sentences to practice your pronunciation!',
      confidence: 0.92,
    };
  }

  // 4. Uncertainty & Graceful Fallback
  return {
    detectedLanguage: preferredLanguage,
    nativeText: trimmed,
    englishText: naturalizeEnglish(trimmed),
    phoneticGuide: generatePhoneticGuide(trimmed),
    breakdown: [],
    naturalTip: 'We are not completely sure what was said. Try speaking clearly or clicking Edit.',
    confidence: 0.4,
    didYouMean: ['Could you please say that again?', 'Try speaking in a quieter room.'],
  };
}

export async function chatWithAITutor(
  userMessage: string,
  userLanguage: string = 'Malayalam',
  englishLevel: string = 'COMPLETE_BEGINNER',
  history: { role: 'user' | 'assistant'; text: string }[] = []
): Promise<TutorResponse> {
  const trimmed = userMessage.trim();
  const userLangCode = getLanguageCode(userLanguage);

  // 1. Precise Language & Input Type Detection
  const manglishData = resolveManglishAndMixed(trimmed);
  const isMalayalamScript = /[\u0D00-\u0D7F]/.test(trimmed);
  // Strict rule: ONLY consider it an English attempt if it does NOT contain Malayalam script and is NOT Manglish
  const isEnglishAttempt = !isMalayalamScript && !manglishData.isManglish;

  // 2. Check for smart grammar corrections ONLY when the user attempted an English sentence
  let detectedCorrection: GrammarCorrection | undefined;
  if (isEnglishAttempt) {
    for (const check of GRAMMAR_MISTAKES) {
      if (check.regex.test(trimmed)) {
        const betterReplacement = trimmed.replace(check.regex, check.better);
        detectedCorrection = {
          original: trimmed,
          better: betterReplacement,
          explanation: check.explanation,
        };
        break;
      }
    }
  }

  // 3. Generative AI Engine (Tier 1: Google Gemini API)
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
    ];
    for (const model of candidateModels) {
      try {
        const conversationContext = history
          .slice(-8)
          .map((h) => `${h.role === 'user' ? 'Learner' : 'Coach Maya'}: ${h.text}`)
          .join('\n');

        const prompt = `You are Coach Maya, an encouraging, remarkably smart, empathetic, and friendly English teacher for LinguaLearn.
Learner's Native Language: ${userLanguage}
Learner's English Proficiency: ${englishLevel}

Conversation History:
${conversationContext || 'No previous conversation yet.'}

Learner's Latest Message: "${trimmed}"

PEDAGOGICAL & CONVERSATIONAL RULES:
1. UNDERSTAND ANY INPUT:
   The learner may write in:
   - English (beginner, broken, or standard)
   - Malayalam script (e.g. "എനിക്ക് ഇംഗ്ലീഷ് പഠിക്കാൻ സഹായിക്കുമോ", "സുഖമാണോ?")
   - Manglish / Latin-script Malayalam (e.g. "ente per shukoor aan", "enikku english padikkan sahayikkumo", "food kazhicho?", "enikku english ariyilla", "njan innu schoolil poyi", "ente english correct aano?")
   - Mixed Malayalam-English code-switching.
   Always accurately understand their true intent and meaning.

2. TEACHER BEHAVIOR & RESPONSE STYLE:
   - Act as a real, warm, supportive English teacher.
   - Reply directly in natural, friendly English (1 to 3 sentences maximum) appropriate for their level.
   - If they wrote in Malayalam or Manglish, acknowledge their thought warmly and teach them how to express that in natural English:
     * For "എനിക്ക് ഇംഗ്ലീഷ് പഠിക്കാൻ സഹായിക്കുമോ":
       Reply: "Yes, of course! I would love to help you learn English. We can start with simple daily conversations. How are you doing today?"
     * For "ente per shukoor aan":
       Reply: "Nice to meet you, Shukoor! In English, you can say: 'My name is Shukoor.' How are you doing today?"
     * For "enikku english padikkan sahayikkumo":
       Reply: "Hello! I would love to help you learn English. We can practice simple conversations together every day. How are you doing today?"
     * For "food kazhicho?":
       Reply: "Yes, I have eaten, thank you for asking! In English, you can say: 'Have you had food?' or 'Did you eat?' What did you have today?"
     * For "enikku english ariyilla":
       Reply: "Don't worry at all! We will learn step by step together. In English, you can say: 'I don't know English well yet.' Are you ready to start with simple words?"
     * For "njan innu schoolil poyi":
       Reply: "That's great! In English, you can say: 'I went to school today.' What was your favorite class today?"
     * For "ente english correct aano?":
       Reply: "You are doing great! In English, you can ask: 'Is my English correct?' Tell me any sentence, and I will gladly check it for you."
     * For normal greetings like "Hello" or "How are you?":
       Reply warmly in natural English without any correction card.

3. STRICT SMART CORRECTION RULES:
   - ONLY provide a "correction" object if the user attempted an English sentence AND made an English grammatical/tense/preposition error (e.g. "He don't like tea" -> "He doesn't like tea", "I am go school yesterday" -> "I went to school yesterday").
   - NEVER provide a "correction" object for Malayalam script or Manglish messages! For those, set "correction": null.
   - NEVER provide a "correction" object if the user's English is already correct (e.g. "Hello", "How are you?"). Set "correction": null.

4. CLEAN UI & AVOID DUPLICATION:
   - Keep English as the primary response language.
   - In "replyNative", provide ONLY a brief 1-sentence Malayalam greeting, summary, or encouragement (e.g. "തീർച്ചയായും! നമുക്ക് ഒരുമിച്ച് ഇംഗ്ലീഷ് പഠിക്കാം."). NEVER duplicate or re-translate the entire English paragraph twice.
   - NEVER output any HTML, SVG, XML tags, or the word "svg" or markdown formatting artifacts.

5. SUGGESTIONS:
   - Provide 3 short, natural English sentences the learner can say or click next.

Return PURE JSON ONLY with this schema:
{
  "replyEnglish": "your clear English reply",
  "replyNative": "short 1-sentence Malayalam summary or encouragement",
  "correction": null or {"original": "learner's English mistake", "better": "corrected English sentence", "explanation": "friendly 1-sentence rule tip"},
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.6,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            const cleanJson = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed?.replyEnglish) {
              const sanitizedEnglish = sanitizeTutorText(parsed.replyEnglish);
              const sanitizedNative = parsed.replyNative ? sanitizeTutorText(parsed.replyNative) : '';

              // Strict safety: NEVER allow a correction if it was not an English sentence attempt!
              let finalCorrection: GrammarCorrection | undefined = undefined;
              if (isEnglishAttempt) {
                if (
                  parsed.correction &&
                  typeof parsed.correction === 'object' &&
                  parsed.correction.better &&
                  parsed.correction.original &&
                  parsed.correction.better.toLowerCase().trim() !== trimmed.toLowerCase().trim()
                ) {
                  finalCorrection = {
                    original: sanitizeTutorText(parsed.correction.original),
                    better: sanitizeTutorText(parsed.correction.better),
                    explanation: sanitizeTutorText(parsed.correction.explanation || ''),
                  };
                } else if (detectedCorrection) {
                  finalCorrection = detectedCorrection;
                }
              }

              return {
                replyEnglish: naturalizeEnglish(sanitizedEnglish),
                replyNative: sanitizedNative,
                correction: finalCorrection,
                suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
                  ? parsed.suggestions.map((s: string) => sanitizeTutorText(s)).slice(0, 3)
                  : ['Tell me more!', 'How do I pronounce that?', 'Can we try another sentence?'],
              };
            }
          }
        } else {
          console.warn(`[AI] Gemini model ${model} returned status: ${res.status}`);
        }
      } catch (modelErr) {
        console.warn(`[AI] Gemini ${model} invocation notice:`, modelErr);
      }
    }
  }

  // 4. High-Precision Conversational Intelligence Fallback Engine (Zero External Key Needed)
  let englishMeaning = trimmed;
  if (manglishData.isManglish && manglishData.englishMeaning) {
    englishMeaning = manglishData.englishMeaning;
  } else if (isMalayalamScript) {
    const neuralMeaning = await fetchNeuralTranslation(trimmed, userLangCode, 'en');
    if (neuralMeaning) englishMeaning = neuralMeaning;
  }

  const cleanLower = englishMeaning.toLowerCase().replace(/[^\w\s]/g, ' ').trim();

  let replyEnglish = '';
  let replyNative = '';
  let suggestions: string[] = [];

  // --- Case 0: Name Introductions ("ente per shukoor aan") ---
  if (manglishData.extractedName || cleanLower.startsWith('my name is')) {
    const name = manglishData.extractedName || cleanLower.replace(/^my name is\s+/i, '').trim();
    const capName = name.charAt(0).toUpperCase() + name.slice(1);
    replyEnglish = `Nice to meet you, ${capName}! In English, you can say: "My name is ${capName}." How are you doing today?`;
    replyNative = `നിങ്ങളെ പരിചയപ്പെട്ടതിൽ സന്തോഷം, ${capName}!`;
    suggestions = ['Nice to meet you too!', 'How are you, Coach Maya?', 'I want to learn English.'];
  }

  // --- Case 1: Help Learn English ("enikku english padikkan sahayikkumo" or Malayalam script) ---
  if (!replyEnglish && (cleanLower.includes('help me learn english') || /പഠിക്കാൻ സഹായിക്കുമോ/i.test(trimmed))) {
    replyEnglish = `Yes, of course! I would love to help you learn English. We can start with simple daily conversations. How are you doing today?`;
    replyNative = `തീർച്ചയായും! നിങ്ങളെ ഇംഗ്ലീഷ് പഠിക്കാൻ സഹായിക്കുന്നതിൽ എനിക്ക് വലിയ സന്തോഷമുണ്ട്.`;
    suggestions = ['I am doing great!', 'Can we practice now?', 'How do we start?'];
  }

  // --- Case 2: I don't know English ("enikku english ariyilla") ---
  if (!replyEnglish && (cleanLower.includes('dont know english') || cleanLower.includes("don't know english") || /അറിയില്ല/i.test(trimmed))) {
    replyEnglish = `Don't worry at all! We will learn step by step together. In English, you can say: "I don't know English well yet." Are you ready to start with simple words?`;
    replyNative = `വിഷമിക്കേണ്ടതില്ല! നമുക്ക് ഒന്നിച്ച് പടിപടിയായി പഠിക്കാം.`;
    suggestions = ['Yes, I am ready!', 'Teach me simple words.', 'Thank you Coach Maya.'];
  }

  // --- Case 3: I went to school today ("njan innu schoolil poyi") ---
  if (!replyEnglish && (cleanLower.includes('went to school') || /സ്കൂളിൽ പോയി/i.test(trimmed))) {
    replyEnglish = `That's great! In English, you can say: "I went to school today." What was your favorite class today?`;
    replyNative = `വളരെ നല്ലത്! സ്കൂളിൽ ഇന്ന് ഏത് ക്ലാസ്സാണ് കൂടുതൽ ഇഷ്ടപ്പെട്ടത്?`;
    suggestions = ['I enjoyed English class.', 'Science was interesting.', 'I played with my friends.'];
  }

  // --- Case 4: Is my English correct? ("ente english correct aano?") ---
  if (!replyEnglish && (cleanLower.includes('is my english correct') || /കറക്റ്റ് ആണോ/i.test(trimmed))) {
    replyEnglish = `You are doing great! In English, you can ask: "Is my English correct?" Tell me any sentence, and I will gladly check it for you.`;
    replyNative = `നിങ്ങൾ നന്നായി ചെയ്യുന്നുണ്ട്! ഏത് വാക്യമാണ് പരിശോധിക്കേണ്ടത്?`;
    suggestions = ['Can you check my sentence?', 'Teach me a daily phrase.', 'Is my grammar right?'];
  }

  // --- Case 5: Food eaten? ("food kazhicho?") ---
  if (!replyEnglish && (cleanLower.includes('did you eat') || cleanLower.includes('have you eaten') || cleanLower.includes('had food') || /കഴിച്ചോ/i.test(trimmed))) {
    replyEnglish = `Yes, I have eaten, thank you for asking! In English, to ask "food kazhicho", you can say: "Have you had food?" or "Did you eat?" What did you have to eat today?`;
    replyNative = `അതെ, ചോദിച്ചതിന് നന്ദി! നിങ്ങൾ ഇന്ന് എന്താണ് കഴിച്ചത്?`;
    suggestions = ['I had rice and fish curry.', 'I just had some tea.', 'I have not eaten yet.'];
  }

  // --- Case 6: Manglish Conversational Expressions ---
  if (!replyEnglish && manglishData.isManglish) {
    if (cleanLower.includes('how is everything going') || cleanLower.includes('what is up')) {
      replyEnglish = `I am doing wonderfully, thank you! In English, to say "enthokke und vishesham", you can say: "How is everything going?" or "What's new?" How has your day been?`;
      replyNative = `എനിക്ക് സുഖമാണ്, നന്ദി! നിങ്ങളുടെ ദിവസം എങ്ങനെയുണ്ടായിരുന്നു?`;
      suggestions = ['Everything is going great!', 'I had a busy day.', 'What about you, Coach Maya?'];
    } else if (cleanLower.includes('how are you') || cleanLower.includes('are you doing well')) {
      replyEnglish = `I am doing very well! To ask someone "sukhamano" in English, you can say: "How are you doing today?" or "I hope you are doing well!" How are you feeling today?`;
      replyNative = `എനിക്ക് സുഖമാണ്! ഇന്ന് നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?`;
      suggestions = ['I am feeling happy today.', 'I am a bit tired.', 'I am ready to learn English!'];
    } else if (cleanLower.includes('i want to learn english')) {
      replyEnglish = `That is fantastic! In English, you can say: "I want to speak fluent English." You are in the right place! What would you like to practice first?`;
      replyNative = `വളരെ സന്തോഷം! നമുക്ക് സംസാരിച്ചു തുടങ്ങാം.`;
      suggestions = ['I want to practice daily conversation.', 'Teach me common phrases.', 'Can you correct my grammar?'];
    } else if (cleanLower.includes('can i ask a question') || cleanLower.includes('doubt')) {
      replyEnglish = `Of course! In English, native speakers usually say: "I have a question" rather than "I have a doubt". What question would you like to ask me?`;
      replyNative = `തീർച്ചയായും! എന്താണ് നിങ്ങളുടെ ചോദ്യം?`;
      suggestions = ['How do I introduce myself?', 'What does this word mean?', 'How can I practice speaking?'];
    } else if (cleanLower.includes('can you help me practice speaking english')) {
      replyEnglish = `I would love to help you practice! In English, you can say: "Could you please help me practice speaking English?" Tell me about your day!`;
      replyNative = `തീർച്ചയായും സഹായിക്കാം! നിങ്ങളുടെ ദിവസത്തെക്കുറിച്ച് പറയൂ.`;
      suggestions = ['I had a good day.', 'I learned something new.', 'Tell me about yourself.'];
    }
  }

  // --- Case 7: English Grammar Corrections (ONLY for English attempts) ---
  if (!replyEnglish && isEnglishAttempt && detectedCorrection) {
    replyEnglish = `Almost! A more natural way to say that is: "${detectedCorrection.better}". Remember: ${detectedCorrection.explanation}`;
    replyNative = `നല്ല ശ്രമം! ഇത് ഇംഗ്ലീഷിൽ സ്വാഭാവികമായി പറയാൻ ശ്രദ്ധിക്കൂ.`;
    suggestions = [detectedCorrection.better, 'Thank you for correcting me!', 'Can you give another example?'];
  }

  // --- Case 8: Everyday English Greetings & Common Small Talk ---
  if (!replyEnglish) {
    if (cleanLower.includes('how are you')) {
      replyEnglish = `Hello! I am doing very well, thank you for asking! How are you doing today?`;
      replyNative = `ഹലോ! എനിക്ക് സുഖമാണ്, ചോദിച്ചതിന് നന്ദി. നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?`;
      suggestions = ['I am doing great!', 'I am ready to learn.', 'What is your name?'];
    } else if (cleanLower.includes('hello') || cleanLower.includes('hi') || cleanLower.includes('hey') || cleanLower.includes('good morning') || cleanLower.includes('good evening')) {
      replyEnglish = `Hello! It is wonderful to talk with you. I am Coach Maya. What would you like to practice today — daily conversation, ordering food, or learning new words?`;
      replyNative = `ഹലോ! നിങ്ങളോട് സംസാരിക്കുന്നതിൽ സന്തോഷം. ഞാൻ കോച്ച് മായയാണ്.`;
      suggestions = ['I want to practice speaking.', 'Let us learn new vocabulary.', 'How are you today, Maya?'];
    } else if (cleanLower.includes('thank') || cleanLower.includes('appreciate')) {
      replyEnglish = `You are very welcome! Seeing your English grow brings me immense joy. Whenever someone thanks you, you can say: "You are most welcome!" or "My pleasure!"`;
      replyNative = `സ്വാഗതം! നിങ്ങളുടെ ഇംഗ്ലീഷ് മെച്ചപ്പെടുന്നത് കാണുന്നതിൽ സന്തോഷമുണ്ട്.`;
      suggestions = ['Teach me five new everyday words.', 'Can we practice another conversation?', 'Thank you Maya!'];
    } else if (cleanLower.includes('who are you') || cleanLower.includes('what is your name')) {
      replyEnglish = `I am Coach Maya, your friendly AI English tutor here at LinguaLearn! My goal is to help you speak fluent, confident English step by step. How are you today?`;
      replyNative = `ഞാൻ ലിംഗ്വാലേണിലെ നിങ്ങളുടെ എഐ ഇംഗ്ലീഷ് അധ്യാപികയായ കോച്ച് മായയാണ്!`;
      suggestions = ['Nice to meet you, Maya!', 'Can you teach me English?', 'How do I start?'];
    }
  }

  // --- Case 9: Smart Fallback ---
  if (!replyEnglish) {
    const naturalPhrase = naturalizeEnglish(englishMeaning);
    replyEnglish = `That is great! A clear way to express this in English is: "${naturalPhrase}". Try saying it aloud!`;
    replyNative = `ഇത് ഇംഗ്ലീഷിൽ സ്വാഭാവികമായി പറയാൻ പരിശീലിക്കൂ!`;
    suggestions = [naturalPhrase, 'Can you explain that again?', 'What should I say next?'];
  }

  if (!replyNative) {
    replyNative = userLanguage === 'Malayalam'
      ? 'ഇത് ഇംഗ്ലീഷിൽ സ്വാഭാവികമായി പറയാൻ പരിശീലിക്കൂ!'
      : 'Practice saying this naturally in English!';
  }

  return {
    replyEnglish: sanitizeTutorText(replyEnglish),
    replyNative: sanitizeTutorText(replyNative),
    correction: isEnglishAttempt ? detectedCorrection : undefined,
    suggestions: suggestions.map((s) => sanitizeTutorText(s)).slice(0, 3),
  };
}

