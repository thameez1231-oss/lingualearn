const fs = require('fs');

const dictionary = [
  // BEGINNER 1
  ['wake', 'wayk', 'verb', 'To stop sleeping.', 'I wake up at seven.', 'ഉണരുക', '醒来', 'जागना', 'Despertar', 'BEGINNER'],
  ['sleep', 'sleep', 'verb', 'To rest with eyes closed.', 'I sleep at night.', 'ഉറങ്ങുക', '睡觉', 'सोना', 'Dormir', 'BEGINNER'],
  ['eat', 'eet', 'verb', 'To consume food.', 'I eat breakfast.', 'കഴിക്കുക', '吃', 'खाना', 'Comer', 'BEGINNER'],
  
  // BEGINNER 2
  ['price', 'prys', 'noun', 'How much money something costs.', 'What is the price?', 'വില', '价格', 'कीमत', 'Precio', 'BEGINNER'],
  ['buy', 'by', 'verb', 'To pay for something.', 'I want to buy this.', 'വാങ്ങുക', '买', 'खरीदना', 'Comprar', 'BEGINNER'],
  ['cheap', 'cheep', 'adjective', 'Not expensive.', 'This is very cheap.', 'വിലകുറഞ്ഞ', '便宜', 'सस्ता', 'Barato', 'BEGINNER'],

  // ELEMENTARY 1
  ['station', 'STAY-shun', 'noun', 'A place where trains stop.', 'Where is the train station?', 'സ്റ്റേഷൻ', '车站', 'स्टेशन', 'Estación', 'ELEMENTARY'],
  ['left', 'left', 'noun', 'Direction opposite of right.', 'Turn left here.', 'ഇടത്', '左', 'बाएं', 'Izquierda', 'ELEMENTARY'],
  ['ticket', 'TIK-it', 'noun', 'Paper to travel.', 'I need a ticket.', 'ടിക്കറ്റ്', '票', 'टिकट', 'Boleto', 'ELEMENTARY'],

  // ELEMENTARY 2
  ['hobby', 'HOB-ee', 'noun', 'Activity done for fun.', 'What is your hobby?', 'വിനോദം', '爱好', 'शौक', 'Pasatiempo', 'ELEMENTARY'],
  ['plan', 'plan', 'noun', 'Idea for what to do.', 'Do you have a plan?', 'പദ്ധതി', '计划', 'योजना', 'Plan', 'ELEMENTARY'],
  ['family', 'FAM-ih-lee', 'noun', 'Parents and children.', 'I love my family.', 'കുടുംബം', '家庭', 'परिवार', 'Familia', 'ELEMENTARY'],

  // INTERMEDIATE 1
  ['meeting', 'MEE-ting', 'noun', 'People coming together.', 'We have a meeting.', 'യോഗം', '会议', 'बैठक', 'Reunión', 'INTERMEDIATE'],
  ['discuss', 'dih-SKUS', 'verb', 'To talk about something.', 'Let us discuss this.', 'ചർച്ച ചെയ്യുക', '讨论', 'चर्चा करना', 'Discutir', 'INTERMEDIATE'],
  ['schedule', 'SKEJ-ool', 'noun', 'A plan of times.', 'My schedule is full.', 'സമയക്രമം', '日程', 'अनुसूची', 'Horario', 'INTERMEDIATE'],

  // INTERMEDIATE 2
  ['opinion', 'uh-PIN-yun', 'noun', 'What you think about something.', 'In my opinion, it is good.', 'അഭിപ്രായം', '意见', 'राय', 'Opinión', 'INTERMEDIATE'],
  ['agree', 'uh-GREE', 'verb', 'To have the same opinion.', 'I agree with you.', 'യോജിക്കുക', '同意', 'सहमत होना', 'Acordar', 'INTERMEDIATE'],
  ['story', 'STOR-ee', 'noun', 'A tale of events.', 'Tell me a story.', 'കഥ', '故事', 'कहानी', 'Historia', 'INTERMEDIATE'],

  // UPPER-INTERMEDIATE 1
  ['alternative', 'awl-TUR-nuh-tiv', 'noun', 'Another option.', 'We need an alternative.', 'ബദൽ', '替代', 'विकल्प', 'Alternativa', 'UPPER-INTERMEDIATE'],
  ['resolve', 'rih-ZOLV', 'verb', 'To find a solution.', 'We must resolve this problem.', 'പരിഹരിക്കുക', '解决', 'हल करना', 'Resolver', 'UPPER-INTERMEDIATE'],
  ['effective', 'ih-FEK-tiv', 'adjective', 'Successful in producing a result.', 'This is an effective method.', 'ഫലപ്രദമായ', '有效', 'प्रभावी', 'Efectivo', 'UPPER-INTERMEDIATE'],

  // UPPER-INTERMEDIATE 2
  ['argument', 'AR-gyoo-ment', 'noun', 'A reason given in debate.', 'That is a strong argument.', 'വാദം', '论点', 'तर्क', 'Argumento', 'UPPER-INTERMEDIATE'],
  ['nuance', 'NOO-ahns', 'noun', 'A subtle difference.', 'Understand the nuance of the word.', 'സൂക്ഷ്മത', '细微差别', 'सूक्ष्मता', 'Matiz', 'UPPER-INTERMEDIATE'],
  ['compare', 'kum-PAIR', 'verb', 'To look at similarities and differences.', 'Compare these two ideas.', 'താരതമ്യം ചെയ്യുക', '比较', 'तुलना करना', 'Comparar', 'UPPER-INTERMEDIATE'],

  // ADVANCED 1
  ['clarify', 'KLAR-ih-fy', 'verb', 'To make something clear.', 'Please clarify your point.', 'വ്യക്തമാക്കുക', '澄清', 'स्पष्ट करना', 'Aclarar', 'ADVANCED'],
  ['implement', 'IM-pluh-ment', 'verb', 'To put into action.', 'We will implement the plan.', 'നടപ്പിലാക്കുക', '实施', 'लागू करना', 'Implementar', 'ADVANCED'],
  ['evaluate', 'ih-VAL-yoo-ayt', 'verb', 'To judge the value.', 'Evaluate the results.', 'വിലയിരുത്തുക', '评估', 'मूल्यांकन करना', 'Evaluar', 'ADVANCED'],

  // ADVANCED 2
  ['idiom', 'ID-ee-um', 'noun', 'A phrase with figurative meaning.', 'That is a common English idiom.', 'ശൈലി', '习语', 'मुहावरा', 'Modismo', 'ADVANCED'],
  ['formal', 'FOR-mul', 'adjective', 'Proper and official.', 'This is a formal letter.', 'ഔപചാരികമായ', '正式', 'औपचारिक', 'Formal', 'ADVANCED'],
  ['context', 'KON-tekst', 'noun', 'The situation surrounding an event.', 'Look at the context of the sentence.', 'സന്ദർഭം', '上下文', 'संदर्भ', 'Contexto', 'ADVANCED'],

  // PROFESSIONAL 1
  ['negotiation', 'nih-goh-shee-AY-shun', 'noun', 'Discussion to reach agreement.', 'The negotiation was successful.', 'ചർച്ച', '谈判', 'बातचीत', 'Negociación', 'PROFESSIONAL'],
  ['stakeholder', 'STAYK-hohl-der', 'noun', 'Person with an interest.', 'Update the stakeholders.', 'പങ്കാളി', '利益相关者', 'हितधारक', 'Parte interesada', 'PROFESSIONAL'],
  ['revenue', 'REV-uh-noo', 'noun', 'Income of a company.', 'Revenue increased this year.', 'വരുമാനം', '收入', 'राजस्व', 'Ingresos', 'PROFESSIONAL'],

  // PROFESSIONAL 2
  ['presentation', 'prez-en-TAY-shun', 'noun', 'Showing information to an audience.', 'The presentation was clear.', 'അവതരണം', '演讲', 'प्रस्तुति', 'Presentación', 'PROFESSIONAL'],
  ['objective', 'ub-JEK-tiv', 'noun', 'A goal or purpose.', 'Our main objective is growth.', 'ലക്ഷ്യം', '目标', 'उद्देश्य', 'Objetivo', 'PROFESSIONAL'],
  ['collaboration', 'kuh-lab-uh-RAY-shun', 'noun', 'Working together.', 'Thanks for your collaboration.', 'സഹകരണം', '合作', 'सहयोग', 'Colaboración', 'PROFESSIONAL']
];

