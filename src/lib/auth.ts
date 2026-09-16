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

export interface UserSessionData {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date | string | null;
  preferredLanguage?: string;
  englishLevel?: string;
  onboardingCompleted: boolean;
  xp?: number;
  streak?: number;
  currentLessonId?: string;
  createdAt?: Date | string;
}

export async function createSession(userId: string, initialUserData?: Partial<UserSessionData>): Promise<string> {
  const token = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  // Fetch user info to embed in signed JWT
  let userData: UserSessionData | null = null;
  try {
    const dbUser = await db.user.findUnique({
      where: { id: userId },
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
    });
    if (dbUser) {
      userData = {
        ...dbUser,
        emailVerifiedAt: dbUser.emailVerifiedAt ? dbUser.emailVerifiedAt.toISOString() : null,
        createdAt: dbUser.createdAt ? dbUser.createdAt.toISOString() : undefined,
      };
    }
  } catch (err) {
    console.warn('[Auth] Error fetching user for JWT payload:', err);
  }

  if (!userData && initialUserData) {
    userData = {
      id: userId,
      name: initialUserData.name || 'Learner',
      email: initialUserData.email || '',
      emailVerified: initialUserData.emailVerified ?? true,
      preferredLanguage: initialUserData.preferredLanguage || 'Malayalam',
      englishLevel: initialUserData.englishLevel || 'COMPLETE_BEGINNER',
      onboardingCompleted: initialUserData.onboardingCompleted ?? true,
      xp: initialUserData.xp ?? 50,
      streak: initialUserData.streak ?? 1,
      currentLessonId: initialUserData.currentLessonId || 'basics-1',
    };
  }

  // Try storing session in database (non-blocking if database is in transition)
  try {
    await db.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  } catch (err) {
    console.warn('[Auth] Session DB persist notice:', err);
  }

  // Sign JWT containing the session token AND verified user claims
  const jwt = await new SignJWT({
    sessionToken: token,
    userId,
    user: userData || {
      id: userId,
      name: 'Learner',
      email: '',
      emailVerified: true,
      preferredLanguage: 'Malayalam',
      englishLevel: 'COMPLETE_BEGINNER',
      onboardingCompleted: true,
      xp: 50,
      streak: 1,
      currentLessonId: 'basics-1',
    },
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .sign(JWT_SECRET);

  return jwt;
}

export async function verifySessionJwt(jwt: string): Promise<{
  sessionToken: string;
  userId: string;
  user?: UserSessionData;
} | null> {
  try {
    const { payload } = await jwtVerify(jwt, JWT_SECRET);
    if (typeof payload.sessionToken === 'string' && typeof payload.userId === 'string') {
      return {
        sessionToken: payload.sessionToken,
        userId: payload.userId,
        user: (payload.user as UserSessionData) || undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const payload = await verifySessionJwt(sessionCookie.value);
  if (!payload) {
    try {
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch {
      // In Server Components, cookies cannot be modified
    }
    return null;
  }

  // 1. Try to fetch fresh user from database
  try {
    const user = await db.user.findUnique({
      where: { id: payload.userId },
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
    });

    if (user) {
      return user;
    }
  } catch (err) {
    console.warn('[Auth] Database lookup notice:', err);
  }

  // 2. Fallback to cryptographically verified claims embedded in JWT
  if (payload.user) {
    return payload.user;
  }

  // 3. If neither exists, safely try deleting invalid cookie to prevent infinite redirect loops
  try {
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // In Server Components, cookies cannot be modified
  }
  return null;
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
