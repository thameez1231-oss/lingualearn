import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'lingualearn_super_secure_default_secret_key_32_bytes_long_!'
);

export const SESSION_COOKIE_NAME = 'lingua_session_token';
const SESSION_DURATION_DAYS = 30;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId: string): Promise<string> {
  const token = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  // Store session in database
  await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  // Sign JWT containing the session token
  const jwt = await new SignJWT({ sessionToken: token, userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(JWT_SECRET);

  return jwt;
}

export async function verifySessionJwt(jwt: string): Promise<{ sessionToken: string; userId: string } | null> {
  try {
    const { payload } = await jwtVerify(jwt, JWT_SECRET);
    if (typeof payload.sessionToken === 'string' && typeof payload.userId === 'string') {
      return { sessionToken: payload.sessionToken, userId: payload.userId };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const payload = await verifySessionJwt(sessionCookie.value);
  if (!payload) {
    return null;
  }

  // Validate session against database
  const session = await db.session.findUnique({
    where: { token: payload.sessionToken },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          emailVerifiedAt: true,
          preferredLanguage: true,
          englishLevel: true,
          onboardingCompleted: true,
          xp: true,
          streak: true,
          currentLessonId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    // Session expired, remove it
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.user;
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    const payload = await verifySessionJwt(sessionCookie.value);
    if (payload) {
      await db.session.deleteMany({
        where: { token: payload.sessionToken },
      }).catch(() => {});
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
