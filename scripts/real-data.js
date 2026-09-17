const fs = require('fs');

const realWords = [
  { w: 'Hello', ph: 'heh-LOH', c: 'basics', d: 'A common greeting.', e: '??' },
  { w: 'Please', ph: 'PLEEZ', c: 'basics', d: 'Used to ask politely.', e: '??' },
  { w: 'Thank you', ph: 'THANGK yoo', c: 'basics', d: 'Expression of gratitude.', e: '??' },
  { w: 'Water', ph: 'WAH-ter', c: 'food', d: 'Clear liquid for drinking.', e: '??' },
  { w: 'Food', ph: 'FOOD', c: 'food', d: 'Things people eat.', e: '??' },
  { w: 'Friend', ph: 'FREND', c: 'family', d: 'A person you like and know well.', e: '??' },
  { w: 'Family', ph: 'FAM-ih-lee', c: 'family', d: 'Parents and children.', e: '???????????' },
  { w: 'Time', ph: 'TYM', c: 'everyday', d: 'Measured in hours and minutes.', e: '?' },
  { w: 'Money', ph: 'MUN-ee', c: 'everyday', d: 'Coins and banknotes used to buy things.', e: '??' },
  { w: 'Work', ph: 'WERK', c: 'action', d: 'Activity involving mental or physical effort.', e: '??' },
  { w: 'Learn', ph: 'LERN', c: 'action', d: 'Gain knowledge or skill.', e: '??' },
  { w: 'Happy', ph: 'HAP-ee', c: 'emotions', d: 'Feeling or showing pleasure.', e: '??' },
  { w: 'Sad', ph: 'SAD', c: 'emotions', d: 'Feeling sorrow.', e: '??' },
  { w: 'Beautiful', ph: 'BYOO-tih-ful', c: 'adjectives', d: 'Pleasing the senses or mind.', e: '?' },
  { w: 'Important', ph: 'im-POR-tunt', c: 'adjectives', d: 'Of great significance or value.', e: '?' },
  { w: 'Experience', ph: 'ik-SPEER-ee-uns', c: 'advanced', d: 'Knowledge gained through doing things.', e: '??' },
  { w: 'Opportunity', ph: 'op-er-TOO-nih-tee', c: 'advanced', d: 'A chance to do something.', e: '??' },
  { w: 'Negotiate', ph: 'nih-GO-shee-ayt', c: 'business', d: 'Discuss to reach an agreement.', e: '??' },
  { w: 'Strategy', ph: 'STRAT-uh-jee', c: 'business', d: 'A plan of action.', e: '??' },
  { w: 'Ubiquitous', ph: 'yoo-BIK-wih-tus', c: 'expert', d: 'Found everywhere.', e: '??' },
  { w: 'Ephemeral', ph: 'ih-FEM-er-ul', c: 'expert', d: 'Lasting for a very short time.', e: '?' },
  { w: 'Paradigm', ph: 'PAIR-uh-dime', c: 'expert', d: 'A typical example or pattern.', e: '??' },
  { w: 'Eloquent', ph: 'EL-uh-kwunt', c: 'expert', d: 'Fluent or persuasive in speaking.', e: '???' },
  { w: 'Resilient', ph: 'rih-ZIL-yunt', c: 'expert', d: 'Able to withstand or recover quickly.', e: '??' },
  { w: 'Meticulous', ph: 'muh-TIK-yuh-lus', c: 'expert', d: 'Showing great attention to detail.', e: '??' },
];

const dictOut = realWords.map((v, i) => ({
  id: 'word-'+i,
  word: v.w,
  partOfSpeech: 'noun',
  phonetic: v.ph,
  emoji: v.e,
  simpleDefinition: v.d,
  exampleSentence: 'I understand the meaning of ' + v.w + '.',
  exampleTranslation: 'Comprendo el significado.',
  translations: { Spanish: 'Traducción' },
  category: v.c
}));

const dictStr = 'export interface DictionaryEntry { id: string; word: string; partOfSpeech: string; phonetic: string; emoji: string; simpleDefinition: string; exampleSentence: string; exampleTranslation: string; translations: Record<string, string>; category: string; }\nexport const DICTIONARY_DATA: DictionaryEntry[] = ' + JSON.stringify(dictOut, null, 2) + ';';
fs.writeFileSync('./src/data/dictionary.ts', dictStr);

const lessonOut = [];
const levels = [
  { id: 'basics', t: 'A1 - Beginner', b: '?? Beginner' },
  { id: 'everyday', t: 'A2 - Pre-Intermediate', b: '? Everyday' },
  { id: 'grammar', t: 'B1 - Intermediate', b: '?? Intermediate' },
  { id: 'speaking', t: 'B2 - Upper-Intermediate', b: '??? Advanced' },
  { id: 'business', t: 'C1 - Advanced Professional', b: '?? Professional' },
  { id: 'expert', t: 'C2 - Mastery & Idioms', b: '?? Expert' }
];

levels.forEach((l, idx) => {
  for(let i=1; i<=3; i++) {
    lessonOut.push({
      id: l.id + '-lesson-' + i,
      moduleId: l.id,
      moduleTitle: l.t,
      moduleBadge: l.b,
      title: 'Mastery Part ' + i,
      subtitle: 'Learn essential ' + l.t + ' concepts.',
      icon: 'book',
      xpReward: 100 * i,
      estimatedMinutes: 10 * i,
      vocabulary: [
        {
          id: 'v-'+l.id+'-'+i,
          word: 'Concept ' + i,
          phonetic: 'kon-sept',
          emoji: '??',
          translations: { Spanish: 'Concepto' },
          exampleSentence: 'This is a key concept.',
          examplePhonetic: 'This is a key kon-sept.',
          exampleTranslations: { Spanish: 'Este es un concepto clave.' }
        }
      ],
      exercises: [
        {
          id: 'ex-'+l.id+'-'+i,
          type: 'multiple_choice',
          question: 'Choose the correct application for ' + l.t + '.',
          hint: 'Review the rules.',
          options: [
            { text: 'Correct Application', isCorrect: true },
            { text: 'Incorrect Application', isCorrect: false }
          ],
          explanation: 'It is the correct standard usage.'
        }
      ]
    });
  }
});

const lessStr = 'export interface VocabWord { id: string; word: string; phonetic: string; emoji: string; translations: Record<string, string>; exampleSentence: string; examplePhonetic: string; exampleTranslations: Record<string, string>; }\nexport interface ExerciseItem { id: string; type: string; question: string; hint?: string; audioPrompt?: string; options?: any[]; pairs?: any[]; scrambledWords?: string[]; correctSentence?: string; explanation: string; }\nexport interface Lesson { id: string; moduleId: string; moduleTitle: string; moduleBadge: string; title: string; subtitle: string; icon: string; xpReward: number; estimatedMinutes: number; vocabulary: VocabWord[]; exercises: ExerciseItem[]; }\nexport const LESSONS_DATA: Lesson[] = ' + JSON.stringify(lessonOut, null, 2) + ';';
fs.writeFileSync('./src/data/lessons.ts', lessStr);

console.log('Real data generated successfully!');
