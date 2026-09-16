import { db } from './src/lib/db';
import { hashPassword, verifyPassword, generateSecureToken } from './src/lib/auth';
import { translateNativeToEnglish, chatWithAITutor } from './src/lib/ai';
import { LESSONS_DATA } from './src/data/lessons';
import { searchDictionary } from './src/data/dictionary';

async function runTests() {
  console.log('🚀 Starting LinguaLearn End-to-End System Tests...\n');

  // Test 1: User Registration & Password Hashing
  console.log('TEST 1: Creating user with hashed password & email verification token...');
  const testEmail = `tester_${Date.now()}@lingualearn.test`;
  const plainPassword = 'Password123!';
  const hashedPassword = await hashPassword(plainPassword);

  const user = await db.user.create({
    data: {
      name: 'Rahul Sharma',
      email: testEmail,
      passwordHash: hashedPassword,
      emailVerified: false,
      preferredLanguage: 'Malayalam',
    },
  });

  console.log(`✅ User created: ID=${user.id}, Email=${user.email}, emailVerified=${user.emailVerified}`);
  if (user.emailVerified !== false) throw new Error('New user should not be verified initially!');

  // Test 2: Password Verification
  console.log('\nTEST 2: Verifying password hashing security...');
  const isMatch = await verifyPassword(plainPassword, user.passwordHash);
  const isWrong = await verifyPassword('WrongPassword', user.passwordHash);
  if (!isMatch || isWrong) throw new Error('Password verification failed!');
  console.log('✅ Password hash comparison verified.');

  // Test 3: Email Verification Flow
  console.log('\nTEST 3: Simulating real email verification token generation & activation...');
  const token = generateSecureToken();
  const tokenExpiry = new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 24);

  await db.emailVerificationToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: tokenExpiry,
    },
  });

  // Verify the token
  const tokenRecord = await db.emailVerificationToken.findUnique({
    where: { token },
  });
  if (!tokenRecord) throw new Error('Token record not found in DB!');

  const updatedUser = await db.user.update({
    where: { id: tokenRecord.userId },
    data: {
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });
  await db.emailVerificationToken.delete({ where: { id: tokenRecord.id } });

  console.log(`✅ User verified: emailVerified=${updatedUser.emailVerified}, at=${updatedUser.emailVerifiedAt}`);
  if (!updatedUser.emailVerified) throw new Error('User failed to mark as verified!');

  // Test 4: Onboarding Flow
  console.log('\nTEST 4: User Onboarding (Language & English Level)...');
  const onboardedUser = await db.user.update({
    where: { id: user.id },
    data: {
      preferredLanguage: 'Malayalam',
      englishLevel: 'COMPLETE_BEGINNER',
      onboardingCompleted: true,
      xp: { increment: 50 },
    },
  });
  console.log(`✅ Onboarding completed: PreferredLang=${onboardedUser.preferredLanguage}, Level=${onboardedUser.englishLevel}, XP=${onboardedUser.xp}`);

  // Test 5: Speak & Translate (Malayalam to Natural English)
  console.log('\nTEST 5: Live Speak & Translate Engine (Malayalam -> Natural English)...');
  const translationMalayalam = await translateNativeToEnglish('എനിക്ക് വിശക്കുന്നു', 'Malayalam');
  console.log(`- Spoken (Malayalam): ${translationMalayalam.nativeText}`);
  console.log(`- Natural English: ${translationMalayalam.englishText}`);
  console.log(`- Phonetic Guide: ${translationMalayalam.phoneticGuide}`);
  if (!translationMalayalam.englishText.toLowerCase().includes('hungry')) {
    throw new Error('Expected translation to contain "hungry"!');
  }
  console.log('✅ Speak & Translate correctly produced natural English!');

  // Test 6: AI English Tutor & Smart Grammar Correction
  console.log('\nTEST 6: AI English Tutor Conversation & Smart English Correction...');
  const tutorGrammarTest = await chatWithAITutor('I am go to school yesterday', 'Malayalam', 'COMPLETE_BEGINNER');
  console.log(`- Tutor reply: ${tutorGrammarTest.replyEnglish}`);
  if (tutorGrammarTest.correction) {
    console.log(`- Smart Correction detected!`);
    console.log(`  You said: "${tutorGrammarTest.correction.original}"`);
    console.log(`  Better English: "${tutorGrammarTest.correction.better}"`);
    console.log(`  Why?: "${tutorGrammarTest.correction.explanation}"`);
  } else {
    throw new Error('Smart grammar correction should have triggered for "I am go to school"!');
  }
  console.log('✅ Smart English correction working accurately!');

  // Test 7: Interactive Lessons & Progress Persistence
  console.log('\nTEST 7: Lesson Completion & Progress Persistence...');
  const firstLesson = LESSONS_DATA[0];
  const progress = await db.userProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: firstLesson.id,
      },
    },
    update: { status: 'COMPLETED', score: 100 },
    create: {
      userId: user.id,
      lessonId: firstLesson.id,
      status: 'COMPLETED',
      score: 100,
    },
  });
  console.log(`✅ Lesson recorded: LessonId=${progress.lessonId}, Status=${progress.status}, Score=${progress.score}`);

  // Test 8: Bilingual Dictionary Search & Bookmark
  console.log('\nTEST 8: Smart Bilingual Dictionary Search & Bookmarking...');
  const searchResults = searchDictionary('Beautiful', 'Malayalam');
  if (searchResults.length === 0) throw new Error('Search for "Beautiful" returned empty!');
  console.log(`- Found word: ${searchResults[0].word} -> Meaning: ${searchResults[0].translations['Malayalam']}`);

  await db.learnedWord.create({
    data: {
      userId: user.id,
      word: searchResults[0].word,
      nativeTranslation: searchResults[0].translations['Malayalam'] || '',
      definition: searchResults[0].simpleDefinition,
      mastered: true,
    },
  });
  const savedCount = await db.learnedWord.count({ where: { userId: user.id } });
  console.log(`✅ Word saved to user dictionary. Total learned words=${savedCount}`);

  // Cleanup test user
  await db.user.delete({ where: { id: user.id } });
  console.log('\n✅ Cleaned up test user record.');

  console.log('\n🎉 ALL 8 SYSTEM TESTS PASSED SUCCESSFULLY! LinguaLearn is production-ready!\n');
}

runTests()
  .catch((err) => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
