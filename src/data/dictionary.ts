export interface DictionaryEntry {
  id: string;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  emoji: string;
  simpleDefinition: string;
  exampleSentence: string;
  exampleTranslation: string;
  translations: Record<string, string>;
  category: 'everyday' | 'food' | 'family' | 'places' | 'action' | 'emotions';
}

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    id: 'd-apple',
    word: 'Apple',
    partOfSpeech: 'noun',
    phonetic: 'AP-pul',
    emoji: '🍎',
    simpleDefinition: 'A round fruit with red, green, or yellow skin and a white inside.',
    exampleSentence: 'She eats a sweet red apple every morning.',
    exampleTranslation: 'അവൾ എല്ലാ ദിവസവും രാവിലെ ഒരു മധുരമുള്ള ചുവന്ന ആപ്പിൾ കഴിക്കുന്നു.',
    translations: {
      Malayalam: 'ആപ്പിൾ',
      Hindi: 'सेब',
      Tamil: 'ஆப்பிள்',
      Telugu: 'ఆపిల్',
      Spanish: 'Manzana',
      French: 'Pomme',
      German: 'Apfel',
      Arabic: 'تفاحة',
    },
    category: 'food',
  },
  {
    id: 'd-beautiful',
    word: 'Beautiful',
    partOfSpeech: 'adjective',
    phonetic: 'BYOO-tih-ful',
    emoji: '🌸',
    simpleDefinition: 'Pleasing the senses or mind aesthetically; very pretty.',
    exampleSentence: 'She has a beautiful dress.',
    exampleTranslation: 'അവൾക്ക് മനോഹരമായ ഒരു വസ്ത്രമുണ്ട്.',
    translations: {
      Malayalam: 'മനോഹരമായ / സുന്ദരമായ',
      Hindi: 'सुंदर / खूबसूरत',
      Tamil: 'அழகான',
      Telugu: 'అందమైన',
      Spanish: 'Hermoso / Hermosa',
      French: 'Beau / Belle',
      German: 'Schön',
      Arabic: 'جميل',
    },
    category: 'emotions',
  },
  {
    id: 'd-water',
    word: 'Water',
    partOfSpeech: 'noun',
    phonetic: 'WAH-ter',
    emoji: '💧',
    simpleDefinition: 'A clear liquid that has no color or taste when pure; essential for life.',
    exampleSentence: 'Please drink plenty of water.',
    exampleTranslation: 'ദയവായി ധാരാളം വെള്ളം കുടിക്കുക.',
    translations: {
      Malayalam: 'വെള്ളം',
      Hindi: 'पानी / जल',
      Tamil: 'தண்ணீர்',
      Telugu: 'మంచి నీరు',
      Spanish: 'Agua',
      French: 'Eau',
      German: 'Wasser',
      Arabic: 'ماء',
    },
    category: 'food',
  },
  {
    id: 'd-friend',
    word: 'Friend',
    partOfSpeech: 'noun',
    phonetic: 'frend',
    emoji: '🤝',
    simpleDefinition: 'A person whom one knows and with whom one has a bond of mutual affection.',
    exampleSentence: 'He is my best friend from school.',
    exampleTranslation: 'അവൻ സ്കൂൾ മുതലുള്ള എന്റെ ഉറ്റ സുഹൃത്താണ്.',
    translations: {
      Malayalam: 'സുഹൃത്ത് / കൂട്ടുകാരൻ',
      Hindi: 'दोस्त / मित्र',
      Tamil: 'நண்பன்',
      Telugu: 'స్నేహితుడు',
      Spanish: 'Amigo',
      French: 'Ami',
      German: 'Freund',
      Arabic: 'صديق',
    },
    category: 'family',
  },
  {
    id: 'd-book',
    word: 'Book',
    partOfSpeech: 'noun',
    phonetic: 'buuk',
    emoji: '📖',
    simpleDefinition: 'A set of printed or written pages bound together.',
    exampleSentence: 'I love to read English books.',
    exampleTranslation: 'എനിക്ക് ഇംഗ്ലീഷ് പുസ്തകങ്ങൾ വായിക്കാൻ ഇഷ്ടമാണ്.',
    translations: {
      Malayalam: 'പുസ്തകം',
      Hindi: 'किताब / पुस्तक',
      Tamil: 'புத்தகம்',
      Telugu: 'పుస్తకం',
      Spanish: 'Libro',
      French: 'Livre',
      German: 'Buch',
      Arabic: 'كتاب',
    },
    category: 'everyday',
  },
  {
    id: 'd-happy',
    word: 'Happy',
    partOfSpeech: 'adjective',
    phonetic: 'HAP-ee',
    emoji: '😊',
    simpleDefinition: 'Feeling or showing pleasure or contentment.',
    exampleSentence: 'We are very happy today.',
    exampleTranslation: 'ഞങ്ങൾ ഇന്ന് വളരെ സന്തോഷവതികളാണ്.',
    translations: {
      Malayalam: 'സന്തോഷമുള്ള',
      Hindi: 'खुश / प्रसन्न',
      Tamil: 'மகிழ்ச்சியான',
      Telugu: 'సంతోషంగా',
      Spanish: 'Feliz',
      French: 'Heureux',
      German: 'Glücklich',
      Arabic: 'سعيد',
    },
    category: 'emotions',
  },
  {
    id: 'd-house',
    word: 'House',
    partOfSpeech: 'noun',
    phonetic: 'hows',
    emoji: '🏠',
    simpleDefinition: 'A building for human habitation, especially one that consists of a ground floor and one or more upper storeys.',
    exampleSentence: 'This house has three big rooms.',
    exampleTranslation: 'ഈ വീട്ടിൽ മൂന്ന് വലിയ മുറികളുണ്ട്.',
    translations: {
      Malayalam: 'വീട്',
      Hindi: 'घर / मकान',
      Tamil: 'வீடு',
      Telugu: 'ఇల్లు',
      Spanish: 'Casa',
      French: 'Maison',
      German: 'Haus',
      Arabic: 'منزل',
    },
    category: 'places',
  },
  {
    id: 'd-school',
    word: 'School',
    partOfSpeech: 'noun',
    phonetic: 'skool',
    emoji: '🏫',
    simpleDefinition: 'An institution for educating children.',
    exampleSentence: 'The children go to school by bus.',
    exampleTranslation: 'കുട്ടികൾ ബസിലാണ് സ്കൂളിൽ പോകുന്നത്.',
    translations: {
      Malayalam: 'സ്കൂൾ / വിദ്യാലയം',
      Hindi: 'स्कूल / विद्यालय',
      Tamil: 'பள்ளி',
      Telugu: 'పాఠశాల',
      Spanish: 'Escuela',
      French: 'École',
      German: 'Schule',
      Arabic: 'مدرسة',
    },
    category: 'places',
  },
  {
    id: 'd-morning',
    word: 'Morning',
    partOfSpeech: 'noun',
    phonetic: 'MOR-ning',
    emoji: '🌅',
    simpleDefinition: 'The period of time between midnight and noon, especially from sunrise to noon.',
    exampleSentence: 'I wake up early in the morning.',
    exampleTranslation: 'ഞാൻ രാവിലെ നേരത്തെ ഉണരും.',
    translations: {
      Malayalam: 'പ്രഭാതം / രാവിലെ',
      Hindi: 'सुबह / प्रातःकाल',
      Tamil: 'காலை',
      Telugu: 'ఉదయం',
      Spanish: 'Mañana',
      French: 'Matin',
      German: 'Morgen',
      Arabic: 'صباح',
    },
    category: 'everyday',
  },
  {
    id: 'd-speak',
    word: 'Speak',
    partOfSpeech: 'verb',
    phonetic: 'speek',
    emoji: '🗣️',
    simpleDefinition: 'Say something in order to convey information or express a feeling.',
    exampleSentence: 'I want to speak English fluently.',
    exampleTranslation: 'എനിക്ക് ഒഴുക്കോടെ ഇംഗ്ലീഷ് സംസാരിക്കണം.',
    translations: {
      Malayalam: 'സംസാരിക്കുക',
      Hindi: 'बोलना',
      Tamil: 'பேசு',
      Telugu: 'మాట్లాడు',
      Spanish: 'Hablar',
      French: 'Parler',
      German: 'Sprechen',
      Arabic: 'تحدث',
    },
    category: 'action',
  },
];

export function searchDictionary(query: string, language: string = 'Malayalam'): DictionaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return DICTIONARY_DATA;

  return DICTIONARY_DATA.filter((item) => {
    if (item.word.toLowerCase().includes(q)) return true;
    if (item.simpleDefinition.toLowerCase().includes(q)) return true;
    const trans = item.translations[language];
    if (trans && trans.toLowerCase().includes(q)) return true;
    // Check all translations
    for (const val of Object.values(item.translations)) {
      if (val.toLowerCase().includes(q)) return true;
    }
    return false;
  });
}
