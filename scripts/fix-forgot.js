const fs = require('fs');
let c = fs.readFileSync('src/app/api/auth/forgot-password/route.ts', 'utf8');
c = c.replace(
  /await sendPasswordResetEmail\(user\.email, user\.name, token\);/,
  'const baseUrl = new URL(req.url).origin;\n    await sendPasswordResetEmail(user.email, user.name, token, baseUrl);'
);
fs.writeFileSync('src/app/api/auth/forgot-password/route.ts', c);