let dictOutput = `export interface DictionaryEntry {
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
`;

dictionary.forEach((v, i) => {
    dictOutput += `  {
    id: "d-word-${i+1}",
    word: "${v[0]}",
    partOfSpeech: "${v[2]}",
    phonetic: "${v[1]}",
    simpleDefinition: "${v[3]}",
    exampleSentence: "${v[4]}",
    translations: {
      "Malayalam": "${v[5]}",
      "Chinese": "${v[6]}",
      "Hindi": "${v[7]}",
      "Spanish": "${v[8]}",
      "English": "${v[0]}"
    },
    level: "${v[9]}"
  },
`;
});

dictOutput += `];

export function searchDictionary(query: string): DictionaryEntry[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return DICTIONARY_DATA.filter((w) => w.word.toLowerCase().includes(q));
}
`;

fs.writeFileSync('src/data/dictionary.ts', dictOutput);


// BUILD LESSONS
const lessons = [
  {
    id: 'beginner-1',
    moduleId: 'beginner',
    moduleTitle: 'Beginner',
    moduleBadge: '🌟 Beginner',
    title: 'Everyday Activities',
    subtitle: 'Learn to talk about your daily routine.',
    icon: '🌅',
    xpReward: 50,
    estimatedMinutes: 5,
    vocabWords: ['wake', 'sleep', 'eat'],
    exercises: [
      { type: 'multiple_choice', q: 'Which word means to consume food?', ans: 'eat', distractors: ['sleep', 'wake'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'I eat breakfast', scrambled: ['I', 'eat', 'breakfast', 'sleep'] }
    ]
  },
  {
    id: 'beginner-2',
    moduleId: 'beginner',
    moduleTitle: 'Beginner',
    moduleBadge: '🌟 Beginner',
    title: 'Shopping & Basic Requests',
    subtitle: 'Learn to buy things and ask for prices.',
    icon: '🛒',
    xpReward: 50,
    estimatedMinutes: 5,
    vocabWords: ['price', 'buy', 'cheap'],
    exercises: [
      { type: 'listen_choose', q: 'Listen and choose the word.', audio: 'cheap', ans: 'cheap', distractors: ['price', 'buy'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'I want to buy this', scrambled: ['I', 'want', 'to', 'buy', 'this', 'cheap'] }
    ]
  },
  {
    id: 'elementary-1',
    moduleId: 'elementary',
    moduleTitle: 'Elementary',
    moduleBadge: '🚶 Elementary',
    title: 'Travel & Directions',
    subtitle: 'Navigate the city and take transport.',
    icon: '🚉',
    xpReward: 60,
    estimatedMinutes: 6,
    vocabWords: ['station', 'left', 'ticket'],
    exercises: [
      { type: 'matching', pairs: [{l: 'station', r: 'where trains stop'}, {l: 'ticket', r: 'paper to travel'}] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'where is the station', scrambled: ['where', 'is', 'the', 'station', 'ticket'] }
    ]
  },
  {
    id: 'elementary-2',
    moduleId: 'elementary',
    moduleTitle: 'Elementary',
    moduleBadge: '🚶 Elementary',
    title: 'Daily Conversations',
    subtitle: 'Talk about hobbies and family.',
    icon: '👨‍👩‍👧‍👦',
    xpReward: 60,
    estimatedMinutes: 6,
    vocabWords: ['hobby', 'plan', 'family'],
    exercises: [
      { type: 'multiple_choice', q: 'Which word means parents and children?', ans: 'family', distractors: ['hobby', 'plan'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'I love my family', scrambled: ['I', 'love', 'my', 'family', 'plan'] }
    ]
  },
  {
    id: 'intermediate-1',
    moduleId: 'intermediate',
    moduleTitle: 'Intermediate',
    moduleBadge: '💬 Intermediate',
    title: 'Work & Communication',
    subtitle: 'Discuss plans and schedules.',
    icon: '💼',
    xpReward: 70,
    estimatedMinutes: 7,
    vocabWords: ['meeting', 'discuss', 'schedule'],
    exercises: [
      { type: 'multiple_choice', q: 'Which word means a plan of times?', ans: 'schedule', distractors: ['meeting', 'discuss'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'we have a meeting', scrambled: ['we', 'have', 'a', 'meeting', 'discuss'] }
    ]
  },
  {
    id: 'intermediate-2',
    moduleId: 'intermediate',
    moduleTitle: 'Intermediate',
    moduleBadge: '💬 Intermediate',
    title: 'Opinions & Experiences',
    subtitle: 'Share your thoughts and agree with others.',
    icon: '🧠',
    xpReward: 70,
    estimatedMinutes: 7,
    vocabWords: ['opinion', 'agree', 'story'],
    exercises: [
      { type: 'listen_choose', q: 'Listen and choose the word.', audio: 'opinion', ans: 'opinion', distractors: ['agree', 'story'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'I agree with you', scrambled: ['I', 'agree', 'with', 'you', 'opinion'] }
    ]
  },
  {
    id: 'upper-intermediate-1',
    moduleId: 'upper_intermediate',
    moduleTitle: 'Upper-Intermediate',
    moduleBadge: '⚖️ Upper-Intermediate',
    title: 'Problem Solving',
    subtitle: 'Resolve issues effectively.',
    icon: '🧩',
    xpReward: 80,
    estimatedMinutes: 8,
    vocabWords: ['alternative', 'resolve', 'effective'],
    exercises: [
      { type: 'matching', pairs: [{l: 'alternative', r: 'another option'}, {l: 'resolve', r: 'find a solution'}] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'this is an effective alternative', scrambled: ['this', 'is', 'an', 'effective', 'alternative'] }
    ]
  },
  {
    id: 'upper-intermediate-2',
    moduleId: 'upper_intermediate',
    moduleTitle: 'Upper-Intermediate',
    moduleBadge: '⚖️ Upper-Intermediate',
    title: 'Discussion & Debate',
    subtitle: 'Express nuanced arguments.',
    icon: '🗣️',
    xpReward: 80,
    estimatedMinutes: 8,
    vocabWords: ['argument', 'nuance', 'compare'],
    exercises: [
      { type: 'multiple_choice', q: 'Which word means a subtle difference?', ans: 'nuance', distractors: ['argument', 'compare'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'compare these two arguments', scrambled: ['compare', 'these', 'two', 'arguments', 'nuance'] }
    ]
  },
  {
    id: 'advanced-1',
    moduleId: 'advanced',
    moduleTitle: 'Advanced',
    moduleBadge: '🎓 Advanced',
    title: 'Professional Communication',
    subtitle: 'Implement and evaluate strategies.',
    icon: '📊',
    xpReward: 90,
    estimatedMinutes: 9,
    vocabWords: ['clarify', 'implement', 'evaluate'],
    exercises: [
      { type: 'multiple_choice', q: 'Which word means to put into action?', ans: 'implement', distractors: ['clarify', 'evaluate'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'we will evaluate the results', scrambled: ['we', 'will', 'evaluate', 'the', 'results'] }
    ]
  },
  {
    id: 'advanced-2',
    moduleId: 'advanced',
    moduleTitle: 'Advanced',
    moduleBadge: '🎓 Advanced',
    title: 'Advanced Reading',
    subtitle: 'Understand context and idioms.',
    icon: '📚',
    xpReward: 90,
    estimatedMinutes: 9,
    vocabWords: ['idiom', 'formal', 'context'],
    exercises: [
      { type: 'listen_choose', q: 'Listen and choose the word.', audio: 'context', ans: 'context', distractors: ['idiom', 'formal'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'look at the formal context', scrambled: ['look', 'at', 'the', 'formal', 'context'] }
    ]
  },
  {
    id: 'professional-1',
    moduleId: 'professional',
    moduleTitle: 'Professional',
    moduleBadge: '🏢 Professional',
    title: 'Business Meetings',
    subtitle: 'Negotiate and manage stakeholders.',
    icon: '📈',
    xpReward: 100,
    estimatedMinutes: 10,
    vocabWords: ['negotiation', 'stakeholder', 'revenue'],
    exercises: [
      { type: 'matching', pairs: [{l: 'revenue', r: 'company income'}, {l: 'stakeholder', r: 'interested party'}] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'the negotiation was successful', scrambled: ['the', 'negotiation', 'was', 'successful', 'revenue'] }
    ]
  },
  {
    id: 'professional-2',
    moduleId: 'professional',
    moduleTitle: 'Professional',
    moduleBadge: '🏢 Professional',
    title: 'Leadership & Presentations',
    subtitle: 'Collaborate and achieve objectives.',
    icon: '👑',
    xpReward: 100,
    estimatedMinutes: 10,
    vocabWords: ['presentation', 'objective', 'collaboration'],
    exercises: [
      { type: 'multiple_choice', q: 'Which word means working together?', ans: 'collaboration', distractors: ['presentation', 'objective'] },
      { type: 'sentence_builder', q: 'Build the sentence:', ans: 'our main objective is growth', scrambled: ['our', 'main', 'objective', 'is', 'growth'] }
    ]
  }
];

let lessonsOutput = `export interface VocabWord {
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
}

export const LESSONS_DATA: Lesson[] = [
`;

lessons.forEach((l, i) => {
  const vocabCode = l.vocabWords.map(w => {
    const d = dictionary.find(x => x[0] === w);
    return `{
        id: "v-${w}", word: "${w}", phonetic: "${d[1]}", emoji: "${l.icon}",
        translations: { Malayalam: "${d[5]}", Chinese: "${d[6]}", Hindi: "${d[7]}", Spanish: "${d[8]}", English: "${d[0]}" },
        exampleSentence: "${d[4]}", examplePhonetic: "", exampleTranslations: {}
      }`;
  }).join(',\n      ');

  const exerciseCode = l.exercises.map((ex, exIdx) => {
    if (ex.type === 'multiple_choice' || ex.type === 'listen_choose') {
      return `{
        id: "ex-${l.id}-${exIdx}", type: "${ex.type}", question: "${ex.q}", audioPrompt: "${ex.audio || ''}",
        options: [
          { text: "${ex.ans}", isCorrect: true },
          { text: "${ex.distractors[0]}", isCorrect: false },
          { text: "${ex.distractors[1]}", isCorrect: false }
        ],
        explanation: "The correct answer is ${ex.ans}."
      }`;
    } else if (ex.type === 'sentence_builder') {
      return `{
        id: "ex-${l.id}-${exIdx}", type: "sentence_builder", question: "${ex.q}",
        correctSentence: "${ex.ans}", scrambledWords: ${JSON.stringify(ex.scrambled)},
        explanation: "Correct order: ${ex.ans}."
      }`;
    } else if (ex.type === 'matching') {
      return `{
        id: "ex-${l.id}-${exIdx}", type: "matching", question: "Match the definitions",
        pairs: ${JSON.stringify(ex.pairs)},
        explanation: "Matching definitions."
      }`;
    }
  }).join(',\n      ');

  lessonsOutput += `  {
    id: "${l.id}",
    moduleId: "${l.moduleId}",
    moduleTitle: "${l.moduleTitle}",
    moduleBadge: "${l.moduleBadge}",
    title: "${l.title}",
    subtitle: "${l.subtitle}",
    icon: "${l.icon}",
    xpReward: ${l.xpReward},
    estimatedMinutes: ${l.estimatedMinutes},
    order: ${i + 1},
    vocabulary: [
      ${vocabCode}
    ],
    exercises: [
      ${exerciseCode}
    ]
  },\n`;
});

lessonsOutput += `];

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
`;

fs.writeFileSync('src/data/lessons.ts', lessonsOutput);
