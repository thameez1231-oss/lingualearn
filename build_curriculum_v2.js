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

const modules = [
  { id: 'beginner', badge: '🌟 Beginner' },
  { id: 'elementary', badge: '🚶 Elementary' },
  { id: 'intermediate', badge: '💬 Intermediate' },
  { id: 'upper_intermediate', badge: '⚖️ Upper-Intermediate' },
  { id: 'advanced', badge: '🎓 Advanced' },
  { id: 'professional', badge: '🏢 Professional' }
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
  isCheckpoint?: boolean;
}

export const LESSONS_DATA: Lesson[] = [
`;

const lessons = [
  { id: 'beginner-1', moduleId: 'beginner', title: 'Everyday Activities', subtitle: 'Learn to talk about your daily routine.', icon: '🌅', vocabWords: ['wake', 'sleep', 'eat'] },
  { id: 'beginner-2', moduleId: 'beginner', title: 'Shopping & Basic Requests', subtitle: 'Learn to buy things and ask for prices.', icon: '🛒', vocabWords: ['price', 'buy', 'cheap'] },
  
  { id: 'elementary-1', moduleId: 'elementary', title: 'Travel & Directions', subtitle: 'Navigate the city and take transport.', icon: '🚉', vocabWords: ['station', 'left', 'ticket'] },
  { id: 'elementary-2', moduleId: 'elementary', title: 'Daily Conversations', subtitle: 'Talk about hobbies and family.', icon: '👨‍👩‍👧‍👦', vocabWords: ['hobby', 'plan', 'family'] },
  
  { id: 'intermediate-1', moduleId: 'intermediate', title: 'Work & Communication', subtitle: 'Discuss plans and schedules.', icon: '💼', vocabWords: ['meeting', 'discuss', 'schedule'] },
  { id: 'intermediate-2', moduleId: 'intermediate', title: 'Opinions & Experiences', subtitle: 'Share your thoughts and agree with others.', icon: '🧠', vocabWords: ['opinion', 'agree', 'story'] },
  
  { id: 'upper-intermediate-1', moduleId: 'upper_intermediate', title: 'Problem Solving', subtitle: 'Resolve issues effectively.', icon: '🧩', vocabWords: ['alternative', 'resolve', 'effective'] },
  { id: 'upper-intermediate-2', moduleId: 'upper_intermediate', title: 'Discussion & Debate', subtitle: 'Express nuanced arguments.', icon: '🗣️', vocabWords: ['argument', 'nuance', 'compare'] },
  
  { id: 'advanced-1', moduleId: 'advanced', title: 'Professional Communication', subtitle: 'Implement and evaluate strategies.', icon: '📊', vocabWords: ['clarify', 'implement', 'evaluate'] },
  { id: 'advanced-2', moduleId: 'advanced', title: 'Advanced Reading', subtitle: 'Understand context and idioms.', icon: '📚', vocabWords: ['idiom', 'formal', 'context'] },
  
  { id: 'professional-1', moduleId: 'professional', title: 'Business Meetings', subtitle: 'Negotiate and manage stakeholders.', icon: '📈', vocabWords: ['negotiation', 'stakeholder', 'revenue'] },
  { id: 'professional-2', moduleId: 'professional', title: 'Leadership & Presentations', subtitle: 'Collaborate and achieve objectives.', icon: '👑', vocabWords: ['presentation', 'objective', 'collaboration'] },
];

let globalOrder = 1;

for (const mod of modules) {
  const modLessons = lessons.filter(l => l.moduleId === mod.id);
  
  for (const l of modLessons) {
    const vocabCode = l.vocabWords.map(w => {
      const d = dictionary.find(x => x[0] === w);
      return `{
        id: "v-${w}", word: "${w}", phonetic: "${d[1]}", emoji: "${l.icon}",
        translations: { Malayalam: "${d[5]}", Chinese: "${d[6]}", Hindi: "${d[7]}", Spanish: "${d[8]}", English: "${d[0]}" },
        exampleSentence: "${d[4]}", examplePhonetic: "", exampleTranslations: {}
      }`;
    }).join(',\n      ');
    
    // Add two exercises
    const exAns = l.vocabWords[0];
    const exDis1 = l.vocabWords[1];
    const exDis2 = l.vocabWords[2];
    
    const exerciseCode = `
      {
        id: "ex-${l.id}-0", type: "multiple_choice", question: "Which word is correct?", audioPrompt: "",
        options: [
          { text: "${exAns}", isCorrect: true },
          { text: "${exDis1}", isCorrect: false },
          { text: "${exDis2}", isCorrect: false }
        ],
        explanation: "The correct answer is ${exAns}."
      },
      {
        id: "ex-${l.id}-1", type: "sentence_builder", question: "Build a sentence:",
        correctSentence: "this is ${exAns}", scrambledWords: ["this", "is", "${exAns}", "${exDis1}"],
        explanation: "Correct order: this is ${exAns}."
      }
    `;
    
    lessonsOutput += `  {
    id: "${l.id}",
    moduleId: "${l.moduleId}",
    moduleTitle: "${mod.id.toUpperCase()}",
    moduleBadge: "${mod.badge}",
    title: "${l.title}",
    subtitle: "${l.subtitle}",
    icon: "${l.icon}",
    xpReward: 50,
    estimatedMinutes: 5,
    order: ${globalOrder},
    vocabulary: [${vocabCode}],
    exercises: [${exerciseCode}]
  },\n`;
    globalOrder++;
    
    // ADD CHECKPOINT AFTER EACH LESSON
    lessonsOutput += `  {
    id: "checkpoint-${l.id}",
    moduleId: "${l.moduleId}",
    moduleTitle: "${mod.id.toUpperCase()}",
    moduleBadge: "${mod.badge}",
    title: "Checkpoint: ${l.title}",
    subtitle: "Pass this checkpoint to unlock the next lesson.",
    icon: "🎯",
    xpReward: 50,
    estimatedMinutes: 3,
    order: ${globalOrder},
    isCheckpoint: true,
    vocabulary: [],
    exercises: [
      {
        id: "ex-chk-${l.id}-0", type: "multiple_choice", question: "Checkpoint Question: Select the correct word.", audioPrompt: "",
        options: [
          { text: "${exAns}", isCorrect: true },
          { text: "Wrong", isCorrect: false }
        ],
        explanation: "Checkpoint passed."
      }
    ]
  },\n`;
    globalOrder++;
  }
}

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
