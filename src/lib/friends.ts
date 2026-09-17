import { db, ensureDatabaseSchema } from '@/lib/db';

/**
 * Checks whether two users are accepted friends.
 * Handles both directions (A -> B and B -> A) in both Friendship
 * and FriendRequest tables.
 * Automatically self-heals bidirectional records in Friendship table.
 */
export async function areUsersFriends(userAId: string, userBId: string): Promise<boolean> {
  if (!userAId || !userBId || userAId === userBId) {
    return false;
  }

  await ensureDatabaseSchema(db);

  // 1. Check Friendship table in both directions
  const friendships = await db.friendship.findMany({
    where: {
      OR: [
        { userId: userAId, friendId: userBId },
        { userId: userBId, friendId: userAId },
      ],
    },
  });

  if (friendships.length >= 2) {
    // Both directions already exist - fast return without DB writes
    return true;
  }

  if (friendships.length === 1) {
    // Only one direction exists, auto-heal the reciprocal direction
    ensureBidirectionalFriendship(userAId, userBId).catch(() => {});
    return true;
  }

  // 2. Fallback: check accepted FriendRequest in both directions
  const acceptedReq = await db.friendRequest.findFirst({
    where: {
      status: 'ACCEPTED',
      OR: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId },
      ],
    },
  });

  if (acceptedReq) {
    // Auto-heal bidirectional friendship rows in DB
    await ensureBidirectionalFriendship(userAId, userBId).catch(() => {});
    return true;
  }

  return false;
}

/**
 * Ensures bidirectional friendship records exist in Friendship table
 * so that both userId -> friendId and friendId -> userId have indexed records.
 */
export async function ensureBidirectionalFriendship(userAId: string, userBId: string): Promise<void> {
  if (!userAId || !userBId || userAId === userBId) return;

  try {
    await Promise.all([
      db.user.upsert({
        where: { id: userAId },
        update: {},
        create: {
          id: userAId,
          name: 'Learner',
          email: `user_${userAId}@lingualearn.app`,
          passwordHash: 'jwt_managed_user',
          onboardingCompleted: true,
        },
      }).catch(() => {}),
      db.user.upsert({
        where: { id: userBId },
        update: {},
        create: {
          id: userBId,
          name: 'Learner',
          email: `user_${userBId}@lingualearn.app`,
          passwordHash: 'jwt_managed_user',
          onboardingCompleted: true,
        },
      }).catch(() => {}),
    ]);

    await Promise.all([
      db.friendship.upsert({
        where: {
          userId_friendId: {
            userId: userAId,
            friendId: userBId,
          },
        },
        update: {},
        create: {
          userId: userAId,
          friendId: userBId,
        },
      }),
      db.friendship.upsert({
        where: {
          userId_friendId: {
            userId: userBId,
            friendId: userAId,
          },
        },
        update: {},
        create: {
          userId: userBId,
          friendId: userAId,
        },
      }),
    ]);
  } catch (err) {
    console.warn('[DB] ensureBidirectionalFriendship notice:', err);
  }
}
