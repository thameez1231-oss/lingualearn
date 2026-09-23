const fs = require('fs');

const LEVEL_DEFINITIONS = [
  { id: 'beginner', title: 'BEGINNER', badge: 'Beginner' },
  { id: 'elementary', title: 'ELEMENTARY', badge: 'Elementary' },
  { id: 'intermediate', title: 'INTERMEDIATE', badge: 'Intermediate' },
  { id: 'upper_intermediate', title: 'UPPER_INTERMEDIATE', badge: 'Upper-Int' },
  { id: 'advanced', title: 'ADVANCED', badge: 'Advanced' },
  { id: 'professional', title: 'PROFESSIONAL', badge: 'Professional' },
];

const VOCAB_DATA = {
  beginner: [
    ['wake', 'wayk', 'To stop sleeping.', 'I wake up at seven.'],
    ['sleep', 'sleep', 'To rest with eyes closed.', 'I sleep at night.'],
    ['eat', 'eet', 'To consume food.', 'I eat breakfast.'],
    ['price', 'prys', 'How much money something costs.', 'What is the price?'],
    ['buy', 'by', 'To pay for something.', 'I want to buy this.'],
    ['cheap', 'cheep', 'Not expensive.', 'This is very cheap.'],
    ['name', 'naym', 'What you are called.', 'My name is John.'],
    ['hello', 'heh-LOH', 'A greeting.', 'Hello, how are you?'],
    ['good', 'good', 'Not bad.', 'This is good.'],
    ['water', 'WAH-ter', 'A clear liquid you drink.', 'I need water.'],
    ['food', 'food', 'What you eat.', 'The food is good.'],
    ['home', 'hohm', 'Where you live.', 'I go home.'],
  ],
  elementary: [
    ['station', 'STAY-shun', 'A place where trains stop.', 'Where is the train station?'],
    ['left', 'left', 'Direction opposite of right.', 'Turn left here.'],
    ['ticket', 'TIK-it', 'Paper to travel.', 'I need a ticket.'],
    ['hobby', 'HOB-ee', 'Activity done for fun.', 'What is your hobby?'],
    ['plan', 'plan', 'Idea for what to do.', 'Do you have a plan?'],
    ['family', 'FAM-ih-lee', 'Parents and children.', 'I love my family.'],
    ['morning', 'MOR-ning', 'Early part of the day.', 'Good morning.'],
    ['always', 'AWL-wayz', 'At all times.', 'I always study.'],
    ['never', 'NEV-er', 'At no time.', 'I never smoke.'],
    ['friend', 'frend', 'Someone you like.', 'He is my friend.'],
    ['visit', 'VIZ-it', 'To go see someone.', 'I visit my family.'],
    ['often', 'AWF-en', 'Many times.', 'I often travel.'],
  ],
  intermediate: [
    ['meeting', 'MEE-ting', 'People coming together.', 'We have a meeting.'],
    ['discuss', 'dih-SKUS', 'To talk about something.', 'Let us discuss this.'],
    ['schedule', 'SKEJ-ool', 'A plan of times.', 'My schedule is full.'],
    ['opinion', 'uh-PIN-yun', 'What you think about something.', 'In my opinion, it is good.'],
    ['agree', 'uh-GREE', 'To have the same opinion.', 'I agree with you.'],
    ['story', 'STOR-ee', 'A tale of events.', 'Tell me a story.'],
    ['challenge', 'CHAL-inj', 'Something difficult.', 'This is a challenge.'],
    ['decide', 'dih-SYD', 'To make a choice.', 'I must decide now.'],
    ['improve', 'im-PROOV', 'To get better.', 'I want to improve.'],
    ['focus', 'FOH-kus', 'To pay attention.', 'I need to focus.'],
    ['goal', 'gohl', 'What you want to achieve.', 'My goal is to win.'],
    ['achieve', 'uh-CHEEV', 'To succeed in doing.', 'I will achieve it.'],
  ],
  upper_intermediate: [
    ['alternative', 'awl-TUR-nuh-tiv', 'Another option.', 'We need an alternative.'],
    ['resolve', 'rih-ZOLV', 'To find a solution.', 'We must resolve this problem.'],
    ['effective', 'ih-FEK-tiv', 'Successful in producing a result.', 'This is an effective method.'],
    ['argument', 'AR-gyoo-ment', 'A reason given in debate.', 'That is a strong argument.'],
    ['nuance', 'NOO-ahns', 'A subtle difference.', 'Understand the nuance of the word.'],
    ['compare', 'kum-PAIR', 'To look at similarities and differences.', 'Compare these two ideas.'],
    ['essential', 'ih-SEN-shul', 'Absolutely necessary.', 'Water is essential.'],
    ['contribute', 'kun-TRIB-yoot', 'To give to help achieve something.', 'I want to contribute.'],
    ['analyze', 'AN-uh-lyz', 'To study closely.', 'Analyze the data.'],
    ['strategy', 'STRAT-ih-jee', 'A plan of action.', 'We need a new strategy.'],
    ['evidence', 'EV-ih-duns', 'Facts that prove something.', 'Show me the evidence.'],
    ['impact', 'IM-pakt', 'A strong effect.', 'This has a big impact.'],
  ],
  advanced: [
    ['clarify', 'KLAR-ih-fy', 'To make something clear.', 'Please clarify your point.'],
    ['implement', 'IM-pluh-ment', 'To put into action.', 'We will implement the plan.'],
    ['evaluate', 'ih-VAL-yoo-ayt', 'To judge the value.', 'Evaluate the results.'],
    ['idiom', 'ID-ee-um', 'A phrase with figurative meaning.', 'That is a common English idiom.'],
    ['formal', 'FOR-mul', 'Proper and official.', 'This is a formal letter.'],
    ['context', 'KON-tekst', 'The situation surrounding an event.', 'Look at the context.'],
    ['perspective', 'per-SPEK-tiv', 'A way of thinking.', 'From my perspective, yes.'],
    ['ambiguous', 'am-BIG-yoo-us', 'Having more than one meaning.', 'The rules are ambiguous.'],
    ['coherent', 'koh-HEER-unt', 'Logical and consistent.', 'Make a coherent argument.'],
    ['facilitate', 'fuh-SIL-ih-tayt', 'To make easier.', 'I will facilitate the meeting.'],
    ['comprehensive', 'kom-prih-HEN-siv', 'Complete and including everything.', 'A comprehensive report.'],
    ['innovative', 'IN-uh-vay-tiv', 'Using new ideas.', 'An innovative solution.'],
  ],
  professional: [
    ['negotiation', 'nih-goh-shee-AY-shun', 'Discussion aimed at reaching an agreement.', 'The negotiation was tough.'],
    ['stakeholder', 'STAYK-hohl-der', 'Person with an interest in a business.', 'Meet the stakeholder.'],
    ['revenue', 'REV-uh-noo', 'Income for a company.', 'Revenue increased this year.'],
    ['presentation', 'prez-en-TAY-shun', 'A formal talk showing information.', 'Give a good presentation.'],
    ['objective', 'ub-JEK-tiv', 'A goal or purpose.', 'Our objective is clear.'],
    ['collaboration', 'kuh-lab-uh-RAY-shun', 'Working together.', 'Collaboration is key.'],
    ['synergy', 'SIN-er-jee', 'Combined power of a group.', 'We need team synergy.'],
    ['leverage', 'LEV-er-ij', 'To use to maximum advantage.', 'Leverage our assets.'],
    ['benchmark', 'BENCH-mark', 'A standard to measure against.', 'Set a new benchmark.'],
    ['liability', 'ly-uh-BIL-ih-tee', 'State of being responsible.', 'Reduce our liability.'],
    ['equity', 'EK-wih-tee', 'Fairness or shares in a company.', 'Build brand equity.'],
    ['scalable', 'SKAY-luh-bul', 'Able to be changed in size or scale.', 'A scalable business model.'],
  ]
};

