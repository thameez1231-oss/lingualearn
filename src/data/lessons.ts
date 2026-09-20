export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  emoji: string;
  translations: Record<string, string>;
  exampleSentence: string;
  examplePhonetic: string;
  exampleTranslations: Record<string, string>;
}

export interface ExerciseItem {
  id: string;
  type: 'multiple_choice' | 'matching' | 'listen_choose' | 'sentence_builder' | 'translation';
  question: string;
  hint?: string;
  audioPrompt?: string;
  options?: { text: string; subtext?: string; isCorrect: boolean }[];
  pairs?: { left: string; right: string }[];
  scrambledWords?: string[];
  correctSentence?: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  moduleTitle: string;
  moduleBadge: string;
  title: string;
  subtitle: string;
  icon: string;
  xpReward: number;
  estimatedMinutes: number;
  vocabulary: VocabWord[];
  exercises: ExerciseItem[];
  order: number;
  isCheckpoint?: boolean;
}

export const LESSONS_DATA: Lesson[] = [
  {
    id: "beginner-1",
    moduleId: "beginner",
    moduleTitle: "BEGINNER",
    moduleBadge: "🌟 Beginner",
    title: "Everyday Activities",
    subtitle: "Learn to talk about your daily routine.",
    icon: "🌅",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 1,
    vocabulary: [{
        id: "v-wake", word: "wake", phonetic: "wayk", emoji: "🌅",
        translations: { Malayalam: "ഉണരുക", Chinese: "醒来", Hindi: "जागना", Spanish: "Despertar", English: "wake" },
        exampleSentence: "I wake up at seven.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-sleep", word: "sleep", phonetic: "sleep", emoji: "🌅",
        translations: { Malayalam: "ഉറങ്ങുക", Chinese: "睡觉", Hindi: "सोना", Spanish: "Dormir", English: "sleep" },
        exampleSentence: "I sleep at night.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-eat", word: "eat", phonetic: "eet", emoji: "🌅",
        translations: { Malayalam: "കഴിക്കുക", Chinese: "吃", Hindi: "खाना", Spanish: "Comer", English: "eat" },
        exampleSentence: "I eat breakfast.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-beginner-1-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "wake", isCorrect: true },
          { text: "sleep", isCorrect: false },
          { text: "eat", isCorrect: false }
        ],
        explanation: "The correct answer is wake."
      },
      {
        id: "ex-beginner-1-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is wake", scrambledWords: ["this", "is", "wake", "sleep"],
        explanation: "Correct order: this is wake."
      }
    ]
  },
  {
    id: "checkpoint-beginner-1",
    moduleId: "beginner",
    moduleTitle: "BEGINNER",
    moduleBadge: "🌟 Beginner",
    title: "Checkpoint: Everyday Activities",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 2,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-beginner-1-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "wake", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "beginner-2",
    moduleId: "beginner",
    moduleTitle: "BEGINNER",
    moduleBadge: "🌟 Beginner",
    title: "Shopping & Basic Requests",
    subtitle: "Learn to buy things and ask for prices.",
    icon: "🛒",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 3,
    vocabulary: [{
        id: "v-price", word: "price", phonetic: "prys", emoji: "🛒",
        translations: { Malayalam: "വില", Chinese: "价格", Hindi: "कीमत", Spanish: "Precio", English: "price" },
        exampleSentence: "What is the price?", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-buy", word: "buy", phonetic: "by", emoji: "🛒",
        translations: { Malayalam: "വാങ്ങുക", Chinese: "买", Hindi: "खरीदना", Spanish: "Comprar", English: "buy" },
        exampleSentence: "I want to buy this.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-cheap", word: "cheap", phonetic: "cheep", emoji: "🛒",
        translations: { Malayalam: "വിലകുറഞ്ഞ", Chinese: "便宜", Hindi: "सस्ता", Spanish: "Barato", English: "cheap" },
        exampleSentence: "This is very cheap.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-beginner-2-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "price", isCorrect: true },
          { text: "buy", isCorrect: false },
          { text: "cheap", isCorrect: false }
        ],
        explanation: "The correct answer is price."
      },
      {
        id: "ex-beginner-2-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is price", scrambledWords: ["this", "is", "price", "buy"],
        explanation: "Correct order: this is price."
      }
    ]
  },
  {
    id: "checkpoint-beginner-2",
    moduleId: "beginner",
    moduleTitle: "BEGINNER",
    moduleBadge: "🌟 Beginner",
    title: "Checkpoint: Shopping & Basic Requests",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 4,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-beginner-2-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "price", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "elementary-1",
    moduleId: "elementary",
    moduleTitle: "ELEMENTARY",
    moduleBadge: "🚶 Elementary",
    title: "Travel & Directions",
    subtitle: "Navigate the city and take transport.",
    icon: "🚉",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 5,
    vocabulary: [{
        id: "v-station", word: "station", phonetic: "STAY-shun", emoji: "🚉",
        translations: { Malayalam: "സ്റ്റേഷൻ", Chinese: "车站", Hindi: "स्टेशन", Spanish: "Estación", English: "station" },
        exampleSentence: "Where is the train station?", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-left", word: "left", phonetic: "left", emoji: "🚉",
        translations: { Malayalam: "ഇടത്", Chinese: "左", Hindi: "बाएं", Spanish: "Izquierda", English: "left" },
        exampleSentence: "Turn left here.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-ticket", word: "ticket", phonetic: "TIK-it", emoji: "🚉",
        translations: { Malayalam: "ടിക്കറ്റ്", Chinese: "票", Hindi: "टिकट", Spanish: "Boleto", English: "ticket" },
        exampleSentence: "I need a ticket.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-elementary-1-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "station", isCorrect: true },
          { text: "left", isCorrect: false },
          { text: "ticket", isCorrect: false }
        ],
        explanation: "The correct answer is station."
      },
      {
        id: "ex-elementary-1-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is station", scrambledWords: ["this", "is", "station", "left"],
        explanation: "Correct order: this is station."
      }
    ]
  },
  {
    id: "checkpoint-elementary-1",
    moduleId: "elementary",
    moduleTitle: "ELEMENTARY",
    moduleBadge: "🚶 Elementary",
    title: "Checkpoint: Travel & Directions",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 6,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-elementary-1-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "station", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "elementary-2",
    moduleId: "elementary",
    moduleTitle: "ELEMENTARY",
    moduleBadge: "🚶 Elementary",
    title: "Daily Conversations",
    subtitle: "Talk about hobbies and family.",
    icon: "👨‍👩‍👧‍👦",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 7,
    vocabulary: [{
        id: "v-hobby", word: "hobby", phonetic: "HOB-ee", emoji: "👨‍👩‍👧‍👦",
        translations: { Malayalam: "വിനോദം", Chinese: "爱好", Hindi: "शौक", Spanish: "Pasatiempo", English: "hobby" },
        exampleSentence: "What is your hobby?", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-plan", word: "plan", phonetic: "plan", emoji: "👨‍👩‍👧‍👦",
        translations: { Malayalam: "പദ്ധതി", Chinese: "计划", Hindi: "योजना", Spanish: "Plan", English: "plan" },
        exampleSentence: "Do you have a plan?", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-family", word: "family", phonetic: "FAM-ih-lee", emoji: "👨‍👩‍👧‍👦",
        translations: { Malayalam: "കുടുംബം", Chinese: "家庭", Hindi: "परिवार", Spanish: "Familia", English: "family" },
        exampleSentence: "I love my family.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-elementary-2-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "hobby", isCorrect: true },
          { text: "plan", isCorrect: false },
          { text: "family", isCorrect: false }
        ],
        explanation: "The correct answer is hobby."
      },
      {
        id: "ex-elementary-2-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is hobby", scrambledWords: ["this", "is", "hobby", "plan"],
        explanation: "Correct order: this is hobby."
      }
    ]
  },
  {
    id: "checkpoint-elementary-2",
    moduleId: "elementary",
    moduleTitle: "ELEMENTARY",
    moduleBadge: "🚶 Elementary",
    title: "Checkpoint: Daily Conversations",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 8,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-elementary-2-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "hobby", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "intermediate-1",
    moduleId: "intermediate",
    moduleTitle: "INTERMEDIATE",
    moduleBadge: "💬 Intermediate",
    title: "Work & Communication",
    subtitle: "Discuss plans and schedules.",
    icon: "💼",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 9,
    vocabulary: [{
        id: "v-meeting", word: "meeting", phonetic: "MEE-ting", emoji: "💼",
        translations: { Malayalam: "യോഗം", Chinese: "会议", Hindi: "बैठक", Spanish: "Reunión", English: "meeting" },
        exampleSentence: "We have a meeting.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-discuss", word: "discuss", phonetic: "dih-SKUS", emoji: "💼",
        translations: { Malayalam: "ചർച്ച ചെയ്യുക", Chinese: "讨论", Hindi: "चर्चा करना", Spanish: "Discutir", English: "discuss" },
        exampleSentence: "Let us discuss this.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-schedule", word: "schedule", phonetic: "SKEJ-ool", emoji: "💼",
        translations: { Malayalam: "സമയക്രമം", Chinese: "日程", Hindi: "अनुसूची", Spanish: "Horario", English: "schedule" },
        exampleSentence: "My schedule is full.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-intermediate-1-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "meeting", isCorrect: true },
          { text: "discuss", isCorrect: false },
          { text: "schedule", isCorrect: false }
        ],
        explanation: "The correct answer is meeting."
      },
      {
        id: "ex-intermediate-1-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is meeting", scrambledWords: ["this", "is", "meeting", "discuss"],
        explanation: "Correct order: this is meeting."
      }
    ]
  },
  {
    id: "checkpoint-intermediate-1",
    moduleId: "intermediate",
    moduleTitle: "INTERMEDIATE",
    moduleBadge: "💬 Intermediate",
    title: "Checkpoint: Work & Communication",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 10,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-intermediate-1-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "meeting", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "intermediate-2",
    moduleId: "intermediate",
    moduleTitle: "INTERMEDIATE",
    moduleBadge: "💬 Intermediate",
    title: "Opinions & Experiences",
    subtitle: "Share your thoughts and agree with others.",
    icon: "🧠",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 11,
    vocabulary: [{
        id: "v-opinion", word: "opinion", phonetic: "uh-PIN-yun", emoji: "🧠",
        translations: { Malayalam: "അഭിപ്രായം", Chinese: "意见", Hindi: "राय", Spanish: "Opinión", English: "opinion" },
        exampleSentence: "In my opinion, it is good.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-agree", word: "agree", phonetic: "uh-GREE", emoji: "🧠",
        translations: { Malayalam: "യോജിക്കുക", Chinese: "同意", Hindi: "सहमत होना", Spanish: "Acordar", English: "agree" },
        exampleSentence: "I agree with you.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-story", word: "story", phonetic: "STOR-ee", emoji: "🧠",
        translations: { Malayalam: "കഥ", Chinese: "故事", Hindi: "कहानी", Spanish: "Historia", English: "story" },
        exampleSentence: "Tell me a story.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-intermediate-2-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "opinion", isCorrect: true },
          { text: "agree", isCorrect: false },
          { text: "story", isCorrect: false }
        ],
        explanation: "The correct answer is opinion."
      },
      {
        id: "ex-intermediate-2-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is opinion", scrambledWords: ["this", "is", "opinion", "agree"],
        explanation: "Correct order: this is opinion."
      }
    ]
  },
  {
    id: "checkpoint-intermediate-2",
    moduleId: "intermediate",
    moduleTitle: "INTERMEDIATE",
    moduleBadge: "💬 Intermediate",
    title: "Checkpoint: Opinions & Experiences",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 12,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-intermediate-2-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "opinion", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "upper-intermediate-1",
    moduleId: "upper_intermediate",
    moduleTitle: "UPPER_INTERMEDIATE",
    moduleBadge: "⚖️ Upper-Intermediate",
    title: "Problem Solving",
    subtitle: "Resolve issues effectively.",
    icon: "🧩",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 13,
    vocabulary: [{
        id: "v-alternative", word: "alternative", phonetic: "awl-TUR-nuh-tiv", emoji: "🧩",
        translations: { Malayalam: "ബദൽ", Chinese: "替代", Hindi: "विकल्प", Spanish: "Alternativa", English: "alternative" },
        exampleSentence: "We need an alternative.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-resolve", word: "resolve", phonetic: "rih-ZOLV", emoji: "🧩",
        translations: { Malayalam: "പരിഹരിക്കുക", Chinese: "解决", Hindi: "हल करना", Spanish: "Resolver", English: "resolve" },
        exampleSentence: "We must resolve this problem.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-effective", word: "effective", phonetic: "ih-FEK-tiv", emoji: "🧩",
        translations: { Malayalam: "ഫലപ്രദമായ", Chinese: "有效", Hindi: "प्रभावी", Spanish: "Efectivo", English: "effective" },
        exampleSentence: "This is an effective method.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-upper-intermediate-1-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "alternative", isCorrect: true },
          { text: "resolve", isCorrect: false },
          { text: "effective", isCorrect: false }
        ],
        explanation: "The correct answer is alternative."
      },
      {
        id: "ex-upper-intermediate-1-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is alternative", scrambledWords: ["this", "is", "alternative", "resolve"],
        explanation: "Correct order: this is alternative."
      }
    ]
  },
  {
    id: "checkpoint-upper-intermediate-1",
    moduleId: "upper_intermediate",
    moduleTitle: "UPPER_INTERMEDIATE",
    moduleBadge: "⚖️ Upper-Intermediate",
    title: "Checkpoint: Problem Solving",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 14,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-upper-intermediate-1-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "alternative", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "upper-intermediate-2",
    moduleId: "upper_intermediate",
    moduleTitle: "UPPER_INTERMEDIATE",
    moduleBadge: "⚖️ Upper-Intermediate",
    title: "Discussion & Debate",
    subtitle: "Express nuanced arguments.",
    icon: "🗣️",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 15,
    vocabulary: [{
        id: "v-argument", word: "argument", phonetic: "AR-gyoo-ment", emoji: "🗣️",
        translations: { Malayalam: "വാദം", Chinese: "论点", Hindi: "तर्क", Spanish: "Argumento", English: "argument" },
        exampleSentence: "That is a strong argument.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-nuance", word: "nuance", phonetic: "NOO-ahns", emoji: "🗣️",
        translations: { Malayalam: "സൂക്ഷ്മത", Chinese: "细微差别", Hindi: "सूक्ष्मता", Spanish: "Matiz", English: "nuance" },
        exampleSentence: "Understand the nuance of the word.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-compare", word: "compare", phonetic: "kum-PAIR", emoji: "🗣️",
        translations: { Malayalam: "താരതമ്യം ചെയ്യുക", Chinese: "比较", Hindi: "तुलना करना", Spanish: "Comparar", English: "compare" },
        exampleSentence: "Compare these two ideas.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-upper-intermediate-2-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "argument", isCorrect: true },
          { text: "nuance", isCorrect: false },
          { text: "compare", isCorrect: false }
        ],
        explanation: "The correct answer is argument."
      },
      {
        id: "ex-upper-intermediate-2-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is argument", scrambledWords: ["this", "is", "argument", "nuance"],
        explanation: "Correct order: this is argument."
      }
    ]
  },
  {
    id: "checkpoint-upper-intermediate-2",
    moduleId: "upper_intermediate",
    moduleTitle: "UPPER_INTERMEDIATE",
    moduleBadge: "⚖️ Upper-Intermediate",
    title: "Checkpoint: Discussion & Debate",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 16,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-upper-intermediate-2-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "argument", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "advanced-1",
    moduleId: "advanced",
    moduleTitle: "ADVANCED",
    moduleBadge: "🎓 Advanced",
    title: "Professional Communication",
    subtitle: "Implement and evaluate strategies.",
    icon: "📊",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 17,
    vocabulary: [{
        id: "v-clarify", word: "clarify", phonetic: "KLAR-ih-fy", emoji: "📊",
        translations: { Malayalam: "വ്യക്തമാക്കുക", Chinese: "澄清", Hindi: "स्पष्ट करना", Spanish: "Aclarar", English: "clarify" },
        exampleSentence: "Please clarify your point.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-implement", word: "implement", phonetic: "IM-pluh-ment", emoji: "📊",
        translations: { Malayalam: "നടപ്പിലാക്കുക", Chinese: "实施", Hindi: "लागू करना", Spanish: "Implementar", English: "implement" },
        exampleSentence: "We will implement the plan.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-evaluate", word: "evaluate", phonetic: "ih-VAL-yoo-ayt", emoji: "📊",
        translations: { Malayalam: "വിലയിരുത്തുക", Chinese: "评估", Hindi: "मूल्यांकन करना", Spanish: "Evaluar", English: "evaluate" },
        exampleSentence: "Evaluate the results.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-advanced-1-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "clarify", isCorrect: true },
          { text: "implement", isCorrect: false },
          { text: "evaluate", isCorrect: false }
        ],
        explanation: "The correct answer is clarify."
      },
      {
        id: "ex-advanced-1-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is clarify", scrambledWords: ["this", "is", "clarify", "implement"],
        explanation: "Correct order: this is clarify."
      }
    ]
  },
  {
    id: "checkpoint-advanced-1",
    moduleId: "advanced",
    moduleTitle: "ADVANCED",
    moduleBadge: "🎓 Advanced",
    title: "Checkpoint: Professional Communication",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 18,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-advanced-1-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "clarify", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "advanced-2",
    moduleId: "advanced",
    moduleTitle: "ADVANCED",
    moduleBadge: "🎓 Advanced",
    title: "Advanced Reading",
    subtitle: "Understand context and idioms.",
    icon: "📚",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 19,
    vocabulary: [{
        id: "v-idiom", word: "idiom", phonetic: "ID-ee-um", emoji: "📚",
        translations: { Malayalam: "ശൈലി", Chinese: "习语", Hindi: "मुहावरा", Spanish: "Modismo", English: "idiom" },
        exampleSentence: "That is a common English idiom.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-formal", word: "formal", phonetic: "FOR-mul", emoji: "📚",
        translations: { Malayalam: "ഔപചാരികമായ", Chinese: "正式", Hindi: "औपचारिक", Spanish: "Formal", English: "formal" },
        exampleSentence: "This is a formal letter.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-context", word: "context", phonetic: "KON-tekst", emoji: "📚",
        translations: { Malayalam: "സന്ദർഭം", Chinese: "上下文", Hindi: "संदर्भ", Spanish: "Contexto", English: "context" },
        exampleSentence: "Look at the context of the sentence.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-advanced-2-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "idiom", isCorrect: true },
          { text: "formal", isCorrect: false },
          { text: "context", isCorrect: false }
        ],
        explanation: "The correct answer is idiom."
      },
      {
        id: "ex-advanced-2-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is idiom", scrambledWords: ["this", "is", "idiom", "formal"],
        explanation: "Correct order: this is idiom."
      }
    ]
  },
  {
    id: "checkpoint-advanced-2",
    moduleId: "advanced",
    moduleTitle: "ADVANCED",
    moduleBadge: "🎓 Advanced",
    title: "Checkpoint: Advanced Reading",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 20,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-advanced-2-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "idiom", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "professional-1",
    moduleId: "professional",
    moduleTitle: "PROFESSIONAL",
    moduleBadge: "🏢 Professional",
    title: "Business Meetings",
    subtitle: "Negotiate and manage stakeholders.",
    icon: "📈",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 21,
    vocabulary: [{
        id: "v-negotiation", word: "negotiation", phonetic: "nih-goh-shee-AY-shun", emoji: "📈",
        translations: { Malayalam: "ചർച്ച", Chinese: "谈判", Hindi: "बातचीत", Spanish: "Negociación", English: "negotiation" },
        exampleSentence: "The negotiation was successful.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-stakeholder", word: "stakeholder", phonetic: "STAYK-hohl-der", emoji: "📈",
        translations: { Malayalam: "പങ്കാളി", Chinese: "利益相关者", Hindi: "हितधारक", Spanish: "Parte interesada", English: "stakeholder" },
        exampleSentence: "Update the stakeholders.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-revenue", word: "revenue", phonetic: "REV-uh-noo", emoji: "📈",
        translations: { Malayalam: "വരുമാനം", Chinese: "收入", Hindi: "राजस्व", Spanish: "Ingresos", English: "revenue" },
        exampleSentence: "Revenue increased this year.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-professional-1-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "negotiation", isCorrect: true },
          { text: "stakeholder", isCorrect: false },
          { text: "revenue", isCorrect: false }
        ],
        explanation: "The correct answer is negotiation."
      },
      {
        id: "ex-professional-1-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is negotiation", scrambledWords: ["this", "is", "negotiation", "stakeholder"],
        explanation: "Correct order: this is negotiation."
      }
    ]
  },
  {
    id: "checkpoint-professional-1",
    moduleId: "professional",
    moduleTitle: "PROFESSIONAL",
    moduleBadge: "🏢 Professional",
    title: "Checkpoint: Business Meetings",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 22,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-professional-1-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "negotiation", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
  {
    id: "professional-2",
    moduleId: "professional",
    moduleTitle: "PROFESSIONAL",
    moduleBadge: "🏢 Professional",
    title: "Leadership & Presentations",
    subtitle: "Collaborate and achieve objectives.",
    icon: "👑",
    xpReward: 50,
    estimatedMinutes: 5,
    order: 23,
    vocabulary: [{
        id: "v-presentation", word: "presentation", phonetic: "prez-en-TAY-shun", emoji: "👑",
        translations: { Malayalam: "അവതരണം", Chinese: "演讲", Hindi: "प्रस्तुति", Spanish: "Presentación", English: "presentation" },
        exampleSentence: "The presentation was clear.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-objective", word: "objective", phonetic: "ub-JEK-tiv", emoji: "👑",
        translations: { Malayalam: "ലക്ഷ്യം", Chinese: "目标", Hindi: "उद्देश्य", Spanish: "Objetivo", English: "objective" },
        exampleSentence: "Our main objective is growth.", examplePhonetic: "", exampleTranslations: {}
      },
      {
        id: "v-collaboration", word: "collaboration", phonetic: "kuh-lab-uh-RAY-shun", emoji: "👑",
        translations: { Malayalam: "സഹകരണം", Chinese: "合作", Hindi: "सहयोग", Spanish: "Colaboración", English: "collaboration" },
        exampleSentence: "Thanks for your collaboration.", examplePhonetic: "", exampleTranslations: {}
      }],
    exercises: [
      {
        id: "ex-professional-2-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "presentation", isCorrect: true },
          { text: "objective", isCorrect: false },
          { text: "collaboration", isCorrect: false }
        ],
        explanation: "The correct answer is presentation."
      },
      {
        id: "ex-professional-2-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is presentation", scrambledWords: ["this", "is", "presentation", "objective"],
        explanation: "Correct order: this is presentation."
      }
    ]
  },
  {
    id: "checkpoint-professional-2",
    moduleId: "professional",
    moduleTitle: "PROFESSIONAL",
    moduleBadge: "🏢 Professional",
    title: "Checkpoint: Leadership & Presentations",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: 24,
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-professional-2-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "presentation", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS_DATA.find((l) => l.id === id);
}

export function getLessonByOrder(order: number): Lesson | undefined {
  return LESSONS_DATA.find((l) => l.order === order);
}

export function getNextLessonId(currentLessonId: string): string {
  const current = LESSONS_DATA.find((l) => l.id === currentLessonId);
  if (!current) return LESSONS_DATA[0].id;
  
  const next = LESSONS_DATA.find((l) => l.order === current.order + 1);
  return next ? next.id : current.id;
}
