const fs = require('fs');
let c = fs.readFileSync('src/app/api/auth/forgot-password/route.ts', 'utf8');
c = c.replace(
  /const emailResult = const baseUrl = new URL\(req\.url\)\.origin;\n    await sendPasswordResetEmail\(user\.email, user\.name, token, baseUrl\);/,
  'const baseUrl = new URL(req.url).origin;\n    const emailResult = await sendPasswordResetEmail(user.email, user.name, token, baseUrl);'
);
fs.writeFileSync('src/app/api/auth/forgot-password/route.ts', c);
