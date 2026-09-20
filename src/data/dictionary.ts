export interface DictionaryEntry {
  id: string;
  word: string;
  partOfSpeech: string;
  phonetic: string;
  simpleDefinition: string;
  exampleSentence: string;
  translations: Record<string, string>;
  level: string;
}

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    id: "d-word-1",
    word: "hello",
    partOfSpeech: "greeting",
    phonetic: "heh-LOH",
    simpleDefinition: "A word used to greet someone.",
    exampleSentence: "Hello, how are you?",
    translations: {
      "Malayalam": "നമസ്കാരം",
      "Chinese": "你好",
      "Hindi": "नमस्ते",
      "Spanish": "Hola",
      "English": "hello"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-2",
    word: "water",
    partOfSpeech: "noun",
    phonetic: "WAH-ter",
    simpleDefinition: "A clear liquid we drink.",
    exampleSentence: "I need some water.",
    translations: {
      "Malayalam": "വെള്ളം",
      "Chinese": "水",
      "Hindi": "पानी",
      "Spanish": "Agua",
      "English": "water"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-3",
    word: "food",
    partOfSpeech: "noun",
    phonetic: "food",
    simpleDefinition: "What we eat to live.",
    exampleSentence: "The food is delicious.",
    translations: {
      "Malayalam": "ഭക്ഷണം",
      "Chinese": "食物",
      "Hindi": "खाना",
      "Spanish": "Comida",
      "English": "food"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-4",
    word: "home",
    partOfSpeech: "noun",
    phonetic: "hohm",
    simpleDefinition: "The place where you live.",
    exampleSentence: "I am going home.",
    translations: {
      "Malayalam": "വീട്",
      "Chinese": "家",
      "Hindi": "घर",
      "Spanish": "Casa",
      "English": "home"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-5",
    word: "school",
    partOfSpeech: "noun",
    phonetic: "skool",
    simpleDefinition: "A place for learning.",
    exampleSentence: "The kids are at school.",
    translations: {
      "Malayalam": "സ്കൂൾ",
      "Chinese": "学校",
      "Hindi": "स्कूल",
      "Spanish": "Escuela",
      "English": "school"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-6",
    word: "friend",
    partOfSpeech: "noun",
    phonetic: "frend",
    simpleDefinition: "A person you like and trust.",
    exampleSentence: "She is my best friend.",
    translations: {
      "Malayalam": "സുഹൃത്ത്",
      "Chinese": "朋友",
      "Hindi": "दोस्त",
      "Spanish": "Amigo",
      "English": "friend"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-7",
    word: "family",
    partOfSpeech: "noun",
    phonetic: "FAM-ih-lee",
    simpleDefinition: "Parents and children.",
    exampleSentence: "My family is big.",
    translations: {
      "Malayalam": "കുടുംബം",
      "Chinese": "家庭",
      "Hindi": "परिवार",
      "Spanish": "Familia",
      "English": "family"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-8",
    word: "work",
    partOfSpeech: "noun",
    phonetic: "wurk",
    simpleDefinition: "A job or task.",
    exampleSentence: "I have a lot of work.",
    translations: {
      "Malayalam": "ജോലി",
      "Chinese": "工作",
      "Hindi": "काम",
      "Spanish": "Trabajo",
      "English": "work"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-9",
    word: "eat",
    partOfSpeech: "verb",
    phonetic: "eet",
    simpleDefinition: "To consume food.",
    exampleSentence: "Let's eat dinner.",
    translations: {
      "Malayalam": "കഴിക്കുക",
      "Chinese": "吃",
      "Hindi": "खाना",
      "Spanish": "Comer",
      "English": "eat"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-10",
    word: "drink",
    partOfSpeech: "verb",
    phonetic: "dringk",
    simpleDefinition: "To consume liquid.",
    exampleSentence: "Drink more water.",
    translations: {
      "Malayalam": "കുടിക്കുക",
      "Chinese": "喝",
      "Hindi": "पीना",
      "Spanish": "Beber",
      "English": "drink"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-11",
    word: "go",
    partOfSpeech: "verb",
    phonetic: "goh",
    simpleDefinition: "To move to a place.",
    exampleSentence: "I have to go now.",
    translations: {
      "Malayalam": "പോകുക",
      "Chinese": "去",
      "Hindi": "जाना",
      "Spanish": "Ir",
      "English": "go"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-12",
    word: "help",
    partOfSpeech: "verb",
    phonetic: "help",
    simpleDefinition: "To assist someone.",
    exampleSentence: "Can you help me?",
    translations: {
      "Malayalam": "സഹായിക്കുക",
      "Chinese": "帮助",
      "Hindi": "मदद",
      "Spanish": "Ayuda",
      "English": "help"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-13",
    word: "today",
    partOfSpeech: "noun",
    phonetic: "tuh-DAY",
    simpleDefinition: "This current day.",
    exampleSentence: "Today is Monday.",
    translations: {
      "Malayalam": "ഇന്ന്",
      "Chinese": "今天",
      "Hindi": "आज",
      "Spanish": "Hoy",
      "English": "today"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-14",
    word: "tomorrow",
    partOfSpeech: "noun",
    phonetic: "tuh-MOR-oh",
    simpleDefinition: "The day after today.",
    exampleSentence: "See you tomorrow.",
    translations: {
      "Malayalam": "നാളെ",
      "Chinese": "明天",
      "Hindi": "कल",
      "Spanish": "Mañana",
      "English": "tomorrow"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-15",
    word: "communicate",
    partOfSpeech: "verb",
    phonetic: "kuh-MYOO-nih-kayt",
    simpleDefinition: "To share information.",
    exampleSentence: "We need to communicate better.",
    translations: {
      "Malayalam": "ആശയവിനിമയം നടത്തുക",
      "Chinese": "沟通",
      "Hindi": "संवाद करना",
      "Spanish": "Comunicar",
      "English": "communicate"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-16",
    word: "improve",
    partOfSpeech: "verb",
    phonetic: "im-PROOV",
    simpleDefinition: "To make something better.",
    exampleSentence: "I want to improve my English.",
    translations: {
      "Malayalam": "മെച്ചപ്പെടുത്തുക",
      "Chinese": "改善",
      "Hindi": "सुधारना",
      "Spanish": "Mejorar",
      "English": "improve"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-17",
    word: "experience",
    partOfSpeech: "noun",
    phonetic: "ik-SPEER-ee-ens",
    simpleDefinition: "Knowledge gained by doing.",
    exampleSentence: "She has a lot of experience.",
    translations: {
      "Malayalam": "അനുഭവം",
      "Chinese": "经验",
      "Hindi": "अनुभव",
      "Spanish": "Experiencia",
      "English": "experience"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-18",
    word: "opportunity",
    partOfSpeech: "noun",
    phonetic: "op-er-TOO-nih-tee",
    simpleDefinition: "A chance to do something.",
    exampleSentence: "This is a great opportunity.",
    translations: {
      "Malayalam": "അവസരം",
      "Chinese": "机会",
      "Hindi": "अवसर",
      "Spanish": "Oportunidad",
      "English": "opportunity"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-19",
    word: "decision",
    partOfSpeech: "noun",
    phonetic: "dih-SIZH-un",
    simpleDefinition: "A choice made after thinking.",
    exampleSentence: "It was a difficult decision.",
    translations: {
      "Malayalam": "തീരുമാനം",
      "Chinese": "决定",
      "Hindi": "निर्णय",
      "Spanish": "Decisión",
      "English": "decision"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-20",
    word: "environment",
    partOfSpeech: "noun",
    phonetic: "en-VY-run-ment",
    simpleDefinition: "The surroundings or conditions.",
    exampleSentence: "A healthy work environment.",
    translations: {
      "Malayalam": "പരിസ്ഥിതി",
      "Chinese": "环境",
      "Hindi": "पर्यावरण",
      "Spanish": "Entorno",
      "English": "environment"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-21",
    word: "responsibility",
    partOfSpeech: "noun",
    phonetic: "rih-spon-suh-BIL-ih-tee",
    simpleDefinition: "A duty to deal with something.",
    exampleSentence: "It is my responsibility.",
    translations: {
      "Malayalam": "ഉത്തരവാദിത്തം",
      "Chinese": "责任",
      "Hindi": "ज़िम्मेदारी",
      "Spanish": "Responsabilidad",
      "English": "responsibility"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-22",
    word: "consequently",
    partOfSpeech: "adverb",
    phonetic: "KON-suh-kwent-lee",
    simpleDefinition: "As a result.",
    exampleSentence: "It rained heavily; consequently, the game was canceled.",
    translations: {
      "Malayalam": "തൽഫലമായി",
      "Chinese": "因此",
      "Hindi": "फलस्वरूप",
      "Spanish": "En consecuencia",
      "English": "consequently"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-23",
    word: "substantial",
    partOfSpeech: "adjective",
    phonetic: "sub-STAN-shul",
    simpleDefinition: "Large in amount or importance.",
    exampleSentence: "A substantial amount of money.",
    translations: {
      "Malayalam": "ഗണ്യമായ",
      "Chinese": "大量的",
      "Hindi": "पर्याप्त",
      "Spanish": "Sustancial",
      "English": "substantial"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-24",
    word: "interpret",
    partOfSpeech: "verb",
    phonetic: "in-TUR-prit",
    simpleDefinition: "To explain or understand the meaning.",
    exampleSentence: "How do you interpret this data?",
    translations: {
      "Malayalam": "വ്യാഖ്യാനിക്കുക",
      "Chinese": "解释",
      "Hindi": "व्याख्या करना",
      "Spanish": "Interpretar",
      "English": "interpret"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-25",
    word: "demonstrate",
    partOfSpeech: "verb",
    phonetic: "DEM-un-strayt",
    simpleDefinition: "To show clearly.",
    exampleSentence: "Let me demonstrate how it works.",
    translations: {
      "Malayalam": "പ്രദർശിപ്പിക്കുക",
      "Chinese": "证明",
      "Hindi": "प्रदर्शित करना",
      "Spanish": "Demostrar",
      "English": "demonstrate"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-26",
    word: "facilitate",
    partOfSpeech: "verb",
    phonetic: "fuh-SIL-ih-tayt",
    simpleDefinition: "To make an action easier.",
    exampleSentence: "The new software will facilitate the process.",
    translations: {
      "Malayalam": "സുഗമമാക്കുക",
      "Chinese": "促进",
      "Hindi": "सुविधाजनक बनाना",
      "Spanish": "Facilitar",
      "English": "facilitate"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-27",
    word: "perspective",
    partOfSpeech: "noun",
    phonetic: "per-SPEK-tiv",
    simpleDefinition: "A particular way of considering something.",
    exampleSentence: "From my perspective, it's a good idea.",
    translations: {
      "Malayalam": "കാഴ്ചപ്പാട്",
      "Chinese": "观点",
      "Hindi": "दृष्टिकोण",
      "Spanish": "Perspectiva",
      "English": "perspective"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-28",
    word: "acquire",
    partOfSpeech: "verb",
    phonetic: "uh-KWY-er",
    simpleDefinition: "To get or obtain something.",
    exampleSentence: "He managed to acquire the rare book.",
    translations: {
      "Malayalam": "നേടുക",
      "Chinese": "获得",
      "Hindi": "प्राप्त करना",
      "Spanish": "Adquirir",
      "English": "acquire"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-29",
    word: "negotiate",
    partOfSpeech: "verb",
    phonetic: "nih-GOH-shee-ayt",
    simpleDefinition: "To discuss in order to reach an agreement.",
    exampleSentence: "We need to negotiate the contract.",
    translations: {
      "Malayalam": "ചർച്ച ചെയ്യുക",
      "Chinese": "谈判",
      "Hindi": "बातचीत करना",
      "Spanish": "Negociar",
      "English": "negotiate"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-30",
    word: "proposal",
    partOfSpeech: "noun",
    phonetic: "pruh-POH-zul",
    simpleDefinition: "A formal plan or suggestion.",
    exampleSentence: "The board accepted our proposal.",
    translations: {
      "Malayalam": "നിർദ്ദേശം",
      "Chinese": "提议",
      "Hindi": "प्रस्ताव",
      "Spanish": "Propuesta",
      "English": "proposal"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-31",
    word: "strategy",
    partOfSpeech: "noun",
    phonetic: "STRAT-uh-jee",
    simpleDefinition: "A plan of action to achieve a goal.",
    exampleSentence: "Our marketing strategy is effective.",
    translations: {
      "Malayalam": "തന്ത്രം",
      "Chinese": "战略",
      "Hindi": "रणनीति",
      "Spanish": "Estrategia",
      "English": "strategy"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-32",
    word: "stakeholder",
    partOfSpeech: "noun",
    phonetic: "STAYK-hohl-der",
    simpleDefinition: "A person with an interest in a business.",
    exampleSentence: "We must update all stakeholders.",
    translations: {
      "Malayalam": "പങ്കാളി",
      "Chinese": "利益相关者",
      "Hindi": "हितधारक",
      "Spanish": "Parte interesada",
      "English": "stakeholder"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-33",
    word: "revenue",
    partOfSpeech: "noun",
    phonetic: "REV-uh-noo",
    simpleDefinition: "Income a company receives.",
    exampleSentence: "Company revenue increased by 20%.",
    translations: {
      "Malayalam": "വരുമാനം",
      "Chinese": "收入",
      "Hindi": "राजस्व",
      "Spanish": "Ingresos",
      "English": "revenue"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-34",
    word: "deadline",
    partOfSpeech: "noun",
    phonetic: "DED-lyn",
    simpleDefinition: "The time by which something must be finished.",
    exampleSentence: "We cannot miss this deadline.",
    translations: {
      "Malayalam": "സമയപരിധി",
      "Chinese": "截止日期",
      "Hindi": "समयसीमा",
      "Spanish": "Fecha límite",
      "English": "deadline"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-35",
    word: "collaboration",
    partOfSpeech: "noun",
    phonetic: "kuh-lab-uh-RAY-shun",
    simpleDefinition: "Working together to create something.",
    exampleSentence: "Thanks for your collaboration.",
    translations: {
      "Malayalam": "സഹകരണം",
      "Chinese": "合作",
      "Hindi": "सहयोग",
      "Spanish": "Colaboración",
      "English": "collaboration"
    },
    level: "PROFESSIONAL"
  },
];

export function searchDictionary(query: string): DictionaryEntry[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return DICTIONARY_DATA.filter((w) => w.word.toLowerCase().includes(q));
}
