const fs = require('fs');
let c = fs.readFileSync('src/app/api/auth/resend-verification/route.ts', 'utf8');
c = c.replace(
  /const emailResult = await sendVerificationEmail\(user\.email, user\.name, token\);/,
  'const baseUrl = new URL(req.url).origin;\n    const emailResult = await sendVerificationEmail(user.email, user.name, token, baseUrl);'
);
fs.writeFileSync('src/app/api/auth/resend-verification/route.ts', c);
