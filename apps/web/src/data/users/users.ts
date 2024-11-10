import { and, asc, desc, eq, like, sql } from 'drizzle-orm';
import { db } from '../../lib/db/init';
import { accounts, users } from '../../lib/db/schema';
import type { GetAllUserSchemaInput } from './users.schema';
async function getUserByEmail(email: string) {
  try {
    return await db.query.users.findFirst({
      where(fields, operators) {
        return operators.eq(fields.email, email);
      },
    });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Could not fetch user by email');
  }
}

async function getUserById(id: string) {
  try {
    return await db.query.users.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, id);
      },
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Could not fetch user by ID');
  }
}
async function verifyUserEmail(id: string, email?: string) {
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: email ? email : undefined,
    })
    .where(eq(users.id, id));
}
async function createUser(user: {
  email: string;
  password: string;
  name: string;
}) {
  const [newUser] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return newUser;
}
async function updateUserPassword(email: string, password: string) {
  await db
    .update(users)
    .set({ password })
    .where(eq(users.email, email))
    .execute();
}
async function userExists(userId: string): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return user !== null;
}

async function createStripeCustomerRecord({
  userId,
  stripeCustomerId,
}: {
  userId: string;
  stripeCustomerId: string;
}) {
  await db
    .update(users)
    .set({
      stripeCustomerId,
    })
    .where(eq(users.id, userId));
}

async function getAllUsers(input: GetAllUserSchemaInput) {
  const { pageIndex, pageSize, sort, name, email, role } = input;
  const offset = (pageIndex - 1) * pageSize;
  const [column, order] = (sort?.split('.') ?? ['createdAt', 'desc']) as [
    string,
    'asc' | 'desc'
  ];

  const expressions = [
    name ? like(users.name, `%${name}%`) : undefined,
    email ? like(users.email, `%${email}%`) : undefined,
    role ? eq(users.role, role) : undefined,
  ];

  const where = and(...expressions.filter(Boolean)); // Filter out undefined filters

  const { data, total } = await db.transaction(async (tx) => {
    const data = await tx
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        image: users.image,
        createdAt: users.createdAt,
        accounts: {
          provider: accounts.provider,
          // providerAccountId: accounts.providerAccountId,
          // accessToken: accounts.access_token,
          // refreshToken: accounts.refresh_token,
          // expiresAt: accounts.expires_at,
          // tokenType: accounts.token_type,
        },
      })
      .from(users)
      .leftJoin(accounts, eq(users.id, accounts.userId)) // Join users and accounts
      .limit(pageSize)
      .offset(offset)
      .where(where)
      .orderBy(
        column === 'name'
          ? order === 'asc'
            ? asc(users.name)
            : desc(users.name)
          : desc(users.createdAt) // Default to sorting by createdAt
      );

    const total = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(users)
      .where(where)
      .execute()
      .then((res) => res[0]?.count ?? 0);

    return {
      data,
      total,
    };
  });

  return { data, pageCount: Math.ceil(total / pageSize) };
}

async function deleteUserWithData(userId: string) {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(accounts).where(eq(accounts.userId, userId));
      await tx.delete(users).where(eq(users.id, userId));
    });
  } catch (error) {
    console.error('Error deleting user with data:', error);
    throw new Error('Could not delete user with data');
  }
}

export const userRepository = {
  getUserByEmail,
  getUserById,
  verifyUserEmail,
  createUser,
  updateUserPassword,
  userExists,
  createStripeCustomerRecord,
  getAllUsers,
  deleteUserWithData,
};