let orderCounter = 1;
const lessonsDataArray = [];

function generateExercisesForVocab(lessonId, vocabList) {
  const ex = [];
  vocabList.forEach((v, idx) => {
    ex.push({
      id: 'ex-' + lessonId + '-' + idx + '-0',
      type: 'multiple_choice',
      question: 'Which word means "' + v.definition + '"?',
      audioPrompt: '',
      options: [
        { text: v.word, isCorrect: true },
        { text: 'random', isCorrect: false }
      ],
      explanation: 'The correct word is ' + v.word + '.'
    });
  });
  
  ex.push({
    id: 'ex-' + lessonId + '-sb',
    type: 'sentence_builder',
    question: 'Build the correct sentence:',
    correctSentence: vocabList[0].exampleSentence,
    scrambledWords: vocabList[0].exampleSentence.replace(/[.,!?]/g, '').split(' ').sort(() => Math.random() - 0.5),
    explanation: 'Correct sentence: ' + vocabList[0].exampleSentence
  });
  return ex;
}

LEVEL_DEFINITIONS.forEach(level => {
  const words = VOCAB_DATA[level.id];
  const lessonCount = 4;
  const vocabPerLesson = 3;
  const allVocabForCheckpoint = [];

  for (let i = 0; i < lessonCount; i++) {
    const lessonVocab = words.slice(i * vocabPerLesson, (i + 1) * vocabPerLesson);
    const lessonId = level.id + '-' + (i + 1);
    const vocabObjects = lessonVocab.map((v, vidx) => {
      const vObj = {
        id: 'v-' + lessonId + '-' + vidx,
        word: v[0],
        phonetic: v[1],
        emoji: '💡',
        translations: { Malayalam: 'Translation', English: v[0] },
        exampleSentence: v[3],
        examplePhonetic: '',
        exampleTranslations: {},
        definition: v[2]
      };
      allVocabForCheckpoint.push(vObj);
      return vObj;
    });

    lessonsDataArray.push({
      id: lessonId,
      moduleId: level.id,
      moduleTitle: level.title,
      moduleBadge: level.badge,
      title: 'Lesson ' + (i + 1),
      subtitle: 'Learn ' + lessonVocab.length + ' new words.',
      icon: '📖',
      xpReward: 50,
      estimatedMinutes: 5,
      order: orderCounter++,
      isCheckpoint: false,
      vocabulary: vocabObjects.map(v => {
        const copy = {...v};
        delete copy.definition;
        return copy;
      }),
      exercises: generateExercisesForVocab(lessonId, vocabObjects)
    });
  }

  const cpId = 'checkpoint-' + level.id;
  const cpExercises = [];
  const selectedVocab = [...allVocabForCheckpoint].sort(() => Math.random() - 0.5).slice(0, 5);
  
  selectedVocab.forEach((v, idx) => {
    cpExercises.push({
      id: 'ex-chk-' + level.id + '-' + idx,
      type: 'multiple_choice',
      question: 'Checkpoint Question: Which word means "' + v.definition + '"?',
      audioPrompt: '',
      options: [
        { text: v.word, isCorrect: true },
        { text: 'wrong', isCorrect: false },
        { text: 'incorrect', isCorrect: false }
      ],
      explanation: 'The correct word is ' + v.word + '.'
    });
  });

  lessonsDataArray.push({
    id: cpId,
    moduleId: level.id,
    moduleTitle: level.title,
    moduleBadge: level.badge,
    title: 'Checkpoint: ' + level.title,
    subtitle: 'Pass this checkpoint with 80% to unlock the next level.',
    icon: '🎯',
    xpReward: 100,
    estimatedMinutes: 10,
    order: orderCounter++,
    isCheckpoint: true,
    vocabulary: [],
    exercises: cpExercises
  });
});

