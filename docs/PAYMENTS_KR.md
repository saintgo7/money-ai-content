# 결제 시스템 완벽 가이드

> Stripe 기반 구독 결제 및 매출 관리 시스템

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [매출 목표 및 전략](#매출-목표-및-전략)
3. [설치 및 설정](#설치-및-설정)
4. [요금제 구조](#요금제-구조)
5. [결제 플로우](#결제-플로우)
6. [API 레퍼런스](#api-레퍼런스)
7. [웹훅 처리](#웹훅-처리)
8. [테스트](#테스트)
9. [모니터링](#모니터링)

---

## 시스템 개요

### 기술 스택

```typescript
{
  "payment_gateway": "Stripe",
  "billing_model": "Monthly Subscription",
  "pricing_tiers": 4,
  "webhook_handler": "Next.js API Routes",
  "database": "PostgreSQL + Prisma"
}
```

### 핵심 기능

✅ **구독 관리**
- 월 단위 자동 결제
- 플랜 업그레이드/다운그레이드
- 구독 취소 및 재개

✅ **사용량 추적**
- 토큰 기반 과금
- 실시간 사용량 모니터링
- 한도 초과 방지

✅ **셀프 서비스**
- Stripe Billing Portal
- 카드 정보 업데이트
- 청구 내역 확인

✅ **자동화**
- 웹훅 기반 구독 업데이트
- 결제 실패 자동 처리
- 이메일 알림 (예정)

---

## 매출 목표 및 전략

### 목표: 월 $150,000+ MRR

**MRR (Monthly Recurring Revenue)**: 월간 반복 수익

### 매출 예측 모델

| 요금제 | 월 요금 | 목표 사용자 | 예상 MRR | 비중 |
|--------|---------|-------------|----------|------|
| **Free** | $0 | 10,000명 | $0 | 0% |
| **Starter** | $29 | 1,000명 | $29,000 | 19% |
| **Pro** | $99 | 800명 | $79,200 | 52% |
| **Enterprise** | $299 | 150명 | $44,850 | 29% |
| **총계** | - | **11,950명** | **$153,050** | **100%** |

### 전환 퍼널

```
무료 회원가입 (10,000명)
        ↓ 10% 전환
    Starter ($29)
    1,000명
        ↓ 80% 유지
     Pro ($99)
     800명
        ↓ 18.75% 전환
  Enterprise ($299)
    150명
```

### 성장 로드맵

#### Phase 1: 런칭 (1-3개월)
**목표**: 1,000명 무료 사용자 확보

전략:
- Product Hunt 런칭
- SNS 마케팅
- 무료 티어로 진입 장벽 낮추기
- 콘텐츠 마케팅 (블로그, YouTube)

예상 MRR: $1,000-5,000

#### Phase 2: 초기 성장 (4-6개월)
**목표**: 10% 전환율 달성

전략:
- 온보딩 프로세스 최적화
- 이메일 마케팅 캠페인
- 사용 사례 콘텐츠 제작
- 추천 프로그램 시작

예상 MRR: $20,000-40,000

#### Phase 3: 스케일링 (7-12개월)
**목표**: $150,000 MRR 달성

전략:
- 엔터프라이즈 세일즈
- 파트너십 프로그램
- 화이트라벨 옵션
- API 제공 (B2B)
- 연간 구독 (17% 할인)

예상 MRR: $100,000-$150,000+

### 핵심 지표 (KPI)

```typescript
interface MetricsKPI {
  // 성장 지표
  newSignups: number;           // 신규 가입자
  freeToStarterConversion: number;  // Free → Starter 전환율
  starterToProConversion: number;   // Starter → Pro 전환율

  // 수익 지표
  mrr: number;                  // 월간 반복 수익
  arr: number;                  // 연간 반복 수익 (MRR × 12)
  arpu: number;                 // 사용자당 평균 수익
  ltv: number;                  // 고객 생애 가치

  // 이탈 지표
  churnRate: number;            // 이탈률
  revenueChurn: number;         // 수익 이탈률

  // 건전성 지표
  cac: number;                  // 고객 획득 비용
  ltvCacRatio: number;          // LTV/CAC 비율 (3+ 목표)
  paybackPeriod: number;        // CAC 회수 기간 (개월)
}
```

---

## 설치 및 설정

### 1단계: Stripe 계정 생성

1. **https://stripe.com** 접속
2. "Start now" 클릭하여 계정 생성
3. 대시보드에서 API 키 확인

### 2단계: 제품 및 가격 생성

#### Stripe Dashboard에서 제품 생성

**제품 1: AI Contents Platform - Starter**
```
제품명: AI Contents Platform - Starter
설명: 개인 크리에이터 및 소규모 팀을 위한 플랜
가격: $29 USD
청구 주기: 매월
```

Stripe CLI로 생성 (선택):
```bash
stripe products create \
  --name="AI Contents Platform - Starter" \
  --description="For individuals and small teams"

stripe prices create \
  --unit-amount=2900 \
  --currency=usd \
  --recurring[interval]=month \
  --product=prod_xxx
```

**제품 2: Pro**
```
제품명: AI Contents Platform - Pro
가격: $99 USD / 월
```

**제품 3: Enterprise**
```
제품명: AI Contents Platform - Enterprise
가격: $299 USD / 월
```

#### Price ID 복사

각 제품 생성 후 Price ID를 복사합니다:
- `price_1234StarterMonthly`
- `price_5678ProMonthly`
- `price_9012EnterpriseMonthly`

### 3단계: 환경 변수 설정

```bash
# .env 파일에 추가
cat >> .env << EOF

# Stripe Keys (Dashboard → Developers → API keys)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxx

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID=price_1234StarterMonthly
STRIPE_PRO_PRICE_ID=price_5678ProMonthly
STRIPE_ENTERPRISE_PRICE_ID=price_9012EnterpriseMonthly

# Webhook Secret (나중에 설정)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxx
EOF
```

### 4단계: 웹훅 설정

#### 로컬 개발 환경

```bash
# Stripe CLI 설치
brew install stripe/stripe-cli/stripe

# 로그인
stripe login

# 웹훅 포워딩
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

성공하면 Webhook Signing Secret이 출력됩니다:
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

이 값을 `.env` 파일의 `STRIPE_WEBHOOK_SECRET`에 추가합니다.

#### 프로덕션 환경

1. Stripe Dashboard → "Developers" → "Webhooks"
2. "Add endpoint" 클릭
3. Endpoint URL 입력:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```

4. 이벤트 선택:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. "Add endpoint" 클릭
6. Signing secret 복사하여 환경 변수에 추가

---

## 요금제 구조

### Free 플랜 (무료)

```typescript
{
  name: 'Free',
  price: 0,
  billing: '무료',
  features: [
    '월 10,000 토큰',
    '기본 콘텐츠 생성',
    '5개 플랫폼 모두 이용',
    '1개 브랜드 프로필',
    '1명 팀원',
    '이메일 지원'
  ],
  limits: {
    tokensPerMonth: 10_000,
    brandProfiles: 1,
    teamMembers: 1,
    apiAccess: false,
    prioritySupport: false
  }
}
```

**사용 사례**:
- 개인 블로거
- 취미 크리에이터
- 플랫폼 체험 사용자

### Starter 플랜 ($29/월)

```typescript
{
  name: 'Starter',
  price: 29,
  billing: '월 $29',
  features: [
    '월 100,000 토큰',
    '고급 AI 모델',
    '브랜드 보이스 학습',
    '3개 브랜드 프로필',
    '5명 팀원',
    '우선 지원',
    'API 접근'
  ],
  limits: {
    tokensPerMonth: 100_000,
    brandProfiles: 3,
    teamMembers: 5,
    apiAccess: true,
    prioritySupport: true
  }
}
```

**사용 사례**:
- 프리랜서 마케터
- 소규모 스타트업
- 인플루언서

### Pro 플랜 ($99/월) ⭐️ Most Popular

```typescript
{
  name: 'Pro',
  price: 99,
  billing: '월 $99',
  mostPopular: true,
  features: [
    '월 500,000 토큰',
    '프리미엄 AI 모델',
    '커스텀 브랜드 보이스',
    '10개 브랜드 프로필',
    '20명 팀원',
    '우선 지원',
    '고급 분석',
    '화이트라벨 옵션'
  ],
  limits: {
    tokensPerMonth: 500_000,
    brandProfiles: 10,
    teamMembers: 20,
    apiAccess: true,
    prioritySupport: true,
    analytics: true,
    whiteLabel: true
  }
}
```

**사용 사례**:
- 콘텐츠 대행사
- 중견 기업
- 파워 유저

### Enterprise 플랜 ($299/월)

```typescript
{
  name: 'Enterprise',
  price: 299,
  billing: '월 $299',
  features: [
    '무제한 토큰',
    '커스텀 AI 학습',
    '무제한 브랜드 프로필',
    '무제한 팀원',
    '전담 지원',
    'SLA 보장',
    '커스텀 통합',
    '온프레미스 배포 옵션'
  ],
  limits: {
    tokensPerMonth: -1,  // unlimited
    brandProfiles: -1,
    teamMembers: -1,
    apiAccess: true,
    dedicatedSupport: true,
    sla: true,
    customIntegrations: true,
    onPremise: true
  }
}
```

**사용 사례**:
- 대기업
- 글로벌 마케팅팀
- 엔터프라이즈 고객

### 요금제 비교표

| 기능 | Free | Starter | Pro | Enterprise |
|------|------|---------|-----|------------|
| **월 토큰** | 10K | 100K | 500K | 무제한 |
| **브랜드 프로필** | 1 | 3 | 10 | 무제한 |
| **팀원** | 1 | 5 | 20 | 무제한 |
| **AI 모델** | 기본 | 고급 | 프리미엄 | 커스텀 |
| **API 접근** | ❌ | ✅ | ✅ | ✅ |
| **우선 지원** | ❌ | ✅ | ✅ | ✅ 전담 |
| **고급 분석** | ❌ | ❌ | ✅ | ✅ |
| **화이트라벨** | ❌ | ❌ | ✅ | ✅ |
| **SLA** | ❌ | ❌ | ❌ | ✅ 99.9% |
| **온프레미스** | ❌ | ❌ | ❌ | ✅ |

---

## 결제 플로우

### 구독 시작 플로우

```mermaid
사용자가 요금제 선택
        ↓
    로그인 확인
        ↓
POST /api/checkout
        ↓
Stripe Checkout 세션 생성
        ↓
Stripe 결제 페이지로 리다이렉트
        ↓
    카드 정보 입력
        ↓
    결제 처리 (Stripe)
        ↓
   성공 페이지로 리다이렉트
        ↓
Stripe 웹훅 전송
        ↓
구독 정보 DB 저장
        ↓
   사용자에게 확인 이메일
```

### 플랜 변경 플로우

```mermaid
사용자가 업그레이드/다운그레이드 요청
        ↓
  Billing Portal 열기
        ↓
  Stripe에서 플랜 변경
        ↓
   웹훅으로 알림
        ↓
   DB 업데이트
        ↓
 즉시 새 플랜 적용
```

### 구독 취소 플로우

```mermaid
사용자가 구독 취소 요청
        ↓
  Billing Portal에서 취소
        ↓
   즉시 취소 또는
 기간 종료 후 취소 선택
        ↓
   웹훅으로 알림
        ↓
   DB에서 상태 업데이트
        ↓
무료 플랜으로 다운그레이드
```

---

## API 레퍼런스

### 1. Checkout Session 생성

**Endpoint**: `POST /api/checkout`

**요청**:
```typescript
{
  plan: 'starter' | 'pro' | 'enterprise'
}
```

**응답**:
```typescript
{
  url: string  // Stripe Checkout URL
}
```

**프론트엔드 구현**:
```typescript
async function handleUpgrade(plan: string) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan })
  });

  const { url } = await response.json();

  // Stripe 결제 페이지로 리다이렉트
  window.location.href = url;
}
```

### 2. Billing Portal 열기

**Endpoint**: `POST /api/billing-portal`

**요청**: (본문 없음)

**응답**:
```typescript
{
  url: string  // Stripe Billing Portal URL
}
```

**프론트엔드 구현**:
```typescript
async function openBillingPortal() {
  const response = await fetch('/api/billing-portal', {
    method: 'POST'
  });

  const { url } = await response.json();
  window.location.href = url;
}
```

### 3. 구독 정보 조회

**Endpoint**: `GET /api/subscription`

**응답**:
```typescript
{
  subscription: {
    id: string;
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due';
    currentPeriodEnd: string;  // ISO date
    cancelAtPeriodEnd: boolean;
  };
  usage: {
    tokensUsed: number;
    tokensLimit: number;
    percentage: number;
  };
}
```

**프론트엔드 구현**:
```typescript
async function getSubscriptionInfo() {
  const response = await fetch('/api/subscription');
  const data = await response.json();

  console.log(`현재 플랜: ${data.subscription.plan}`);
  console.log(`사용량: ${data.usage.tokensUsed} / ${data.usage.tokensLimit}`);
}
```

### 4. 사용량 기록

**백엔드 구현**:
```typescript
import { updateUserUsage } from '@repo/auth';

async function trackUsage(userId: string, tokens: number) {
  await updateUserUsage(userId, 'content-generation', tokens);
}
```

---

## 웹훅 처리

### 지원 이벤트

#### 1. `customer.subscription.created`

구독이 생성되었을 때

```typescript
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const plan = subscription.metadata.plan;

  await prisma.subscription.create({
    data: {
      userId,
      plan,
      status: subscription.status,
      stripeCustomerId: subscription.customer,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  });

  // TODO: 환영 이메일 발송
}
```

#### 2. `customer.subscription.updated`

구독이 업데이트되었을 때 (플랜 변경, 갱신 등)

```typescript
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      plan: subscription.metadata.plan,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  });
}
```

#### 3. `customer.subscription.deleted`

구독이 취소되었을 때

```typescript
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      plan: 'free',
      status: 'canceled'
    }
  });

  // TODO: 이탈 방지 이메일 발송
}
```

#### 4. `invoice.payment_succeeded`

결제 성공

```typescript
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`결제 성공: $${invoice.amount_paid / 100}`);

  // TODO: 영수증 이메일 발송
}
```

#### 5. `invoice.payment_failed`

결제 실패

```typescript
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.error(`결제 실패: ${invoice.customer}`);

  // TODO: 결제 실패 알림 이메일
}
```

### 웹훅 보안

```typescript
// 서명 검증
import { stripe } from '@repo/payments';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    // Stripe에서 보낸 요청인지 검증
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: '잘못된 서명' },
      { status: 400 }
    );
  }

  // 이벤트 처리
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    // ...
  }

  return NextResponse.json({ received: true });
}
```

---

## 테스트

### 테스트 카드 번호

Stripe는 다양한 시나리오를 테스트할 수 있는 카드를 제공합니다:

#### 성공 케이스

```
카드 번호: 4242 4242 4242 4242
만료일: 미래의 아무 날짜 (예: 12/34)
CVC: 아무 3자리 (예: 123)
우편번호: 아무 5자리 (예: 12345)
```

#### 결제 실패

```
카드 번호: 4000 0000 0000 0002
→ "카드가 거부되었습니다" 에러
```

#### 3D Secure 인증 필요

```
카드 번호: 4000 0025 0000 3155
→ 추가 인증 단계 요구
```

#### 잔액 부족

```
카드 번호: 4000 0000 0000 9995
→ "잔액 부족" 에러
```

### 테스트 시나리오

#### 1. 신규 구독 테스트

```bash
# 1. 회원가입
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "테스트 사용자"
  }'

# 2. 로그인
# 브라우저에서 /auth/signin 접속

# 3. 요금제 페이지 방문
# /pricing

# 4. Starter 플랜 선택
# → Stripe Checkout으로 리다이렉트

# 5. 테스트 카드 입력 (4242 4242 4242 4242)

# 6. 결제 완료
# → /pricing?success=true로 리다이렉트

# 7. 웹훅 확인
# Stripe CLI에서 웹훅 이벤트 확인

# 8. DB 확인
psql $DATABASE_URL -c "SELECT * FROM subscriptions WHERE plan = 'starter';"
```

#### 2. 플랜 업그레이드 테스트

```bash
# 1. Billing Portal 열기
curl -X POST http://localhost:3001/api/billing-portal

# 2. 플랜 변경
# Stripe Billing Portal에서 Pro로 업그레이드

# 3. 웹훅 확인
# subscription.updated 이벤트 수신

# 4. DB 확인
psql $DATABASE_URL -c "SELECT * FROM subscriptions WHERE plan = 'pro';"
```

#### 3. 구독 취소 테스트

```bash
# 1. Billing Portal에서 구독 취소

# 2. 웹훅 확인
# subscription.deleted 이벤트 수신

# 3. DB 확인
psql $DATABASE_URL -c "SELECT * FROM subscriptions WHERE status = 'canceled';"
```

### 로컬 웹훅 테스트

```bash
# Stripe CLI로 이벤트 트리거
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_succeeded
stripe trigger invoice.payment_failed
```

---

## 모니터링

### 핵심 지표 추적

#### SQL 쿼리로 MRR 계산

```sql
-- 현재 MRR
SELECT
  COUNT(*) FILTER (WHERE plan = 'starter') AS starter_count,
  COUNT(*) FILTER (WHERE plan = 'pro') AS pro_count,
  COUNT(*) FILTER (WHERE plan = 'enterprise') AS enterprise_count,
  (
    COUNT(*) FILTER (WHERE plan = 'starter') * 29 +
    COUNT(*) FILTER (WHERE plan = 'pro') * 99 +
    COUNT(*) FILTER (WHERE plan = 'enterprise') * 299
  ) AS mrr
FROM subscriptions
WHERE status = 'active';
```

#### 이탈률 계산

```sql
-- 월별 이탈률
SELECT
  DATE_TRUNC('month', "updatedAt") AS month,
  COUNT(*) FILTER (WHERE status = 'canceled') * 100.0 / COUNT(*) AS churn_rate
FROM subscriptions
GROUP BY month
ORDER BY month DESC;
```

#### 신규 구독 추이

```sql
-- 월별 신규 구독
SELECT
  DATE_TRUNC('month', "createdAt") AS month,
  plan,
  COUNT(*) AS new_subscriptions
FROM subscriptions
GROUP BY month, plan
ORDER BY month DESC, plan;
```

### Stripe Dashboard 활용

**Dashboard → Home**:
- 일일 거래량
- 신규 고객
- MRR 추이 그래프

**Dashboard → Customers**:
- 전체 고객 목록
- LTV (Lifetime Value)
- 구독 상태

**Dashboard → Billing**:
- 구독 목록
- 청구 내역
- 환불 내역

### 알림 설정

Stripe Dashboard에서 이메일 알림 설정:
- 결제 성공
- 결제 실패
- 구독 취소
- 이탈 리스크 고객

---

## 성장 전략

### 1. 무료 → 유료 전환 전략

**트리거 포인트**:
```typescript
// 사용량 80% 도달 시 업그레이드 프롬프트
if (usage.percentage >= 80) {
  showUpgradeModal({
    message: '이번 달 사용량의 80%를 사용했습니다!',
    cta: 'Starter 플랜으로 업그레이드하고 10배 더 생성하세요',
    savings: '첫 달 50% 할인'
  });
}
```

**이메일 자동화**:
- Day 3: 온보딩 완료 확인
- Day 7: 사용 팁 및 가이드
- Day 14: 성공 사례 공유
- Day 21: 한정 할인 제안 (20% 할인)
- Day 28: 마지막 리마인더

### 2. 업셀링 전략

**Starter → Pro 전환**:
```typescript
// 고급 기능 사용 시도 시
if (plan === 'starter' && feature === 'advanced-analytics') {
  showFeatureGate({
    feature: '고급 분석',
    availableIn: 'Pro 플랜',
    benefits: [
      '상세한 성과 리포트',
      '경쟁사 분석',
      '트렌드 예측'
    ],
    cta: 'Pro로 업그레이드'
  });
}
```

### 3. 연간 구독 유도

```typescript
const annualDiscount = 0.17;  // 17% 할인

// 연간 플랜 가격
const annualPrices = {
  starter: 29 * 12 * (1 - annualDiscount),  // $289/년 (vs $348)
  pro: 99 * 12 * (1 - annualDiscount),      // $986/년 (vs $1,188)
  enterprise: 299 * 12 * (1 - annualDiscount)  // $2,983/년 (vs $3,588)
};
```

**절감 금액 강조**:
- Starter: 연간 $59 절약
- Pro: 연간 $202 절약
- Enterprise: 연간 $605 절약

### 4. 리퍼럴 프로그램 (예정)

```typescript
interface ReferralProgram {
  referrer: {
    reward: '1개월 무료' | '$50 크레딧';
    condition: '친구가 유료 플랜 구독 시';
  };
  referee: {
    reward: '첫 달 20% 할인';
    code: string;  // 고유 추천 코드
  };
}
```

---

## 체크리스트

### 프로덕션 배포 전

- [ ] Stripe 계정을 테스트 모드에서 라이브 모드로 전환
- [ ] 프로덕션 API 키 교체
- [ ] 웹훅 엔드포인트를 프로덕션 URL로 변경
- [ ] 모든 제품 및 가격 ID 업데이트
- [ ] 결제 테스트 (실제 카드)
- [ ] 환불 정책 명시
- [ ] 이용약관 및 개인정보처리방침 링크
- [ ] 영수증 이메일 템플릿 설정
- [ ] 고객 지원 이메일 설정
- [ ] 세금 설정 (VAT, Sales Tax)
- [ ] 사기 방지 설정
- [ ] Stripe Radar 활성화

---

## FAQ

### Q1: 플랜을 중간에 변경하면 어떻게 되나요?

**A**: Stripe는 자동으로 비례 배분(proration)을 처리합니다.

예시:
- Starter ($29) → Pro ($99) 업그레이드
- 월 중간(15일)에 변경
- 기존 플랜의 남은 기간($14.50) 크레딧 적용
- 새 플랜의 나머지 기간($49.50) 즉시 청구
- 총 청구 금액: $49.50 - $14.50 = $35

### Q2: 구독을 취소하면 바로 사용할 수 없나요?

**A**: 아니요, 결제한 기간 종료까지 사용 가능합니다.

- 즉시 취소 옵션도 제공 가능
- 기본값은 "기간 종료 후 취소"

### Q3: 환불 정책은 어떻게 되나요?

**A**: 다음과 같은 환불 정책을 권장합니다:
- 7일 무조건 환불 보장
- 사용량이 10% 미만일 경우
- 기술적 문제로 서비스 이용 불가 시

### Q4: 토큰이 뭔가요?

**A**: AI 처리 단위입니다.
- 1,000 토큰 ≈ 750 단어
- 블로그 포스트 1개 ≈ 2,000-3,000 토큰
- 소셜 미디어 포스트 ≈ 100-300 토큰

### Q5: Enterprise 플랜은 어떻게 구매하나요?

**A**: 영업팀에 문의하세요:
- 이메일: sales@aicontents.com
- 전화: +1-XXX-XXX-XXXX
- 맞춤 견적 및 계약 진행

---

## 참고 자료

- Stripe 공식 문서: https://stripe.com/docs
- Stripe Checkout: https://stripe.com/docs/payments/checkout
- Stripe Billing: https://stripe.com/docs/billing
- 웹훅 가이드: https://stripe.com/docs/webhooks
- 테스트 카드: https://stripe.com/docs/testing

---

**작성자**: AI Contents Platform Team
**최종 업데이트**: 2024-11-18
**버전**: 1.0.0
**목표 MRR**: $150,000+
