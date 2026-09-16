# LinguaLearn Deployment Guide 🚀

This document provides complete instructions for deploying **LinguaLearn** to public hosting platforms.

---

## 1. Environment Variables Overview

Before deploying, configure the following environment variables on your hosting provider:

| Variable | Description | Required? | Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Database connection string (SQLite file or PostgreSQL URL) | **Yes** | `file:./dev.db` or `postgresql://user:pass@host:5432/lingualearn` |
| `SESSION_SECRET` | 32+ character random string for JWT session encryption | **Yes** | `a9f8c2b7e4d1038596a2f4c1e7d80b5...` |
| `NEXT_PUBLIC_APP_URL` | Public production URL of the deployed application | **Yes** | `https://lingualearn.yourdomain.com` |
| `SMTP_HOST` | Outgoing SMTP host for real emails (SendGrid, Resend, Gmail) | Optional | `smtp.resend.com` |
| `SMTP_PORT` | SMTP port | Optional | `587` |
| `SMTP_USER` | SMTP username / API key | Optional | `resend` |
| `SMTP_PASS` | SMTP password / API token | Optional | `re_123456789...` |
| `SMTP_FROM` | Sender address shown in verification emails | Optional | `LinguaLearn <noreply@yourdomain.com>` |
| `GEMINI_API_KEY` | Optional Google Gemini 2.0 API key for extended AI nuances | Optional | `AIzaSy...` |

> 💡 **Note**: If `SMTP_*` variables are omitted, LinguaLearn automatically uses its built-in **Developer Mailbox** (`/dev/mailbox`) and Ethereal Email so you can test verification and password resets without paying for an email provider.

---

## 2. Deploy to Vercel (Recommended for Next.js)

1. Push your repository to **GitHub / GitLab**.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Build and Output Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Install Command**: `npm install`
4. In **Environment Variables**, add:
   - `DATABASE_URL`: Your PostgreSQL database URL (e.g., from Neon, Supabase, or Railway)
   - `SESSION_SECRET`: Random 32+ character secret
   - `NEXT_PUBLIC_APP_URL`: `https://your-app.vercel.app` (or your custom domain)
5. In `prisma/schema.prisma`, if using PostgreSQL on Vercel, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
   and run `npx prisma db push`.
6. Click **Deploy**.

---

## 3. Deploy to Railway / Render / Fly.io (Zero-Config SQLite Support)

Platforms with persistent disk storage (like Railway, Render, or Fly.io) can run the existing SQLite database without needing an external PostgreSQL instance:

1. Connect your repository.
2. Set Environment Variables:
   - `DATABASE_URL`: `file:./dev.db`
   - `SESSION_SECRET`: (Random secure string)
   - `NEXT_PUBLIC_APP_URL`: `https://<your-app>.up.railway.app`
3. Add a persistent volume mounted to `/app/prisma` (if using Docker) or project root to preserve user progress and account data across server restarts.
4. Deploy!

---

## 4. Deploy with Docker (Single Command)

To run anywhere (DigitalOcean, AWS EC2, Linode, Hetzner, or home server):

```bash
# Clone the repository
git clone <your-repo-url>
cd lingualearn

# Start with Docker Compose
docker compose up -d --build
```

The application will be live at `http://localhost:3000` (or your server's public IP).

---

## 5. Production Health & Verification Checklist

After deploying to production, run through this quick 2-minute verification:

1. **Visit Landing Page**: Confirm hero bridge switches between languages smoothly.
2. **Sign Up New Account**:
   - Create account at `/signup`.
   - Complete verification at `/verify-email`.
   - Complete 2-step onboarding at `/onboarding`.
3. **Speak & Translate**:
   - Open `/speak`.
   - Speak or type a phrase in your native language (Malayalam, Hindi, Tamil, etc.).
   - Verify natural English output with phonetic guide and dual-speed pronunciation.
4. **AI English Tutor**:
   - Open `/tutor`.
   - Chat with Coach Maya to test contextual feedback and English correction.
5. **Interactive Lessons**:
   - Complete Lesson 1 at `/learn` to verify XP and progress persistence.
6. **Word Lookup**:
   - Search a word in `/words` and bookmark it to verify dictionary saving.
