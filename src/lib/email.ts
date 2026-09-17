import nodemailer, { type Transporter } from 'nodemailer';
import { db } from './db';

let cachedTransporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    // Real configured SMTP server (Gmail, SendGrid, Resend, etc.)
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    return cachedTransporter;
  }

  // Create an automated Ethereal test inbox for real email testing & previewing
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('[Email] Created automated Ethereal test account:', testAccount.user);
    return cachedTransporter;
  } catch (err) {
    console.warn('[Email] Fallback JSON transport:', err);
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true,
    });
    return cachedTransporter;
  }
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  type?: 'VERIFICATION' | 'RESET';
}

export async function sendEmail({ to, subject, html, text, type = 'VERIFICATION' }: SendEmailParams) {
  const from = process.env.SMTP_FROM || 'LanguaLearn <noreply@langualearn.app>';
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text: text || html.replace(/<[^>]+>/g, ' '),
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info) || null;
  if (previewUrl) {
    console.log(`\n========================================`);
    console.log(`📧 [LanguaLearn Email Sent]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Live Ethereal Preview URL: ${previewUrl}`);
    console.log(`========================================\n`);
  }

  // Save to OutboxEmail in database so developers/testers can always view and click it directly in app
  await db.outboxEmail.create({
    data: {
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ' '),
      previewUrl: previewUrl ? String(previewUrl) : null,
      type,
    },
  });

  return { messageId: info.messageId, previewUrl };
}

function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const appUrl = getAppBaseUrl();
  const verificationLink = `${appUrl}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your LanguaLearn Email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 30px; color: #1e293b;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 12px; margin-bottom: 12px; font-size: 24px;">
              🌐
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">LanguaLearn</h1>
            <p style="color: #e0e7ff; margin: 6px 0 0 0; font-size: 14px;">Learn English. Speak with Confidence.</p>
          </div>

          <div style="padding: 32px 28px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Welcome, ${name}! 👋</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">
              Thank you for taking the first step on your English learning journey. Please verify your email address to activate your account and personalize your lessons.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationLink}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                Verify Email Address →
              </a>
            </div>

            <p style="font-size: 13px; line-height: 1.5; color: #64748b; background: #f1f5f9; padding: 12px 16px; border-radius: 8px;">
              <strong>Link not working?</strong> Copy and paste this URL into your browser:<br/>
              <a href="${verificationLink}" style="color: #4f46e5; word-break: break-all;">${verificationLink}</a>
            </p>

            <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">
              This link will expire in 24 hours. If you did not sign up for LanguaLearn, you can safely ignore this email.
            </p>
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; background: #fafafa;">
            © ${new Date().getFullYear()} LanguaLearn Inc. • EdTech for Beginners
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Confirm your LanguaLearn account',
    html,
    type: 'VERIFICATION',
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const appUrl = getAppBaseUrl();
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset your LanguaLearn Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 30px; color: #1e293b;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="background: #0f172a; padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">LanguaLearn Security</h1>
          </div>

          <div style="padding: 32px 28px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Password Reset Request</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">
              Hi ${name}, we received a request to reset your LanguaLearn password. Click the button below to create a new password.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetLink}" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 16px;">
                Reset Password →
              </a>
            </div>

            <p style="font-size: 13px; line-height: 1.5; color: #64748b; background: #f1f5f9; padding: 12px 16px; border-radius: 8px;">
              If the button doesn't work, visit:<br/>
              <a href="${resetLink}" style="color: #4f46e5; word-break: break-all;">${resetLink}</a>
            </p>

            <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">
              This password reset link is valid for 1 hour. If you did not request this, please ignore this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your LanguaLearn password',
    html,
    type: 'RESET',
  });
}
