const fs = require('fs');
let content = fs.readFileSync('src/lib/progress.ts', 'utf-8');

content += `
import { LESSONS_DATA } from '@/data/lessons';

export function getHighestUnlockedOrder(completedLessonIds: string[]): number {
  let highestCompletedOrder = 0;
  
  for (const id of completedLessonIds) {
    const lesson = LESSONS_DATA.find(l => l.id === id);
    if (lesson && lesson.order > highestCompletedOrder) {
      highestCompletedOrder = lesson.order;
    }
  }
  
  return highestCompletedOrder + 1;
}

export function isLessonUnlocked(lessonId: string, completedLessonIds: string[]): boolean {
  const lesson = LESSONS_DATA.find(l => l.id === lessonId);
  if (!lesson) return false;
  
  const unlockedOrder = getHighestUnlockedOrder(completedLessonIds);
  return lesson.order <= unlockedOrder;
}
`;

fs.writeFileSync('src/lib/progress.ts', content);
