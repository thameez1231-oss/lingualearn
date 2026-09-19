const fs = require('fs');
let c = fs.readFileSync('src/app/api/auth/verify-email/route.ts', 'utf8');
c = c.replace(
  /new URL\('\/login\?error=missing_token', req\.url\)/g,
  'new URL(\'/verify-email?error=missing_token\', req.url)'
);
c = c.replace(
  /new URL\('\/login\?error=invalid_token', req\.url\)/g,
  'new URL(\'/verify-email?error=invalid_token\', req.url)'
);
c = c.replace(
  /new URL\('\/login\?error=expired_token', req\.url\)/g,
  'new URL(\'/verify-email?error=expired_token\', req.url)'
);
fs.writeFileSync('src/app/api/auth/verify-email/route.ts', c);
