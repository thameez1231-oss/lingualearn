import { db } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth';
import { LESSONS_DATA } from '../src/data/lessons';
import { DICTIONARY_DATA } from '../src/data/dictionary';

async function seed() {
  console.log('🌱 Seeding starter data for LinguaLearn...');

  const passwordHash = await hashPassword('Password123!');

  // Create demo pre-verified user
  const demoUser = await db.user.upsert({
    where: { email: 'demo@lingualearn.com' },
    update: {},
    create: {
      name: 'Alex Kumar',
      email: 'demo@lingualearn.com',
      passwordHash,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      preferredLanguage: 'Malayalam',
      englishLevel: 'BEGINNER',
      onboardingCompleted: true,
      xp: 420,
      streak: 7,
      currentLessonId: 'everyday-intro',
    },
  });

  console.log(`✅ Demo user seeded: ${demoUser.email} (Password: Password123!)`);

  // Seed sample learned words for demo user
  for (const item of DICTIONARY_DATA.slice(0, 5)) {
    await db.learnedWord.upsert({
      where: {
        userId_word: {
          userId: demoUser.id,
          word: item.word,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        word: item.word,
        nativeTranslation: item.translations['Malayalam'] || '',
        definition: item.simpleDefinition,
        exampleSentence: item.exampleSentence,
        mastered: true,
      },
    });
  }

  // Seed initial daily goal
  const today = new Date().toISOString().split('T')[0];
  await db.dailyGoal.upsert({
    where: {
      userId_date: {
        userId: demoUser.id,
        date: today,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      date: today,
      wordsLearned: 3,
      wordsTarget: 5,
      lessonsCompleted: 1,
      lessonsTarget: 1,
      speakingMinutes: 4,
      speakingTarget: 5,
    },
  });

  console.log('🎉 Seed completed successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
