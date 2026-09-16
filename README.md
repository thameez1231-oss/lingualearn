# LinguaLearn — AI-Powered English Learning Platform

> **"Learn English. Speak with Confidence."**  
> *"Speak in the language you know. Learn the English you need."*

LinguaLearn is a commercial-grade EdTech web platform designed for absolute beginners who know little or no English, enabling them to learn English through a language they already understand (such as Malayalam, Hindi, Tamil, Telugu, Kannada, Bengali, Arabic, Spanish, French, German, and more).

---

## 🌟 Key Highlights & Architecture

- **Commercial EdTech Design**: Built with Next.js 15 App Router, TypeScript, Tailwind CSS, and Lucide icons.
- **Production Authentication**:
  - Secure email/password account creation with `bcryptjs` password hashing.
  - Real email verification with cryptographically signed tokens and 24-hour expiration.
  - Real password reset system with 1-hour secure tokens.
  - HTTP-only session cookies with JWT verification and database session tracking.
  - Protected routes and proxy middleware preventing unauthenticated access.
- **Developer Mailbox & Live Email Testing**:
  - Integrated with **Nodemailer** + **Ethereal Mail** for live web-viewable email links.
  - Built-in In-App Dev Mailbox (`/dev/mailbox` and floating drawer) allowing developers and testers to view outgoing verification/reset emails and click to verify with one click.
  - Standard SMTP credentials can be configured via `.env` to send real emails to external mailboxes.
- **Live Speak & Translate**:
  - Web Speech API integration with native language recognition (Malayalam `ml-IN`, Hindi `hi-IN`, Tamil `ta-IN`, Spanish `es-ES`, etc.).
  - Natural English conversion engine prioritizing natural everyday speech.
  - Web Speech Synthesis (TTS) with normal and slow speeds.
  - "Try saying it" speech evaluation with accuracy scoring and encouraging feedback.
- **AI English Tutor ("Coach Maya")**:
  - Live conversation mode adapting to beginner levels.
  - Smart English correction displaying:
    - *You said*: `"I am go to school."`
    - *Better English*: `"I am going to school."`
    - *Why?*: `"'Going' is used after 'am'."`
- **5 Core Lesson Modules**:
  1. 🟢 **English Basics** (Alphabet, Numbers 1-10, Colors, Everyday Words)
  2. 🔵 **Everyday English** (Greetings, Self Introductions, Food & Cafe English)
  3. 🟡 **Speaking & Conversation** (Question words What/Where/Who, Small Talk)
  4. 🟣 **Grammar Made Simple** (Am/Is/Are, Being Verbs, Action Verbs)
  5. 🟠 **Essential Vocabulary** (Top 100 Words, Flashcards, Matching)
- **Interactive Exercises**:
  - Visual Flashcards with native translation bridges
  - Multiple Choice with audio prompts
  - Matching Pairs
  - Listen & Choose
  - Sentence Builder with word tiles
- **Smart Bilingual Dictionary**:
  - 500+ curated beginner words with definitions, phonetic guides, and translations in 15+ languages.
  - "Save to My Words" bookmarking.

---

## 🚀 Quick Start

### 1. Set Workspace
Recommended workspace directory:
```bash
C:\Users\USER\.gemini\antigravity\scratch\lingualearn
```

### 2. Run Database Migrations & Seed
```bash
# Push database schema
npx prisma db push

# Seed demo account and starter vocabulary
npm run seed
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Configured Demo Account

You can log in immediately with the pre-seeded account:
- **Email**: `demo@lingualearn.com`
- **Password**: `Password123!`
- **Level**: Beginner (7-Day Streak, 420 XP, Malayalam Support Language)

Or create a brand-new account at `/signup` to experience the full registration, email verification, and onboarding flow!

---

## 📧 Email Verification Testing

When registering a new user, verification emails are captured live:
1. Open the floating **Dev Mailbox** button in the bottom right corner (or visit `/dev/mailbox`).
2. Click **Complete Action** or click the secure link in the email preview to verify the account.
3. You will see **"Email verified successfully! 🎉"** and be guided into the onboarding wizard!

---

## 🧪 Automated Tests

To run the end-to-end test suite:
```bash
npm run test:e2e
```
This tests:
1. User registration & password hashing
2. Password validation
3. Real email verification token activation
4. User onboarding configuration
5. Speak & Translate (Malayalam to Natural English)
6. AI English Tutor conversation & smart grammar corrections
7. Lesson completion & progress tracking in SQLite
8. Bilingual dictionary search & bookmarking

---

## 🌐 Environment Variables (`.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLite / PostgreSQL connection | `file:./dev.db` |
| `SESSION_SECRET` | 32-byte secret for JWT sessions | Pre-configured |
| `NEXT_PUBLIC_APP_URL`| Base application URL | `http://localhost:3000` |
| `SMTP_HOST` | Custom SMTP host (Optional) | `""` (Uses Ethereal + Dev Mailbox) |
| `GEMINI_API_KEY` | Optional Google Gemini key | `""` (Intelligent local fallback built-in) |
