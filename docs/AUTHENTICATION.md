# Authentication Guide

This document explains how authentication works across all 5 AI Contents Platform apps.

## Overview

All apps use **NextAuth.js** with:
- Email/Password authentication (credentials provider)
- Google OAuth (optional)
- JWT sessions
- Prisma adapter for database storage
- Shared auth package (`@repo/auth`)

## Setup

### 1. Environment Variables

Add to `.env`:

```bash
# Database (required)
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_content_db

# NextAuth (required)
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3001  # Change port for each app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Database Setup

Initialize the database:

```bash
cd packages/database
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed with sample data (optional)
```

### 3. Add Auth to Your App

#### Step 1: API Route Handler

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@repo/auth/config';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### Step 2: Signup API Route

Create `src/app/api/auth/signup/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@repo/auth';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  organizationName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);
    const user = await createUser(validatedData);

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
```

#### Step 3: Session Provider

Create `src/components/SessionProvider.tsx`:

```typescript
'use client';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

#### Step 4: Update Root Layout

Update `src/app/layout.tsx`:

```typescript
import SessionProvider from '@/components/SessionProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

#### Step 5: Auth Pages

Copy from `apps/contents-studio/src/app/auth/`:
- `signin/page.tsx` - Sign in page
- `signup/page.tsx` - Sign up page

#### Step 6: Protect Pages

Add to any protected page:

```typescript
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return <div>Protected content</div>;
}
```

## Features

### User Registration

```typescript
// Frontend (in signup page)
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    organizationName: 'My Company'
  })
});
```

### User Login

```typescript
import { signIn } from 'next-auth/react';

// Credentials login
await signIn('credentials', {
  email: 'user@example.com',
  password: 'password123',
  callbackUrl: '/dashboard'
});

// Google OAuth
await signIn('google', {
  callbackUrl: '/dashboard'
});
```

### Get Current User

```typescript
'use client';
import { useSession } from 'next-auth/react';

export default function Component() {
  const { data: session } = useSession();

  return <div>Welcome, {session?.user?.name}!</div>;
}
```

### Sign Out

```typescript
import { signOut } from 'next-auth/react';

await signOut({ callbackUrl: '/' });
```

### Usage Tracking

```typescript
import { updateUserUsage, checkUserQuota } from '@repo/auth';

// Check if user has quota
const { allowed, remaining, limit } = await checkUserQuota(userId);

if (!allowed) {
  return { error: 'Quota exceeded' };
}

// Track usage
await updateUserUsage(userId, 'content-generation', 1500); // tokens used
```

## Database Schema

The auth system uses these Prisma models:

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  passwordHash String?
  avatar       String?
  role         String   @default("user")

  subscription Subscription?
  usageRecords UsageRecord[]
  organization Organization?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Subscription {
  id               String   @id @default(cuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id])

  plan             String   // free, starter, pro, enterprise
  status           String   // active, canceled, past_due
  currentPeriodEnd DateTime

  stripeCustomerId       String?
  stripeSubscriptionId   String?
}

model UsageRecord {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])

  feature      String   // content-generation, video-generation, etc.
  tokensUsed   Int
  requestCount Int
  date         DateTime @default(now())

  @@unique([userId, feature, date])
}
```

## Quota Limits

| Plan       | Monthly Tokens | Price    |
|------------|----------------|----------|
| Free       | 10,000         | $0       |
| Starter    | 100,000        | $29/mo   |
| Pro        | 500,000        | $99/mo   |
| Enterprise | Unlimited      | $299/mo  |

## Security

- Passwords are hashed with bcrypt (12 rounds)
- JWT sessions with 30-day expiration
- CSRF protection enabled
- Secure cookies in production
- OAuth2 for Google sign-in

## Troubleshooting

### "NEXTAUTH_SECRET is not set"
Generate a secret: `openssl rand -base64 32`

### "Database connection failed"
Check DATABASE_URL in .env

### "Session not found"
Ensure SessionProvider wraps your app

### "Google OAuth not working"
1. Create OAuth credentials at https://console.cloud.google.com
2. Add authorized redirect URIs:
   - http://localhost:3001/api/auth/callback/google
   - http://localhost:3002/api/auth/callback/google
   - (repeat for all ports 3001-3005)

## Next Steps

- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add 2FA support
- [ ] Add SSO for enterprise
- [ ] Add audit logging

## API Reference

See `packages/auth/src/` for full implementation details.
