# 인증 시스템 완벽 가이드

> NextAuth.js 기반 사용자 인증 및 권한 관리 시스템

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [설치 및 설정](#설치-및-설정)
3. [사용 방법](#사용-방법)
4. [API 레퍼런스](#api-레퍼런스)
5. [보안](#보안)
6. [문제 해결](#문제-해결)

---

## 시스템 개요

### 기술 스택

```typescript
{
  "auth_framework": "NextAuth.js v4.24.5",
  "session_strategy": "JWT",
  "database_adapter": "Prisma Adapter",
  "password_hashing": "bcrypt (12 rounds)",
  "session_duration": "30 days"
}
```

### 지원 인증 방식

#### 1. 이메일/비밀번호 (Credentials Provider)

**장점**:
- ✅ 완전한 제어 가능
- ✅ 추가 비용 없음
- ✅ 커스터마이징 자유로움

**단점**:
- ❌ 비밀번호 관리 책임
- ❌ 보안 리스크 존재

**구현 위치**: `packages/auth/src/auth-config.ts`

```typescript
CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    // 1. 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    // 2. 비밀번호 검증
    const isValid = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );

    // 3. 사용자 반환
    return isValid ? user : null;
  }
})
```

#### 2. Google OAuth 2.0

**장점**:
- ✅ 빠른 회원가입
- ✅ 보안성 높음
- ✅ 사용자 신뢰도 높음

**단점**:
- ❌ Google 의존성
- ❌ 설정 필요

**구현 위치**: `packages/auth/src/auth-config.ts`

```typescript
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
})
```

### 인증 플로우

#### 회원가입 플로우

```mermaid
사용자 입력 (이메일, 비밀번호, 이름)
    ↓
입력 검증 (Zod)
    ↓
이메일 중복 체크
    ↓
비밀번호 해싱 (bcrypt)
    ↓
DB에 사용자 저장
    ↓
무료 구독 자동 생성
    ↓
자동 로그인
    ↓
온보딩 페이지로 이동
```

#### 로그인 플로우

```mermaid
사용자 입력 (이메일, 비밀번호)
    ↓
DB에서 사용자 조회
    ↓
비밀번호 비교
    ↓
JWT 토큰 생성
    ↓
세션 쿠키 설정
    ↓
대시보드로 리다이렉트
```

#### Google OAuth 플로우

```mermaid
"Google로 로그인" 버튼 클릭
    ↓
Google 로그인 페이지로 리다이렉트
    ↓
사용자 인증 (Google)
    ↓
콜백 URL로 리다이렉트
    ↓
사용자 정보 가져오기
    ↓
DB에 사용자 생성/업데이트
    ↓
JWT 토큰 생성
    ↓
대시보드로 이동
```

---

## 설치 및 설정

### 1단계: 환경 변수 설정

```bash
# .env 파일 생성
cat > .env << EOF
# 데이터베이스
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_content_db

# NextAuth 기본 설정
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3001

# Google OAuth (선택사항)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
EOF
```

### 2단계: Google OAuth 설정 (선택사항)

#### Google Cloud Console 설정

1. **https://console.cloud.google.com** 접속
2. 새 프로젝트 생성
3. "API 및 서비스" → "사용자 인증 정보"
4. "사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
5. 애플리케이션 유형: **웹 애플리케이션**

#### 승인된 리다이렉트 URI 추가

```
http://localhost:3001/api/auth/callback/google
http://localhost:3002/api/auth/callback/google
http://localhost:3003/api/auth/callback/google
http://localhost:3004/api/auth/callback/google
http://localhost:3005/api/auth/callback/google
```

**프로덕션 환경**:
```
https://contents.yourdomain.com/api/auth/callback/google
https://video.yourdomain.com/api/auth/callback/google
# 나머지 도메인들...
```

6. Client ID와 Client Secret 복사
7. `.env` 파일에 추가

### 3단계: 데이터베이스 스키마 적용

```bash
cd packages/database
pnpm db:generate  # Prisma Client 생성
pnpm db:push      # 스키마 푸시
```

### 4단계: 앱에 인증 시스템 통합

#### 4-1. API 라우트 핸들러 생성

```typescript
// apps/contents-studio/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@repo/auth/config';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

#### 4-2. 회원가입 API 생성

```typescript
// apps/contents-studio/src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@repo/auth';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  organizationName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    const user = await createUser(validatedData);

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: '입력값이 올바르지 않습니다', details: error.errors },
        { status: 400 }
      );
    }

    if (error.message === 'User already exists') {
      return NextResponse.json(
        { success: false, error: '이미 가입된 이메일입니다' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: '회원가입에 실패했습니다' },
      { status: 500 }
    );
  }
}
```

#### 4-3. SessionProvider 컴포넌트

```typescript
// apps/contents-studio/src/components/SessionProvider.tsx
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

#### 4-4. 루트 레이아웃 업데이트

```typescript
// apps/contents-studio/src/app/layout.tsx
import SessionProvider from '@/components/SessionProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

---

## 사용 방법

### 1. 회원가입

#### Frontend 코드

```typescript
// apps/contents-studio/src/app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organizationName: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 회원가입 API 호출
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error);
      return;
    }

    // 2. 자동 로그인
    const result = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/onboarding');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="이름"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="이메일"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">회원가입</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### 2. 로그인

