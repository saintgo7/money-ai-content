import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SignUpData } from './types';

const prisma = new PrismaClient();

export async function createUser(data: SignUpData) {
  const { email, password, name, organizationName } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create organization if provided
  let organizationId: string | undefined;
  if (organizationName) {
    const org = await prisma.organization.create({
      data: {
        name: organizationName,
        slug: organizationName.toLowerCase().replace(/\s+/g, '-'),
        plan: 'free',
      },
    });
    organizationId = org.id;
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'user',
      organizationId,
    },
  });

  // Create free subscription
  await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: 'free',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  });

  return user;
}

export async function getUserWithSubscription(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      organization: true,
    },
  });
}

export async function updateUserUsage(userId: string, feature: string, tokens: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await prisma.usageRecord.upsert({
    where: {
      userId_feature_date: {
        userId,
        feature,
        date: today,
      },
    },
    update: {
      tokensUsed: {
        increment: tokens,
      },
      requestCount: {
        increment: 1,
      },
    },
    create: {
      userId,
      feature,
      date: today,
      tokensUsed: tokens,
      requestCount: 1,
    },
  });

  return usage;
}

export async function checkUserQuota(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  const user = await getUserWithSubscription(userId);

  if (!user || !user.subscription) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  // Define limits based on plan
  const limits: Record<string, number> = {
    free: 10000,
    starter: 100000,
    pro: 500000,
    enterprise: -1, // unlimited
  };

  const limit = limits[user.subscription.plan] || 0;

  // Get current month usage
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usage = await prisma.usageRecord.aggregate({
    where: {
      userId,
      date: {
        gte: startOfMonth,
      },
    },
    _sum: {
      tokensUsed: true,
    },
  });

  const used = usage._sum.tokensUsed || 0;
  const remaining = limit === -1 ? -1 : Math.max(0, limit - used);
  const allowed = limit === -1 || used < limit;

  return { allowed, remaining, limit };
}
