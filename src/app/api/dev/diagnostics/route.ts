import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  const dbUrl = process.env.DATABASE_URL || 'missing';
  let dbType = 'unknown';
  if (dbUrl.startsWith('postgresql') || dbUrl.startsWith('postgres')) {
    dbType = 'postgresql';
  } else if (dbUrl.startsWith('file:') || dbUrl.includes('sqlite')) {
    dbType = 'sqlite (WARNING: ephemeral in Vercel)';
  } else if (dbUrl === 'missing') {
    dbType = 'missing';
  }
  
  const diagnostics = {
    SMTP_HOST: host ? 'configured' : 'missing',
    SMTP_PORT: process.env.SMTP_PORT ? 'configured' : 'missing',
    SMTP_USER: user ? 'configured' : 'missing',
    SMTP_PASS: pass ? 'configured' : 'missing',
    SMTP_FROM: process.env.SMTP_FROM ? 'configured' : 'missing',
    resolvedPort: port,
    secure: port === 465,
    DATABASE_TYPE: dbType,
    testResult: 'pending',
    errorMsg: null as string | null
  };

  if (!host || !user || !pass) {
    diagnostics.testResult = 'skipped - missing SMTP credentials';
    return NextResponse.json(diagnostics);
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.verify();
    diagnostics.testResult = 'success - verified connection';
  } catch (err: any) {
    diagnostics.testResult = 'failed';
    diagnostics.errorMsg = err.message || String(err);
  }

  return NextResponse.json(diagnostics);
}
