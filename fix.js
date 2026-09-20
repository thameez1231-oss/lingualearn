const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf-8');

const replacement = `export const dynamic = 'force-dynamic';
import { getUserProgressStats, calculateProgressPercentage } from '@/lib/progress';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!user.onboardingCompleted) {
    redirect('/onboarding');
  }

  const stats = await getUserProgressStats(user.id);
  user.xp = stats.xp;
  user.streak = stats.streak;

  const today = new Date().toISOString().split('T')[0];
  let dailyGoal = null;
  try {
    dailyGoal = await db.dailyGoal.findUnique({ where: { userId_date: { userId: user.id, date: today } } });
    if (!dailyGoal) { dailyGoal = await db.dailyGoal.create({ data: { userId: user.id, date: today } }); }
  } catch { dailyGoal = { wordsLearned: 0, speakingMinutes: 0, lessonsCompleted: 0 }; }

  const completedLessons = stats.completedLessonIds.map(id => ({ lessonId: id }));
  const learnedWordsCount = stats.learnedWordsCount;
  const speakingCount = stats.speakingCount;
`;

const pattern = /export default async function DashboardPage\(\) \{[\s\S]*?(?=  \/\/ Current lesson)/;
content = content.replace(pattern, replacement);
fs.writeFileSync('src/app/dashboard/page.tsx', content);