#### 이메일/비밀번호 로그인

```typescript
import { signIn } from 'next-auth/react';

async function handleLogin(email: string, password: string) {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,  // 자동 리다이렉트 비활성화
  });

  if (result?.error) {
    console.error('로그인 실패:', result.error);
    return;
  }

  // 성공 시 대시보드로 이동
  router.push('/dashboard');
}
```

#### Google OAuth 로그인

```typescript
import { signIn } from 'next-auth/react';

async function handleGoogleLogin() {
  await signIn('google', {
    callbackUrl: '/dashboard',  // 로그인 후 이동할 페이지
  });
}
```

### 3. 로그아웃

```typescript
import { signOut } from 'next-auth/react';

async function handleLogout() {
  await signOut({
    callbackUrl: '/',  // 로그아웃 후 이동할 페이지
  });
}
```

### 4. 현재 사용자 정보 가져오기

#### Client Component에서

```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>로딩 중...</div>;
  }

  if (!session) {
    return <div>로그인이 필요합니다</div>;
  }

  return (
    <div>
      <p>이름: {session.user.name}</p>
      <p>이메일: {session.user.email}</p>
      <p>역할: {session.user.role}</p>
    </div>
  );
}
```

#### Server Component에서

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@repo/auth/config';

export default async function ServerProfile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <p>이름: {session.user.name}</p>
      <p>이메일: {session.user.email}</p>
    </div>
  );
}
```

### 5. 보호된 페이지 만들기

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>로딩 중...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <h1>보호된 콘텐츠</h1>
      <p>로그인한 사용자만 볼 수 있습니다</p>
    </div>
  );
}
```

### 6. 사용량 추적

```typescript
import { checkUserQuota, updateUserUsage } from '@repo/auth';

async function generateContent(userId: string, prompt: string) {
  // 1. 사용자 할당량 확인
  const { allowed, remaining, limit } = await checkUserQuota(userId);

  if (!allowed) {
    return {
      error: '월 사용 한도를 초과했습니다. 요금제를 업그레이드하세요.',
      remaining,
      limit
    };
  }

  // 2. AI 콘텐츠 생성
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });

  const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

  // 3. 사용량 기록
  await updateUserUsage(userId, 'content-generation', tokensUsed);

  return {
    content: response.content[0].text,
    tokensUsed,
    remaining: remaining - tokensUsed
  };
}
```

---

## API 레퍼런스

### `createUser(data: SignUpData)`

새 사용자를 생성합니다.

**파라미터**:
```typescript
interface SignUpData {
  email: string;          // 이메일 주소
  password: string;       // 비밀번호 (8자 이상)
  name: string;           // 사용자 이름
  organizationName?: string;  // 조직 이름 (선택)
}
```

**반환값**:
```typescript
{
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}
```

**예제**:
```typescript
const user = await createUser({
  email: 'user@example.com',
  password: 'secure-password-123',
  name: '홍길동',
  organizationName: '우리 회사'
});
```

### `getUserWithSubscription(userId: string)`

사용자 정보와 구독 정보를 함께 가져옵니다.

**반환값**:
```typescript
{
  id: string;
  email: string;
  name: string;
  subscription: {
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    status: 'active' | 'canceled';
    currentPeriodEnd: Date;
  };
  organization: {
    name: string;
    slug: string;
  };
}
```

### `updateUserUsage(userId, feature, tokens)`

사용자의 기능 사용량을 기록합니다.

**파라미터**:
```typescript
userId: string;     // 사용자 ID
feature: string;    // 기능 이름 (예: 'content-generation')
tokens: number;     // 사용된 토큰 수
```

**예제**:
```typescript
await updateUserUsage('user_123', 'content-generation', 1500);
```

### `checkUserQuota(userId: string)`

사용자의 남은 할당량을 확인합니다.

**반환값**:
```typescript
{
  allowed: boolean;   // 사용 가능 여부
  remaining: number;  // 남은 토큰 수
  limit: number;      // 전체 한도
}
```

**예제**:
```typescript
const quota = await checkUserQuota('user_123');

if (!quota.allowed) {
  console.log('사용 한도 초과');
}

console.log(`남은 토큰: ${quota.remaining} / ${quota.limit}`);
```

---

## 보안

### 비밀번호 보안

#### 해싱 알고리즘

```typescript
import bcrypt from 'bcryptjs';

// 비밀번호 해싱 (회원가입 시)
const passwordHash = await bcrypt.hash(password, 12);  // 12 rounds

// 비밀번호 검증 (로그인 시)
const isValid = await bcrypt.compare(password, passwordHash);
```

**bcrypt rounds 설명**:
- `10 rounds`: 빠름, 보안 낮음
- `12 rounds`: ✅ **권장** (현재 설정)
- `14+ rounds`: 느림, 보안 높음

#### 비밀번호 요구사항

