const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const replacement = `
  const currentLesson = getLessonById(user.currentLessonId || 'beginner-1') || LESSONS_DATA[0];
  const currentModuleId = currentLesson.moduleId;
  const lessonsInModule = LESSONS_DATA.filter(l => l.moduleId === currentModuleId);
  const totalLessonsInModule = lessonsInModule.length;
  const completedInModule = lessonsInModule.filter(l => stats.completedLessonIds.includes(l.id)).length;
  const progressPercent = totalLessonsInModule > 0 ? Math.round((completedInModule / totalLessonsInModule) * 100) : 0;

  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const levelTitle = currentLesson.moduleTitle + ' - ' + currentLesson.moduleBadge;
`;

code = code.replace(
  /  \/\/ Current lesson[\s\S]*?: 'Level 4 [^\n]*';/,
  replacement.trim()
);

fs.writeFileSync('src/app/dashboard/page.tsx', code);
console.log('Fixed dashboard');
