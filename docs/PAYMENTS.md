# Payment & Subscription Guide

Complete guide to implementing Stripe payments across the AI Contents Platform.

## Overview

The platform uses **Stripe** for subscription billing with:
- 4 pricing tiers (Free, Starter $29, Pro $99, Enterprise $299)
- Monthly recurring billing
- Usage-based quota tracking
- Self-service billing portal
- Webhook-driven subscription management

## MRR Target: $150,000+

### Revenue Projections

| Plan       | Price  | Target Users | MRR        |
|------------|--------|--------------|------------|
| Free       | $0     | 10,000       | $0         |
| Starter    | $29    | 1,000        | $29,000    |
| Pro        | $99    | 800          | $79,200    |
| Enterprise | $299   | 150          | $44,850    |
| **Total**  |        | **11,950**   | **$153,050** |

### Conversion Funnel

1. **Free signups**: 10,000/month (starting goal)
2. **Free → Starter**: 10% conversion = 1,000 users
3. **Starter → Pro**: 80% conversion = 800 users
4. **Pro → Enterprise**: 18.75% conversion = 150 users

## Setup

### 1. Stripe Account

Create a Stripe account at https://stripe.com

### 2. Create Products & Prices

In Stripe Dashboard:

```
Product: AI Contents Platform - Starter
Price: $29 USD / month (recurring)
→ Copy Price ID (e.g., price_xxx)

Product: AI Contents Platform - Pro
Price: $99 USD / month (recurring)
→ Copy Price ID

Product: AI Contents Platform - Enterprise
Price: $299 USD / month (recurring)
→ Copy Price ID
```

### 3. Environment Variables

Add to `.env`:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_xxx  # From Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_xxx  # From webhook setup below
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Price IDs
STRIPE_STARTER_PRICE_ID=price_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx
```

### 4. Configure Webhooks

In Stripe Dashboard → Developers → Webhooks:

**Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`

**Events to send**:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Copy the **Signing secret** to `STRIPE_WEBHOOK_SECRET`.

## Implementation

### Pricing Page

Already implemented at: `apps/contents-studio/src/app/pricing/page.tsx`

Features:
- 4 pricing tiers with feature comparison
- "Most Popular" badge on Starter plan
- CTA buttons for each plan
- FAQ section
- Success/cancel messages
- Responsive design

### API Routes

#### 1. Checkout Session (`/api/checkout`)

Creates a Stripe checkout session:

```typescript
// Frontend
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ plan: 'pro' })
});

const { url } = await response.json();
window.location.href = url;  // Redirect to Stripe
```

#### 2. Billing Portal (`/api/billing-portal`)

Opens Stripe's self-service billing portal:

```typescript
const response = await fetch('/api/billing-portal', {
  method: 'POST'
});

const { url } = await response.json();
window.location.href = url;
```

#### 3. Webhook Handler (`/api/webhooks/stripe`)

Processes Stripe events automatically:

```typescript
// POST /api/webhooks/stripe
// Handles:
// - Subscription creation → Update database
// - Subscription updates → Update status
// - Subscription cancellation → Downgrade to free
// - Payment success/failure → Log & notify
```

### Usage Tracking

Check user's quota before AI operations:

```typescript
import { checkUserQuota, updateUserUsage } from '@repo/auth';

// Before generating content
const { allowed, remaining } = await checkUserQuota(userId);

if (!allowed) {
  return { error: 'Monthly quota exceeded. Please upgrade.' };
}

// After successful generation
const tokensUsed = 1500;  // From AI response
await updateUserUsage(userId, 'content-generation', tokensUsed);
```

### Display Usage

Show usage on dashboard:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const startOfMonth = new Date();
startOfMonth.setDate(1);
startOfMonth.setHours(0, 0, 0, 0);

const usage = await prisma.usageRecord.aggregate({
  where: {
    userId,
    date: { gte: startOfMonth }
  },
  _sum: { tokensUsed: true }
});

