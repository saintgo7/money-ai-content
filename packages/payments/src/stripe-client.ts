import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    stripePriceId: null,
    features: [
      '10,000 tokens/month',
      'Basic content generation',
      'All 5 platforms',
      'Email support',
    ],
    limits: {
      tokensPerMonth: 10000,
      brandProfiles: 1,
      teamMembers: 1,
    },
  },
  starter: {
    name: 'Starter',
    price: 29,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      '100,000 tokens/month',
      'Advanced AI models',
      'Brand voice learning',
      'Priority support',
      'API access',
    ],
    limits: {
      tokensPerMonth: 100000,
      brandProfiles: 3,
      teamMembers: 5,
    },
  },
  pro: {
    name: 'Pro',
    price: 99,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      '500,000 tokens/month',
      'Premium AI models',
      'Custom brand voices',
      'Priority support',
      'Advanced analytics',
      'White-label options',
    ],
    limits: {
      tokensPerMonth: 500000,
      brandProfiles: 10,
      teamMembers: 20,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Unlimited tokens',
      'Custom AI training',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'On-premise deployment',
    ],
    limits: {
      tokensPerMonth: -1, // unlimited
      brandProfiles: -1,
      teamMembers: -1,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;

export async function createCheckoutSession(params: {
  userId: string;
  plan: PlanType;
  successUrl: string;
  cancelUrl: string;
}) {
  const { userId, plan, successUrl, cancelUrl } = params;

  if (plan === 'free') {
    throw new Error('Cannot create checkout session for free plan');
  }

  const planDetails = PLANS[plan];
  if (!planDetails.stripePriceId) {
    throw new Error(`Stripe price ID not configured for ${plan} plan`);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Create or get Stripe customer
  let customerId = user.subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        userId: user.id,
      },
    });
    customerId = customer.id;
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: planDetails.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId: user.id,
      plan,
    },
  });

  return session;
}

export async function createBillingPortalSession(params: {
  userId: string;
  returnUrl: string;
}) {
  const { userId, returnUrl } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  if (!user?.subscription?.stripeCustomerId) {
    throw new Error('No active subscription found');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.subscription.stripeCustomerId,
    return_url: returnUrl,
  });

  return session;
}

export async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const plan = subscription.metadata.plan as PlanType;

  if (!userId || !plan) {
    throw new Error('Missing metadata in subscription');
  }

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: subscription.status,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId,
      plan,
      status: subscription.status,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    throw new Error('Missing userId in subscription metadata');
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    throw new Error('Missing userId in subscription metadata');
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      plan: 'free',
      status: 'canceled',
    },
  });
}

export async function getUserPlanLimits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  const plan = (user?.subscription?.plan as PlanType) || 'free';
  return PLANS[plan].limits;
}
