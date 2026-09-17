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
  category: string;
}

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    "id": "word-0",
    "word": "Hello",
    "partOfSpeech": "noun",
    "phonetic": "heh-LOH",
    "emoji": "👋",
    "simpleDefinition": "A common greeting.",
    "exampleSentence": "I understand the meaning of Hello.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "basics"
  },
  {
    "id": "word-1",
    "word": "Please",
    "partOfSpeech": "noun",
    "phonetic": "PLEEZ",
    "emoji": "🙏",
    "simpleDefinition": "Used to ask politely.",
    "exampleSentence": "I understand the meaning of Please.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "basics"
  },
  {
    "id": "word-2",
    "word": "Thank you",
    "partOfSpeech": "noun",
    "phonetic": "THANGK yoo",
    "emoji": "😊",
    "simpleDefinition": "Expression of gratitude.",
    "exampleSentence": "I understand the meaning of Thank you.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "basics"
  },
  {
    "id": "word-3",
    "word": "Water",
    "partOfSpeech": "noun",
    "phonetic": "WAH-ter",
    "emoji": "💧",
    "simpleDefinition": "Clear liquid for drinking.",
    "exampleSentence": "I understand the meaning of Water.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "food"
  },
  {
    "id": "word-4",
    "word": "Food",
    "partOfSpeech": "noun",
    "phonetic": "FOOD",
    "emoji": "🍞",
    "simpleDefinition": "Things people eat.",
    "exampleSentence": "I understand the meaning of Food.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "food"
  },
  {
    "id": "word-5",
    "word": "Friend",
    "partOfSpeech": "noun",
    "phonetic": "FREND",
    "emoji": "🤝",
    "simpleDefinition": "A person you like and know well.",
    "exampleSentence": "I understand the meaning of Friend.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "family"
  },
  {
    "id": "word-6",
    "word": "Family",
    "partOfSpeech": "noun",
    "phonetic": "FAM-ih-lee",
    "emoji": "👪",
    "simpleDefinition": "Parents and children.",
    "exampleSentence": "I understand the meaning of Family.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "family"
  },
  {
    "id": "word-7",
    "word": "Time",
    "partOfSpeech": "noun",
    "phonetic": "TYM",
    "emoji": "⌚",
    "simpleDefinition": "Measured in hours and minutes.",
    "exampleSentence": "I understand the meaning of Time.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "everyday"
  },
  {
    "id": "word-8",
    "word": "Money",
    "partOfSpeech": "noun",
    "phonetic": "MUN-ee",
    "emoji": "💵",
    "simpleDefinition": "Coins and banknotes used to buy things.",
    "exampleSentence": "I understand the meaning of Money.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "everyday"
  },
  {
    "id": "word-9",
    "word": "Work",
    "partOfSpeech": "noun",
    "phonetic": "WERK",
    "emoji": "💼",
    "simpleDefinition": "Activity involving mental or physical effort.",
    "exampleSentence": "I understand the meaning of Work.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "action"
  },
  {
    "id": "word-10",
    "word": "Learn",
    "partOfSpeech": "noun",
    "phonetic": "LERN",
    "emoji": "📖",
    "simpleDefinition": "Gain knowledge or skill.",
    "exampleSentence": "I understand the meaning of Learn.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "action"
  },
  {
    "id": "word-11",
    "word": "Happy",
    "partOfSpeech": "noun",
    "phonetic": "HAP-ee",
    "emoji": "😄",
    "simpleDefinition": "Feeling or showing pleasure.",
    "exampleSentence": "I understand the meaning of Happy.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "emotions"
  },
  {
    "id": "word-12",
    "word": "Sad",
    "partOfSpeech": "noun",
    "phonetic": "SAD",
    "emoji": "😢",
    "simpleDefinition": "Feeling sorrow.",
    "exampleSentence": "I understand the meaning of Sad.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "emotions"
  },
  {
    "id": "word-13",
    "word": "Beautiful",
    "partOfSpeech": "noun",
    "phonetic": "BYOO-tih-ful",
    "emoji": "✨",
    "simpleDefinition": "Pleasing the senses or mind.",
    "exampleSentence": "I understand the meaning of Beautiful.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "adjectives"
  },
  {
    "id": "word-14",
    "word": "Important",
    "partOfSpeech": "noun",
    "phonetic": "im-POR-tunt",
    "emoji": "❗",
    "simpleDefinition": "Of great significance or value.",
    "exampleSentence": "I understand the meaning of Important.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "adjectives"
  },
  {
    "id": "word-15",
    "word": "Experience",
    "partOfSpeech": "noun",
    "phonetic": "ik-SPEER-ee-uns",
    "emoji": "🧠",
    "simpleDefinition": "Knowledge gained through doing things.",
    "exampleSentence": "I understand the meaning of Experience.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "advanced"
  },
  {
    "id": "word-16",
    "word": "Opportunity",
    "partOfSpeech": "noun",
    "phonetic": "op-er-TOO-nih-tee",
    "emoji": "🌟",
    "simpleDefinition": "A chance to do something.",
    "exampleSentence": "I understand the meaning of Opportunity.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "advanced"
  },
  {
    "id": "word-17",
    "word": "Negotiate",
    "partOfSpeech": "noun",
    "phonetic": "nih-GO-shee-ayt",
    "emoji": "👔",
    "simpleDefinition": "Discuss to reach an agreement.",
    "exampleSentence": "I understand the meaning of Negotiate.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "business"
  },
  {
    "id": "word-18",
    "word": "Strategy",
    "partOfSpeech": "noun",
    "phonetic": "STRAT-uh-jee",
    "emoji": "📈",
    "simpleDefinition": "A plan of action.",
    "exampleSentence": "I understand the meaning of Strategy.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "business"
  },
  {
    "id": "word-19",
    "word": "Ubiquitous",
    "partOfSpeech": "noun",
    "phonetic": "yoo-BIK-wih-tus",
    "emoji": "🌍",
    "simpleDefinition": "Found everywhere.",
    "exampleSentence": "I understand the meaning of Ubiquitous.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "expert"
  },
  {
    "id": "word-20",
    "word": "Ephemeral",
    "partOfSpeech": "noun",
    "phonetic": "ih-FEM-er-ul",
    "emoji": "⏳",
    "simpleDefinition": "Lasting for a very short time.",
    "exampleSentence": "I understand the meaning of Ephemeral.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "expert"
  },
  {
    "id": "word-21",
    "word": "Paradigm",
    "partOfSpeech": "noun",
    "phonetic": "PAIR-uh-dime",
    "emoji": "🧩",
    "simpleDefinition": "A typical example or pattern.",
    "exampleSentence": "I understand the meaning of Paradigm.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "expert"
  },
  {
    "id": "word-22",
    "word": "Eloquent",
    "partOfSpeech": "noun",
    "phonetic": "EL-uh-kwunt",
    "emoji": "🗣️",
    "simpleDefinition": "Fluent or persuasive in speaking.",
    "exampleSentence": "I understand the meaning of Eloquent.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "expert"
  },
  {
    "id": "word-23",
    "word": "Resilient",
    "partOfSpeech": "noun",
    "phonetic": "rih-ZIL-yunt",
    "emoji": "💪",
    "simpleDefinition": "Able to withstand or recover quickly.",
    "exampleSentence": "I understand the meaning of Resilient.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "expert"
  },
  {
    "id": "word-24",
    "word": "Meticulous",
    "partOfSpeech": "noun",
    "phonetic": "muh-TIK-yuh-lus",
    "emoji": "🔎",
    "simpleDefinition": "Showing great attention to detail.",
    "exampleSentence": "I understand the meaning of Meticulous.",
    "exampleTranslation": "Comprendo el significado.",
    "translations": {
      "Spanish": "Traducción"
    },
    "category": "expert"
  }
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