const used = usage._sum.tokensUsed || 0;
const limit = 100000;  // Get from user's plan
const percentage = (used / limit) * 100;
```

## Plan Features

### Free Plan ($0/mo)
- 10,000 tokens/month
- All 5 platforms
- 1 brand profile
- 1 team member
- Email support

### Starter Plan ($29/mo)
- 100,000 tokens/month
- Advanced AI models
- Brand voice learning
- 3 brand profiles
- 5 team members
- Priority support
- API access

### Pro Plan ($99/mo)
- 500,000 tokens/month
- Premium AI models
- Custom brand voices
- 10 brand profiles
- 20 team members
- Advanced analytics
- White-label options
- Priority support

### Enterprise Plan ($299/mo)
- Unlimited tokens
- Custom AI training
- Unlimited profiles
- Unlimited team members
- Dedicated support
- SLA guarantee
- Custom integrations
- On-premise option

## Testing

### Test Cards (Stripe Test Mode)

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Auth: 4000 0025 0000 3155
```

Use any future expiry date and any CVC.

### Test Workflow

1. Sign up for free account
2. Go to `/pricing`
3. Click "Upgrade to Pro"
4. Complete checkout with test card
5. Verify subscription created in database
6. Check webhook logs in Stripe
7. Test billing portal
8. Cancel subscription
9. Verify downgrade to free

### Local Webhook Testing

Use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Trigger test events
stripe trigger customer.subscription.created
```

## Monitoring

### Key Metrics to Track

1. **MRR (Monthly Recurring Revenue)**
   ```sql
   SELECT
     COUNT(*) as subscribers,
     SUM(CASE
       WHEN plan = 'starter' THEN 29
       WHEN plan = 'pro' THEN 99
       WHEN plan = 'enterprise' THEN 299
       ELSE 0
     END) as mrr
   FROM subscriptions
   WHERE status = 'active';
   ```

2. **Churn Rate**
   ```sql
   SELECT
     COUNT(*) FILTER (WHERE status = 'canceled') * 100.0 / COUNT(*) as churn_rate
   FROM subscriptions;
   ```

3. **LTV (Lifetime Value)**
   ```
   LTV = Average MRR per user × Average subscription duration
   ```

### Stripe Dashboard

Monitor in real-time:
- New subscriptions
- Failed payments
- Churn events
- Revenue graphs

## Troubleshooting

### "No checkout session created"
- Verify `STRIPE_SECRET_KEY` is set
- Check price IDs match Stripe products
- Ensure user is authenticated

### "Webhook signature verification failed"
- Check `STRIPE_WEBHOOK_SECRET` matches
- Verify endpoint URL is correct
- Use raw request body (not parsed JSON)

### "Payment succeeded but subscription not updated"
- Check webhook logs in Stripe
- Verify metadata includes `userId` and `plan`
- Check database connection

### "User exceeded quota but still can generate"
- Verify quota check is called before AI operations
- Check usage records are being created
- Verify plan limits are correct

## Security

- Never expose `STRIPE_SECRET_KEY` in frontend
- Always verify webhook signatures
- Use HTTPS in production
- Implement rate limiting on checkout endpoint
- Log all payment events

## Growth Strategy

### Phase 1: Launch (Month 1-3)
- Target: 1,000 free signups
- Focus: Product-market fit
- Free tier to drive adoption

### Phase 2: Conversion (Month 4-6)
- Target: 10% free → paid conversion
- Focus: Onboarding optimization
- Email campaigns for upgrades

### Phase 3: Scale (Month 7-12)
- Target: $150,000 MRR
- Focus: Enterprise sales
- Partner program
- Referral system

## Next Steps

- [ ] Set up Stripe account
- [ ] Create products and prices
- [ ] Configure webhooks
- [ ] Test checkout flow
- [ ] Implement usage tracking
- [ ] Add upgrade prompts in UI
- [ ] Create email notifications
- [ ] Build analytics dashboard
- [ ] Set up fraud detection
- [ ] Plan annual billing (17% discount)

## Support

- Stripe Docs: https://stripe.com/docs
- Webhook Testing: https://stripe.com/docs/webhooks/test
- Test Cards: https://stripe.com/docs/testing

---

**Goal**: $150,000+ MRR within 12 months 🎯
