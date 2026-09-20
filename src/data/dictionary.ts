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
    word: "wake",
    partOfSpeech: "verb",
    phonetic: "wayk",
    simpleDefinition: "To stop sleeping.",
    exampleSentence: "I wake up at seven.",
    translations: {
      "Malayalam": "ഉണരുക",
      "Chinese": "醒来",
      "Hindi": "जागना",
      "Spanish": "Despertar",
      "English": "wake"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-2",
    word: "sleep",
    partOfSpeech: "verb",
    phonetic: "sleep",
    simpleDefinition: "To rest with eyes closed.",
    exampleSentence: "I sleep at night.",
    translations: {
      "Malayalam": "ഉറങ്ങുക",
      "Chinese": "睡觉",
      "Hindi": "सोना",
      "Spanish": "Dormir",
      "English": "sleep"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-3",
    word: "eat",
    partOfSpeech: "verb",
    phonetic: "eet",
    simpleDefinition: "To consume food.",
    exampleSentence: "I eat breakfast.",
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
    id: "d-word-4",
    word: "price",
    partOfSpeech: "noun",
    phonetic: "prys",
    simpleDefinition: "How much money something costs.",
    exampleSentence: "What is the price?",
    translations: {
      "Malayalam": "വില",
      "Chinese": "价格",
      "Hindi": "कीमत",
      "Spanish": "Precio",
      "English": "price"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-5",
    word: "buy",
    partOfSpeech: "verb",
    phonetic: "by",
    simpleDefinition: "To pay for something.",
    exampleSentence: "I want to buy this.",
    translations: {
      "Malayalam": "വാങ്ങുക",
      "Chinese": "买",
      "Hindi": "खरीदना",
      "Spanish": "Comprar",
      "English": "buy"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-6",
    word: "cheap",
    partOfSpeech: "adjective",
    phonetic: "cheep",
    simpleDefinition: "Not expensive.",
    exampleSentence: "This is very cheap.",
    translations: {
      "Malayalam": "വിലകുറഞ്ഞ",
      "Chinese": "便宜",
      "Hindi": "सस्ता",
      "Spanish": "Barato",
      "English": "cheap"
    },
    level: "BEGINNER"
  },
  {
    id: "d-word-7",
    word: "station",
    partOfSpeech: "noun",
    phonetic: "STAY-shun",
    simpleDefinition: "A place where trains stop.",
    exampleSentence: "Where is the train station?",
    translations: {
      "Malayalam": "സ്റ്റേഷൻ",
      "Chinese": "车站",
      "Hindi": "स्टेशन",
      "Spanish": "Estación",
      "English": "station"
    },
    level: "ELEMENTARY"
  },
  {
    id: "d-word-8",
    word: "left",
    partOfSpeech: "noun",
    phonetic: "left",
    simpleDefinition: "Direction opposite of right.",
    exampleSentence: "Turn left here.",
    translations: {
      "Malayalam": "ഇടത്",
      "Chinese": "左",
      "Hindi": "बाएं",
      "Spanish": "Izquierda",
      "English": "left"
    },
    level: "ELEMENTARY"
  },
  {
    id: "d-word-9",
    word: "ticket",
    partOfSpeech: "noun",
    phonetic: "TIK-it",
    simpleDefinition: "Paper to travel.",
    exampleSentence: "I need a ticket.",
    translations: {
      "Malayalam": "ടിക്കറ്റ്",
      "Chinese": "票",
      "Hindi": "टिकट",
      "Spanish": "Boleto",
      "English": "ticket"
    },
    level: "ELEMENTARY"
  },
  {
    id: "d-word-10",
    word: "hobby",
    partOfSpeech: "noun",
    phonetic: "HOB-ee",
    simpleDefinition: "Activity done for fun.",
    exampleSentence: "What is your hobby?",
    translations: {
      "Malayalam": "വിനോദം",
      "Chinese": "爱好",
      "Hindi": "शौक",
      "Spanish": "Pasatiempo",
      "English": "hobby"
    },
    level: "ELEMENTARY"
  },
  {
    id: "d-word-11",
    word: "plan",
    partOfSpeech: "noun",
    phonetic: "plan",
    simpleDefinition: "Idea for what to do.",
    exampleSentence: "Do you have a plan?",
    translations: {
      "Malayalam": "പദ്ധതി",
      "Chinese": "计划",
      "Hindi": "योजना",
      "Spanish": "Plan",
      "English": "plan"
    },
    level: "ELEMENTARY"
  },
  {
    id: "d-word-12",
    word: "family",
    partOfSpeech: "noun",
    phonetic: "FAM-ih-lee",
    simpleDefinition: "Parents and children.",
    exampleSentence: "I love my family.",
    translations: {
      "Malayalam": "കുടുംബം",
      "Chinese": "家庭",
      "Hindi": "परिवार",
      "Spanish": "Familia",
      "English": "family"
    },
    level: "ELEMENTARY"
  },
  {
    id: "d-word-13",
    word: "meeting",
    partOfSpeech: "noun",
    phonetic: "MEE-ting",
    simpleDefinition: "People coming together.",
    exampleSentence: "We have a meeting.",
    translations: {
      "Malayalam": "യോഗം",
      "Chinese": "会议",
      "Hindi": "बैठक",
      "Spanish": "Reunión",
      "English": "meeting"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-14",
    word: "discuss",
    partOfSpeech: "verb",
    phonetic: "dih-SKUS",
    simpleDefinition: "To talk about something.",
    exampleSentence: "Let us discuss this.",
    translations: {
      "Malayalam": "ചർച്ച ചെയ്യുക",
      "Chinese": "讨论",
      "Hindi": "चर्चा करना",
      "Spanish": "Discutir",
      "English": "discuss"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-15",
    word: "schedule",
    partOfSpeech: "noun",
    phonetic: "SKEJ-ool",
    simpleDefinition: "A plan of times.",
    exampleSentence: "My schedule is full.",
    translations: {
      "Malayalam": "സമയക്രമം",
      "Chinese": "日程",
      "Hindi": "अनुसूची",
      "Spanish": "Horario",
      "English": "schedule"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-16",
    word: "opinion",
    partOfSpeech: "noun",
    phonetic: "uh-PIN-yun",
    simpleDefinition: "What you think about something.",
    exampleSentence: "In my opinion, it is good.",
    translations: {
      "Malayalam": "അഭിപ്രായം",
      "Chinese": "意见",
      "Hindi": "राय",
      "Spanish": "Opinión",
      "English": "opinion"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-17",
    word: "agree",
    partOfSpeech: "verb",
    phonetic: "uh-GREE",
    simpleDefinition: "To have the same opinion.",
    exampleSentence: "I agree with you.",
    translations: {
      "Malayalam": "യോജിക്കുക",
      "Chinese": "同意",
      "Hindi": "सहमत होना",
      "Spanish": "Acordar",
      "English": "agree"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-18",
    word: "story",
    partOfSpeech: "noun",
    phonetic: "STOR-ee",
    simpleDefinition: "A tale of events.",
    exampleSentence: "Tell me a story.",
    translations: {
      "Malayalam": "കഥ",
      "Chinese": "故事",
      "Hindi": "कहानी",
      "Spanish": "Historia",
      "English": "story"
    },
    level: "INTERMEDIATE"
  },
  {
    id: "d-word-19",
    word: "alternative",
    partOfSpeech: "noun",
    phonetic: "awl-TUR-nuh-tiv",
    simpleDefinition: "Another option.",
    exampleSentence: "We need an alternative.",
    translations: {
      "Malayalam": "ബദൽ",
      "Chinese": "替代",
      "Hindi": "विकल्प",
      "Spanish": "Alternativa",
      "English": "alternative"
    },
    level: "UPPER-INTERMEDIATE"
  },
  {
    id: "d-word-20",
    word: "resolve",
    partOfSpeech: "verb",
    phonetic: "rih-ZOLV",
    simpleDefinition: "To find a solution.",
    exampleSentence: "We must resolve this problem.",
    translations: {
      "Malayalam": "പരിഹരിക്കുക",
      "Chinese": "解决",
      "Hindi": "हल करना",
      "Spanish": "Resolver",
      "English": "resolve"
    },
    level: "UPPER-INTERMEDIATE"
  },
  {
    id: "d-word-21",
    word: "effective",
    partOfSpeech: "adjective",
    phonetic: "ih-FEK-tiv",
    simpleDefinition: "Successful in producing a result.",
    exampleSentence: "This is an effective method.",
    translations: {
      "Malayalam": "ഫലപ്രദമായ",
      "Chinese": "有效",
      "Hindi": "प्रभावी",
      "Spanish": "Efectivo",
      "English": "effective"
    },
    level: "UPPER-INTERMEDIATE"
  },
  {
    id: "d-word-22",
    word: "argument",
    partOfSpeech: "noun",
    phonetic: "AR-gyoo-ment",
    simpleDefinition: "A reason given in debate.",
    exampleSentence: "That is a strong argument.",
    translations: {
      "Malayalam": "വാദം",
      "Chinese": "论点",
      "Hindi": "तर्क",
      "Spanish": "Argumento",
      "English": "argument"
    },
    level: "UPPER-INTERMEDIATE"
  },
  {
    id: "d-word-23",
    word: "nuance",
    partOfSpeech: "noun",
    phonetic: "NOO-ahns",
    simpleDefinition: "A subtle difference.",
    exampleSentence: "Understand the nuance of the word.",
    translations: {
      "Malayalam": "സൂക്ഷ്മത",
      "Chinese": "细微差别",
      "Hindi": "सूक्ष्मता",
      "Spanish": "Matiz",
      "English": "nuance"
    },
    level: "UPPER-INTERMEDIATE"
  },
  {
    id: "d-word-24",
    word: "compare",
    partOfSpeech: "verb",
    phonetic: "kum-PAIR",
    simpleDefinition: "To look at similarities and differences.",
    exampleSentence: "Compare these two ideas.",
    translations: {
      "Malayalam": "താരതമ്യം ചെയ്യുക",
      "Chinese": "比较",
      "Hindi": "तुलना करना",
      "Spanish": "Comparar",
      "English": "compare"
    },
    level: "UPPER-INTERMEDIATE"
  },
  {
    id: "d-word-25",
    word: "clarify",
    partOfSpeech: "verb",
    phonetic: "KLAR-ih-fy",
    simpleDefinition: "To make something clear.",
    exampleSentence: "Please clarify your point.",
    translations: {
      "Malayalam": "വ്യക്തമാക്കുക",
      "Chinese": "澄清",
      "Hindi": "स्पष्ट करना",
      "Spanish": "Aclarar",
      "English": "clarify"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-26",
    word: "implement",
    partOfSpeech: "verb",
    phonetic: "IM-pluh-ment",
    simpleDefinition: "To put into action.",
    exampleSentence: "We will implement the plan.",
    translations: {
      "Malayalam": "നടപ്പിലാക്കുക",
      "Chinese": "实施",
      "Hindi": "लागू करना",
      "Spanish": "Implementar",
      "English": "implement"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-27",
    word: "evaluate",
    partOfSpeech: "verb",
    phonetic: "ih-VAL-yoo-ayt",
    simpleDefinition: "To judge the value.",
    exampleSentence: "Evaluate the results.",
    translations: {
      "Malayalam": "വിലയിരുത്തുക",
      "Chinese": "评估",
      "Hindi": "मूल्यांकन करना",
      "Spanish": "Evaluar",
      "English": "evaluate"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-28",
    word: "idiom",
    partOfSpeech: "noun",
    phonetic: "ID-ee-um",
    simpleDefinition: "A phrase with figurative meaning.",
    exampleSentence: "That is a common English idiom.",
    translations: {
      "Malayalam": "ശൈലി",
      "Chinese": "习语",
      "Hindi": "मुहावरा",
      "Spanish": "Modismo",
      "English": "idiom"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-29",
    word: "formal",
    partOfSpeech: "adjective",
    phonetic: "FOR-mul",
    simpleDefinition: "Proper and official.",
    exampleSentence: "This is a formal letter.",
    translations: {
      "Malayalam": "ഔപചാരികമായ",
      "Chinese": "正式",
      "Hindi": "औपचारिक",
      "Spanish": "Formal",
      "English": "formal"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-30",
    word: "context",
    partOfSpeech: "noun",
    phonetic: "KON-tekst",
    simpleDefinition: "The situation surrounding an event.",
    exampleSentence: "Look at the context of the sentence.",
    translations: {
      "Malayalam": "സന്ദർഭം",
      "Chinese": "上下文",
      "Hindi": "संदर्भ",
      "Spanish": "Contexto",
      "English": "context"
    },
    level: "ADVANCED"
  },
  {
    id: "d-word-31",
    word: "negotiation",
    partOfSpeech: "noun",
    phonetic: "nih-goh-shee-AY-shun",
    simpleDefinition: "Discussion to reach agreement.",
    exampleSentence: "The negotiation was successful.",
    translations: {
      "Malayalam": "ചർച്ച",
      "Chinese": "谈判",
      "Hindi": "बातचीत",
      "Spanish": "Negociación",
      "English": "negotiation"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-32",
    word: "stakeholder",
    partOfSpeech: "noun",
    phonetic: "STAYK-hohl-der",
    simpleDefinition: "Person with an interest.",
    exampleSentence: "Update the stakeholders.",
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
    simpleDefinition: "Income of a company.",
    exampleSentence: "Revenue increased this year.",
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
    word: "presentation",
    partOfSpeech: "noun",
    phonetic: "prez-en-TAY-shun",
    simpleDefinition: "Showing information to an audience.",
    exampleSentence: "The presentation was clear.",
    translations: {
      "Malayalam": "അവതരണം",
      "Chinese": "演讲",
      "Hindi": "प्रस्तुति",
      "Spanish": "Presentación",
      "English": "presentation"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-35",
    word: "objective",
    partOfSpeech: "noun",
    phonetic: "ub-JEK-tiv",
    simpleDefinition: "A goal or purpose.",
    exampleSentence: "Our main objective is growth.",
    translations: {
      "Malayalam": "ലക്ഷ്യം",
      "Chinese": "目标",
      "Hindi": "उद्देश्य",
      "Spanish": "Objetivo",
      "English": "objective"
    },
    level: "PROFESSIONAL"
  },
  {
    id: "d-word-36",
    word: "collaboration",
    partOfSpeech: "noun",
    phonetic: "kuh-lab-uh-RAY-shun",
    simpleDefinition: "Working together.",
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
