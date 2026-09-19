const fs = require('fs');
let c = fs.readFileSync('src/app/(auth)/verify-email/page.tsx', 'utf8');

c = c.replace(
  /const statusParam = searchParams.get\('status'\);/,
  "const statusParam = searchParams.get('status');\n  const errorParam = searchParams.get('error');"
);

c = c.replace(
  /const \[error, setError\] = useState\(''\);/,
  "const [error, setError] = useState(errorParam === 'invalid_token' ? 'The verification link is invalid. It may have been used already.' : errorParam === 'expired_token' ? 'The verification link has expired. Please request a new one.' : errorParam ? 'Verification failed.' : '');"
);

// We need to also REMOVE the client-side fetch from useEffect!
// Since the email link now points to /api/auth/verify-email, the API will handle the verification and REDIRECT back here.
// The client shouldn't try to fetch again, because the token might be removed already or it will just conflict!
// The client only needs to check for \status === 'success'\ or \errorParam\.

// Wait, the client-side fetch was using if (token). But now the email doesn't send ?token= to the PAGE, it sends it to the API!
// The API redirects to /verify-email?status=success or /verify-email?error=invalid_token.
// The ONLY time /verify-email?token=... would be accessed is if the old email link was clicked.
// If the old email link is clicked, the client fetch will still run. This provides BACKWARDS COMPATIBILITY for users who already got the email in the last 12 hours!
// This is perfectly robust.

fs.writeFileSync('src/app/(auth)/verify-email/page.tsx', c);
