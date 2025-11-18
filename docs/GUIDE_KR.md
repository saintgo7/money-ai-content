# AI Contents Platform - 완벽 가이드

> 5개의 AI 기반 SaaS를 통합한 콘텐츠 생성 플랫폼 - 전체 시스템 분석 및 사용 가이드

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [핵심 기능](#핵심-기능)
3. [기술 스택](#기술-스택)
4. [프로젝트 구조](#프로젝트-구조)
5. [설치 및 설정](#설치-및-설정)
6. [개발 가이드](#개발-가이드)
7. [배포 가이드](#배포-가이드)

---

## 시스템 개요

### 플랫폼 목표

**매출 목표**: 12개월 내 월 $150,000+ MRR 달성

**핵심 가치**:
- 5개의 특화된 AI 콘텐츠 생성 도구 제공
- 브랜드 일관성을 유지하면서 다양한 콘텐츠 자동 생성
- 개인 크리에이터부터 엔터프라이즈까지 확장 가능한 구조
- Anthropic Claude API 기반 고품질 AI 생성

### 5개 플랫폼 구성

#### 1. AI Contents Studio (포트 3001)
**올인원 콘텐츠 생성 플랫폼**

- **주요 기능**:
  - 텍스트, 이미지, 오디오, 비디오 통합 생성
  - 브랜드 보이스 학습 및 일관성 유지
  - 소셜 미디어, 블로그, 이메일 등 멀티플랫폼 최적화
  - 콘텐츠 히스토리 및 재사용

- **타겟 사용자**: 마케터, 콘텐츠 크리에이터, 소셜 미디어 매니저

- **주요 페이지**:
  - `/` - 랜딩 페이지
  - `/dashboard` - 대시보드 (통계, 최근 콘텐츠)
  - `/generate` - 콘텐츠 생성 인터페이스
  - `/brand` - 브랜드 보이스 학습
  - `/pricing` - 요금제 페이지
  - `/auth/signin`, `/auth/signup` - 인증 페이지

#### 2. AI Video Generator (포트 3002)
**자동 비디오 생성 플랫폼**

- **주요 기능**:
  - 스크립트에서 자동으로 비디오 생성
  - 유튜브, 틱톡, 릴스 포맷 최적화
  - AI 아바타, 음성 합성, 자동 자막
  - 장면별 스토리보드 생성

- **타겟 사용자**: 유튜버, 비디오 마케터, 교육 콘텐츠 제작자

- **주요 페이지**:
  - `/` - 랜딩 페이지
  - `/dashboard` - 비디오 통계
  - `/create` - 비디오 생성 인터페이스

#### 3. AI Copywriter (포트 3003)
**마케팅 카피 자동화 플랫폼**

- **주요 기능**:
  - 광고 카피, 이메일, 제품 설명 자동 생성
  - 6가지 검증된 카피라이팅 프레임워크 (AIDA, PAS, BAB, 4Ps, FAB, QUEST)
  - A/B 테스트용 변형 생성
  - 전환율 최적화 알고리즘

- **타겟 사용자**: 마케터, 광고 대행사, 이커머스 운영자

- **주요 페이지**:
  - `/` - 랜딩 페이지
  - `/dashboard` - 전환율 통계
  - `/create` - 카피 생성 인터페이스

#### 4. AI Content Curator (포트 3004)
**콘텐츠 큐레이션 플랫폼**

- **주요 기능**:
  - 웹 콘텐츠 자동 수집 및 분석
  - AI 기반 요약 및 인사이트 추출
  - 뉴스레터 자동 생성
  - 트렌드 분석 및 추천

- **타겟 사용자**: 뉴스레터 발행자, 콘텐츠 마케터, 연구자

- **주요 페이지**:
  - `/` - 랜딩 페이지
  - `/dashboard` - 큐레이션 통계
  - `/curate` - 콘텐츠 큐레이션 인터페이스

#### 5. AI Localization Hub (포트 3005)
**다국어 현지화 플랫폼**

- **주요 기능**:
  - 11개 언어 지원 (한국어, 영어, 일본어, 중국어 등)
  - 컨텍스트 인식 번역
  - 문화적 적응 및 민감성 검사
  - 번역 메모리 및 용어집 관리

- **타겟 사용자**: 글로벌 기업, 다국어 콘텐츠 제작자

- **주요 페이지**:
  - `/` - 랜딩 페이지
  - `/dashboard` - 번역 통계
  - `/translate` - 실시간 번역 인터페이스

---

## 핵심 기능

### 1. 사용자 인증 시스템

**구현 기술**: NextAuth.js v4

**지원 인증 방식**:
- ✅ 이메일/비밀번호 (bcrypt 해싱)
- ✅ Google OAuth 2.0
- 🔄 추가 예정: GitHub, Facebook

**보안 기능**:
- JWT 세션 (30일 유효기간)
- CSRF 보호
- 비밀번호 강도 검증 (최소 8자)
- 프로덕션 환경 보안 쿠키

**사용자 플로우**:
```
회원가입 → 이메일 인증 (선택) → 온보딩 → 대시보드
         ↓
   Google OAuth → 자동 계정 생성 → 온보딩
```

### 2. 구독 결제 시스템

**구현 기술**: Stripe Checkout + Subscriptions

**요금제 구조**:

| 플랜 | 월 요금 | 토큰 한도 | 브랜드 프로필 | 팀원 수 | 주요 기능 |
|------|---------|-----------|---------------|---------|-----------|
| **Free** | $0 | 10,000 | 1개 | 1명 | 기본 기능 |
| **Starter** | $29 | 100,000 | 3개 | 5명 | 고급 AI, 우선 지원 |
| **Pro** | $99 | 500,000 | 10개 | 20명 | 프리미엄 AI, 분석 |
| **Enterprise** | $299 | 무제한 | 무제한 | 무제한 | 전용 지원, SLA |

**매출 예측**:
```
Free 사용자:    10,000명 → $0
Starter:        1,000명 → $29,000/월
Pro:            800명 → $79,200/월
Enterprise:     150명 → $44,850/월
────────────────────────────────────
총 MRR:         11,950명 → $153,050/월
```

**결제 플로우**:
```
요금제 선택 → Stripe Checkout → 결제 완료 → 웹훅 처리 → 구독 활성화
                                           ↓
                              사용량 추적 → 한도 체크 → 업그레이드 유도
```

### 3. 사용량 추적 시스템

**토큰 기반 과금**:
- 1,000 토큰 ≈ 750 단어
- 매월 1일 사용량 초기화
- 실시간 사용량 모니터링
- 한도 도달 시 자동 차단 + 업그레이드 안내

**추적 데이터**:
```typescript
{
  userId: string,
  feature: 'content-generation' | 'video-generation' | 'translation',
  tokensUsed: number,
  requestCount: number,
  date: Date
}
```

### 4. 브랜드 보이스 학습

**AI 기반 브랜드 분석**:
1. 기존 콘텐츠 샘플 수집 (최소 3개)
2. Claude AI로 톤앤매너 분석
3. 브랜드 프로필 생성
4. 향후 콘텐츠에 자동 적용

**저장 정보**:
- 톤: 전문적, 친근한, 유머러스 등
- 용어집: 선호 단어, 금지 단어
- 스타일 가이드: 문장 길이, 이모지 사용 등

---

## 기술 스택

### Frontend Stack

```typescript
// Next.js 14 - React 메타프레임워크
{
  "framework": "Next.js 14",
  "router": "App Router",
  "features": [
    "서버 컴포넌트",
    "클라이언트 컴포넌트",
    "API 라우트",
    "미들웨어"
  ]
}

// React 18
{
  "library": "React 18",
  "features": [
    "Hooks (useState, useEffect, useSession)",
    "Suspense",
    "Concurrent Features"
  ]
}

// TailwindCSS - 스타일링
{
  "framework": "TailwindCSS 3.4",
  "config": "공유 설정 (@repo/ui)",
  "features": [
    "유틸리티 우선",
    "반응형 디자인",
    "다크모드 지원 (예정)"
  ]
}

// TypeScript - 타입 안전성
{
  "language": "TypeScript 5.3",
  "strict": true,
  "features": [
    "타입 체킹",
    "인텔리센스",
    "리팩토링 도구"
  ]
}
```

### Backend Stack

```python
# FastAPI - Python 웹 프레임워크
{
    "framework": "FastAPI 0.104",
    "features": [
        "자동 API 문서 (Swagger)",
        "타입 검증 (Pydantic)",
        "비동기 처리",
        "CORS 지원"
    ],
    "endpoints": 9
}

# Anthropic Claude API
{
    "provider": "Anthropic",
    "model": "claude-sonnet-4-20250514",
    "features": [
        "200K 컨텍스트 윈도우",
        "멀티모달 (텍스트, 이미지)",
        "스트리밍 응답",
        "고품질 생성"
    ]
}
```

### Database Stack

```prisma
// PostgreSQL - 관계형 데이터베이스
database: "PostgreSQL 15"
orm: "Prisma 5.7"

// 주요 모델 (20개)
models: [
  "User",           // 사용자
  "Organization",   // 조직
  "Subscription",   // 구독
  "UsageRecord",    // 사용량
  "BrandProfile",   // 브랜드
  "Content",        // 콘텐츠
  "Translation",    // 번역
  "Asset"           // 미디어
]

// 총 필드 수: 82개
```

### Infrastructure

```yaml
# Monorepo 구조
tool: Turborepo 1.11
package_manager: pnpm 8.12

# 컨테이너화
docker: Docker Compose
services:
  - postgres: 5432
  - redis: 6379
  - api-gateway: 8000
  - contents-studio: 3001
  - video-generator: 3002
  - copywriter: 3003
  - content-curator: 3004
  - localization-hub: 3005

# 배포 (예정)
platform: Vercel (Frontend) + Railway (Backend)
cdn: Cloudflare
storage: AWS S3 / Cloudflare R2
```

---

## 프로젝트 구조

### 폴더 구조 전체 맵

```
money-ai-content/
│
├── 📱 apps/                          # 5개 애플리케이션
│   ├── contents-studio/              # AI Contents Studio (3001)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx          # 랜딩 페이지
│   │   │   │   ├── layout.tsx        # 루트 레이아웃
│   │   │   │   ├── dashboard/        # 대시보드
│   │   │   │   ├── generate/         # 콘텐츠 생성
│   │   │   │   ├── brand/            # 브랜드 관리
│   │   │   │   ├── pricing/          # 요금제
│   │   │   │   ├── auth/             # 인증 (로그인/회원가입)
│   │   │   │   ├── onboarding/       # 온보딩
│   │   │   │   └── api/              # API 라우트
│   │   │   │       ├── auth/         # NextAuth
│   │   │   │       ├── checkout/     # Stripe 체크아웃
│   │   │   │       ├── billing-portal/ # 결제 관리
│   │   │   │       └── webhooks/     # Stripe 웹훅
│   │   │   ├── components/           # React 컴포넌트
│   │   │   └── styles/
│   │   └── package.json
│   │
│   ├── video-generator/              # AI Video Generator (3002)
│   ├── copywriter/                   # AI Copywriter (3003)
│   ├── content-curator/              # AI Content Curator (3004)
│   └── localization-hub/             # AI Localization Hub (3005)
│
├── 📦 packages/                      # 공유 패키지
│   ├── ai-client/                    # Anthropic Claude 클라이언트
│   │   ├── src/
│   │   │   ├── claude-client.ts      # 메인 클라이언트
│   │   │   ├── brand-voice.ts        # 브랜드 보이스 학습
│   │   │   ├── prompts/              # 프롬프트 템플릿
│   │   │   └── types.ts              # TypeScript 타입
│   │   └── package.json
│   │
│   ├── auth/                         # 인증 시스템
│   │   ├── src/
│   │   │   ├── auth-config.ts        # NextAuth 설정
│   │   │   ├── auth-utils.ts         # 유틸리티 함수
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   ├── payments/                     # 결제 시스템
│   │   ├── src/
│   │   │   ├── stripe-client.ts      # Stripe 통합
│   │   │   ├── webhook-handler.ts    # 웹훅 처리
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── database/                     # 데이터베이스
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # DB 스키마 (82 필드)
│   │   │   └── migrations/           # 마이그레이션
│   │   └── package.json
│   │
│   ├── ui/                           # UI 컴포넌트 라이브러리
│   │   ├── src/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Spinner.tsx
│   │   └── package.json
│   │
│   └── shared/                       # 공통 유틸리티
│       ├── src/
│       │   ├── utils.ts
│       │   ├── constants.ts
│       │   └── types.ts
│       └── package.json
│
├── 🔧 services/                      # 백엔드 서비스
│   └── api-gateway/                  # FastAPI 게이트웨이
│       ├── main.py                   # 메인 서버 (9개 엔드포인트)
│       ├── requirements.txt          # Python 의존성
│       └── routers/                  # API 라우터
│
├── 🏗️ infrastructure/                # 인프라 설정
│   └── docker/
│       └── docker-compose.yml        # 전체 스택 컨테이너
│
├── 📚 docs/                          # 문서
│   ├── SETUP.md                      # 설치 가이드
│   ├── API.md                        # API 레퍼런스
│   ├── FEATURES.md                   # 기능 명세
│   ├── AUTHENTICATION.md             # 인증 가이드
│   └── PAYMENTS.md                   # 결제 가이드
│
├── 📄 설정 파일
│   ├── package.json                  # 루트 패키지
│   ├── pnpm-workspace.yaml           # pnpm 워크스페이스
│   ├── turbo.json                    # Turborepo 설정
│   ├── .env.example                  # 환경변수 템플릿
│   ├── tsconfig.json                 # TypeScript 설정
│   └── .gitignore
│
└── 📋 문서
    ├── README.md                     # 프로젝트 개요
    ├── QUICKSTART.md                 # 빠른 시작
    ├── TEST_REPORT.md                # 테스트 리포트
    └── CHANGELOG.md                  # 변경 로그
```

### 주요 파일 분석

#### 1. Next.js App Router 구조

각 앱은 Next.js 14 App Router를 사용합니다:

```typescript
// app/layout.tsx - 루트 레이아웃
import SessionProvider from '@/components/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}  {/* 모든 페이지 */}
        </SessionProvider>
      </body>
    </html>
  );
}

// app/page.tsx - 랜딩 페이지 (/)
// app/dashboard/page.tsx - 대시보드 (/dashboard)
// app/api/auth/[...nextauth]/route.ts - API 라우트
```

#### 2. Prisma 스키마 핵심 모델

```prisma
// User - 사용자
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  password      String?  // bcrypt 해시
  role          UserRole @default(USER)

  subscription  Subscription?
  usage         UsageRecord[]
  contents      Content[]
  brandProfiles BrandProfile[]
}

// Subscription - 구독
model Subscription {
  id                     String   @id
  userId                 String   @unique
  plan                   String   // free, starter, pro, enterprise
  status                 String   // active, canceled
  currentPeriodEnd       DateTime
  stripeCustomerId       String?
  stripeSubscriptionId   String?
}

// UsageRecord - 사용량 추적
model UsageRecord {
  id           String   @id
  userId       String
  feature      String   // content-generation, video, etc.
  tokensUsed   Int
  requestCount Int
  date         DateTime

  @@unique([userId, feature, date])
}
```

#### 3. API Gateway (FastAPI)

```python
# main.py - 메인 서버
from fastapi import FastAPI
from anthropic import Anthropic

app = FastAPI()
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# 9개 엔드포인트:
# 1. POST /api/v1/content/generate - 콘텐츠 생성
# 2. POST /api/v1/video/generate - 비디오 생성
# 3. POST /api/v1/copy/generate - 카피 생성
# 4. POST /api/v1/curator/analyze - 콘텐츠 분석
# 5. POST /api/v1/translate - 번역
# 6. POST /api/v1/brand/learn - 브랜드 학습
# 7. POST /api/v1/brand/apply - 브랜드 적용
# 8. POST /api/v1/image/generate - 이미지 생성 (예정)
# 9. GET /health - 헬스 체크

@app.post("/api/v1/content/generate")
async def generate_content(request: GenerateContentRequest):
    response = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    return GenerateContentResponse(content=response.content[0].text)
```

---

## 설치 및 설정

### 시스템 요구사항

```yaml
운영체제: macOS, Linux, Windows (WSL2)
Node.js: >= 18.0.0
pnpm: >= 8.0.0
Python: >= 3.11
PostgreSQL: >= 15
Redis: >= 7 (선택)
Docker: >= 24 (선택)
```

### 1단계: 저장소 클론

```bash
git clone https://github.com/your-org/money-ai-content.git
cd money-ai-content
```

### 2단계: 의존성 설치

```bash
# Node.js 패키지 설치 (모든 앱 + 패키지)
pnpm install

# Python 의존성 설치 (API 게이트웨이)
cd services/api-gateway
pip install -r requirements.txt
cd ../..
```

### 3단계: 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# 편집기로 열기
nano .env  # 또는 code .env
```

**필수 환경 변수**:

```bash
# Anthropic Claude API (필수)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# 데이터베이스 (필수)
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_content_db

# NextAuth (필수)
NEXTAUTH_SECRET=$(openssl rand -base64 32)  # 랜덤 생성
NEXTAUTH_URL=http://localhost:3001

# Stripe (선택 - 결제 기능용)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_STARTER_PRICE_ID=price_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx

# Google OAuth (선택)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 4단계: 데이터베이스 초기화

```bash
# PostgreSQL 실행 (Docker 사용 시)
docker run -d \
  --name ai-content-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_content_db \
  -p 5432:5432 \
  postgres:15

# Prisma 마이그레이션
cd packages/database
pnpm db:generate  # Prisma Client 생성
pnpm db:push      # 스키마를 DB에 푸시
pnpm db:seed      # 샘플 데이터 (선택)
cd ../..
```

### 5단계: 개발 서버 실행

**방법 1: Turborepo로 전체 실행**

```bash
pnpm dev
```

이 명령어는 다음을 동시에 실행합니다:
- AI Contents Studio (3001)
- AI Video Generator (3002)
- AI Copywriter (3003)
- AI Content Curator (3004)
- AI Localization Hub (3005)

**방법 2: 개별 실행**

```bash
# 1. API Gateway (백엔드)
cd services/api-gateway
python main.py  # http://localhost:8000

# 2. Contents Studio (별도 터미널)
cd apps/contents-studio
pnpm dev  # http://localhost:3001

# 3. 기타 앱들도 동일하게...
```

**방법 3: Docker Compose**

```bash
docker-compose -f infrastructure/docker/docker-compose.yml up
```

### 6단계: 접속 확인

브라우저에서 다음 URL 접속:

- **AI Contents Studio**: http://localhost:3001
- **AI Video Generator**: http://localhost:3002
- **AI Copywriter**: http://localhost:3003
- **AI Content Curator**: http://localhost:3004
- **AI Localization Hub**: http://localhost:3005
- **API Gateway**: http://localhost:8000/docs (Swagger)

---

## 개발 가이드

### 새 기능 추가하기

#### 예제: 새로운 AI 생성 기능 추가

**1. 프롬프트 템플릿 작성**

```typescript
// packages/ai-client/src/prompts/my-feature.ts
export function createMyFeaturePrompt(input: string): string {
  return `
당신은 전문 ${input} 생성 AI입니다.

요구사항:
- 창의적이고 독창적인 결과
- 타겟 오디언스에 맞는 톤
- SEO 최적화

입력: ${input}

출력 형식: JSON
{
  "title": "제목",
  "content": "본문",
  "keywords": ["키워드1", "키워드2"]
}
`;
}
```

**2. API 엔드포인트 추가**

```python
# services/api-gateway/main.py
from pydantic import BaseModel

class MyFeatureRequest(BaseModel):
    input: str
    options: dict = {}

@app.post("/api/v1/my-feature/generate")
async def generate_my_feature(request: MyFeatureRequest):
    prompt = create_my_feature_prompt(request.input)

    response = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    return {"result": response.content[0].text}
```

**3. Frontend 페이지 생성**

```typescript
// apps/contents-studio/src/app/my-feature/page.tsx
'use client';

import { useState } from 'use';
import { Button, Input, Card } from '@repo/ui';

export default function MyFeaturePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    const response = await fetch('http://localhost:8000/api/v1/my-feature/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });

    const data = await response.json();
    setResult(data.result);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">내 새 기능</h1>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="입력하세요..."
      />
      <Button onClick={handleGenerate}>생성</Button>

      {result && (
        <Card className="mt-4 p-6">
          <pre>{result}</pre>
        </Card>
      )}
    </div>
  );
}
```

### 테스트 작성

```typescript
// apps/contents-studio/src/app/my-feature/__tests__/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import MyFeaturePage from '../page';

describe('MyFeaturePage', () => {
  it('should render input and button', () => {
    render(<MyFeaturePage />);
    expect(screen.getByPlaceholderText('입력하세요...')).toBeInTheDocument();
    expect(screen.getByText('생성')).toBeInTheDocument();
  });

  it('should call API when button clicked', async () => {
    // 테스트 구현...
  });
});
```

### 코드 스타일 가이드

```typescript
// ✅ 좋은 예
export async function generateContent(params: ContentParams): Promise<ContentResult> {
  // 1. 입력 검증
  if (!params.topic) {
    throw new Error('Topic is required');
  }

  // 2. API 호출
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: JSON.stringify(params)
  });

  // 3. 에러 처리
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  // 4. 결과 반환
  return await response.json();
}

// ❌ 나쁜 예
async function gen(p: any) {
  const r = await fetch('/api/generate', { method: 'POST', body: JSON.stringify(p) });
  return r.json();
}
```

---

## 배포 가이드

### Vercel 배포 (Frontend)

**각 앱을 개별 Vercel 프로젝트로 배포**:

```bash
# Contents Studio 배포
cd apps/contents-studio
vercel --prod

# Video Generator 배포
cd apps/video-generator
vercel --prod

# 나머지 앱들도 동일...
```

**환경 변수 설정** (Vercel Dashboard):
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `ANTHROPIC_API_KEY`

### Railway 배포 (Backend)

```bash
# API Gateway 배포
cd services/api-gateway
railway up
```

### 데이터베이스 (Supabase/Neon)

**Supabase 사용 시**:
1. https://supabase.com 에서 프로젝트 생성
2. Connection String 복사
3. `DATABASE_URL` 환경 변수에 추가

**마이그레이션**:
```bash
cd packages/database
pnpm db:migrate deploy
```

### 프로덕션 체크리스트

- [ ] 모든 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 실행
- [ ] Stripe 웹훅 URL 설정
- [ ] Google OAuth 리다이렉트 URI 추가
- [ ] CORS 설정 확인
- [ ] 에러 모니터링 설정 (Sentry)
- [ ] 분석 도구 설정 (Google Analytics)
- [ ] SSL 인증서 확인
- [ ] 백업 정책 수립
- [ ] 로드 테스트 수행

---

## 문제 해결

### 자주 발생하는 문제

#### 1. "NEXTAUTH_SECRET is not set"

**해결책**:
```bash
# .env 파일에 추가
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

#### 2. "Database connection failed"

**해결책**:
```bash
# PostgreSQL 실행 확인
pg_isready

# Docker 사용 시
docker ps | grep postgres

# 연결 문자열 확인
echo $DATABASE_URL
```

#### 3. "Anthropic API error: 401"

**해결책**:
- API 키 확인: https://console.anthropic.com
- .env 파일에서 `ANTHROPIC_API_KEY` 확인
- 서버 재시작

#### 4. "Port already in use"

**해결책**:
```bash
# 포트 사용 중인 프로세스 찾기
lsof -i :3001

# 프로세스 종료
kill -9 <PID>
```

---

## 다음 단계

### Phase 1: 핵심 기능 완성 (1-2개월)
- [ ] 모든 앱에 인증 시스템 복제
- [ ] AI 엔드포인트에 사용량 추적 통합
- [ ] 업그레이드 프롬프트 UI 추가
- [ ] 이메일 알림 시스템 (SendGrid)

### Phase 2: 제품 향상 (3-4개월)
- [ ] 관리자 대시보드
- [ ] 팀 멤버 초대 기능
- [ ] 고급 분석 대시보드
- [ ] API 키 발급 및 관리
- [ ] 웹훅 지원

### Phase 3: 성장 (5-12개월)
- [ ] 리퍼럴 프로그램
- [ ] 제휴 프로그램
- [ ] 화이트라벨 옵션
- [ ] 엔터프라이즈 기능
- [ ] 모바일 앱

---

## 기여 가이드

프로젝트에 기여하고 싶으신가요?

1. Fork 저장소
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 커밋 (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

---

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

## 지원 및 문의

- 📧 이메일: support@aicontents.com
- 💬 Discord: https://discord.gg/aicontents
- 📚 문서: https://docs.aicontents.com
- 🐛 이슈: https://github.com/your-org/money-ai-content/issues

---

**만든 사람**: AI Contents Platform Team
**최종 업데이트**: 2024-11-18
**버전**: 1.0.0