```typescript
// Zod 스키마
const passwordSchema = z.string()
  .min(8, '최소 8자 이상')
  .max(100, '최대 100자 이하')
  .regex(/[a-z]/, '소문자 포함 필요')
  .regex(/[A-Z]/, '대문자 포함 필요')
  .regex(/[0-9]/, '숫자 포함 필요')
  .regex(/[^a-zA-Z0-9]/, '특수문자 포함 필요');
```

### JWT 토큰 보안

#### 토큰 설정

```typescript
// packages/auth/src/auth-config.ts
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60,  // 30일
  updateAge: 24 * 60 * 60,     // 24시간마다 갱신
}
```

#### Secret 키 생성

```bash
# 강력한 랜덤 키 생성
openssl rand -base64 32

# 또는
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**중요**: 프로덕션에서는 절대 하드코딩하지 마세요!

### CSRF 보호

NextAuth.js는 기본적으로 CSRF 토큰을 사용합니다:

```typescript
// 자동으로 처리됨
callbacks: {
  async csrf(params) {
    // CSRF 토큰 검증
    return true;
  }
}
```

### 세션 쿠키 보안

```typescript
// 프로덕션 설정
cookies: {
  sessionToken: {
    name: '__Secure-next-auth.session-token',
    options: {
      httpOnly: true,      // JavaScript 접근 차단
      sameSite: 'lax',     // CSRF 방어
      path: '/',
      secure: true,        // HTTPS만 허용
    },
  },
}
```

---

## 문제 해결

### 1. "NEXTAUTH_SECRET is not set"

**원인**: 환경 변수가 설정되지 않음

**해결책**:
```bash
# .env 파일 확인
cat .env | grep NEXTAUTH_SECRET

# 없다면 생성
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env

# 서버 재시작
```

### 2. "Session not found"

**원인**: SessionProvider가 누락됨

**해결책**:
```typescript
// app/layout.tsx에 SessionProvider 추가
import SessionProvider from '@/components/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

### 3. "Invalid credentials"

**원인**: 이메일 또는 비밀번호 불일치

**해결책**:
```typescript
// 디버깅 코드 추가
async authorize(credentials) {
  console.log('로그인 시도:', credentials.email);

  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });

  if (!user) {
    console.log('사용자 없음');
    return null;
  }

  const isValid = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  );

  console.log('비밀번호 검증:', isValid);
  return isValid ? user : null;
}
```

### 4. "Google OAuth not working"

**원인**: 리다이렉트 URI 미설정

**해결책**:
1. Google Cloud Console 접속
2. "사용자 인증 정보" → OAuth 클라이언트 선택
3. "승인된 리다이렉트 URI" 확인:
   ```
   http://localhost:3001/api/auth/callback/google
   ```
4. 저장 후 재시도

### 5. "Database connection failed"

**원인**: PostgreSQL 서버 미실행

**해결책**:
```bash
# PostgreSQL 상태 확인
pg_isready

# Docker 사용 시
docker ps | grep postgres

# 실행
docker start ai-content-postgres

# 또는 새로 생성
docker run -d \
  --name ai-content-postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

### 6. "User already exists"

**원인**: 중복 이메일 가입 시도

**해결책**:
```typescript
// 프론트엔드에서 에러 처리
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  body: JSON.stringify(formData)
});

if (response.status === 409) {
  alert('이미 가입된 이메일입니다. 로그인하세요.');
  router.push('/auth/signin');
}
```

---

## 고급 기능

### 이메일 인증 (예정)

```typescript
// TODO: SendGrid 통합
async function sendVerificationEmail(email: string, token: string) {
  await sendEmail({
    to: email,
    subject: '이메일 인증',
    html: `<a href="${process.env.NEXTAUTH_URL}/verify?token=${token}">인증하기</a>`
  });
}
```

### 2단계 인증 (예정)

```typescript
// TODO: TOTP 구현
import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret();
const token = speakeasy.totp({ secret: secret.base32 });
```

### 소셜 로그인 추가

```typescript
// GitHub Provider 추가 예제
import GitHubProvider from 'next-auth/providers/github';

providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
]
```

---

## 체크리스트

### 프로덕션 배포 전

- [ ] NEXTAUTH_SECRET 설정 (32자 이상)
- [ ] NEXTAUTH_URL 프로덕션 도메인으로 변경
- [ ] Google OAuth 프로덕션 리다이렉트 URI 추가
- [ ] 데이터베이스 마이그레이션 실행
- [ ] HTTPS 활성화
- [ ] 세션 쿠키 secure 옵션 활성화
- [ ] 에러 로깅 설정 (Sentry 등)
- [ ] 비밀번호 재설정 기능 구현
- [ ] 이메일 인증 구현 (선택)
- [ ] Rate Limiting 설정

---

## 참고 자료

- NextAuth.js 공식 문서: https://next-auth.js.org
- Prisma 어댑터: https://authjs.dev/reference/adapter/prisma
- bcrypt 문서: https://www.npmjs.com/package/bcryptjs
- Google OAuth 설정: https://console.cloud.google.com

---

**작성자**: AI Contents Platform Team
**최종 업데이트**: 2024-11-18
**버전**: 1.0.0