const output = "export interface VocabWord { id: string; word: string; phonetic: string; emoji: string; translations: Record<string, string>; exampleSentence: string; examplePhonetic: string; exampleTranslations: Record<string, string>; }\\n\\n" +
"export interface ExerciseItem { id: string; type: 'multiple_choice' | 'matching' | 'listen_choose' | 'sentence_builder' | 'translation'; question: string; hint?: string; audioPrompt?: string; options?: { text: string; subtext?: string; isCorrect: boolean }[]; pairs?: { left: string; right: string }[]; scrambledWords?: string[]; correctSentence?: string; explanation: string; }\\n\\n" +
"export interface Lesson { id: string; moduleId: string; moduleTitle: string; moduleBadge: string; title: string; subtitle: string; icon: string; xpReward: number; estimatedMinutes: number; vocabulary: VocabWord[]; exercises: ExerciseItem[]; order: number; isCheckpoint?: boolean; }\\n\\n" +
"export const LESSONS_DATA: Lesson[] = " + JSON.stringify(lessonsDataArray, null, 2) + ";\\n\\n" +
"export function getLessonById(id: string): Lesson | undefined { return LESSONS_DATA.find((lesson) => lesson.id === id); }\\n" +
"export function getNextLessonId(currentLessonId: string): string { const currentIndex = LESSONS_DATA.findIndex((l) => l.id === currentLessonId); if (currentIndex === -1 || currentIndex === LESSONS_DATA.length - 1) { return currentLessonId; } return LESSONS_DATA[currentIndex + 1].id; }\\n";

fs.writeFileSync('src/data/lessons.ts', output.replace(/\\\\n/g, '\\n'));
console.log('Done!');
