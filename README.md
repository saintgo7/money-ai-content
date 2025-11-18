# AI Contents Platform - 종합 콘텐츠 생성 플랫폼

> 5개의 AI 기반 SaaS 제품을 통합한 콘텐츠 생성 및 관리 플랫폼
>
> **목표**: 12개월 내 월 $150,000+ MRR 달성

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)

## 🎯 핵심 가치

- **🚀 5개 특화 플랫폼**: Contents Studio, Video Generator, Copywriter, Content Curator, Localization Hub
- **🤖 최고의 AI**: Anthropic Claude Sonnet 4 기반 고품질 콘텐츠 생성
- **💰 검증된 수익 모델**: 4단계 요금제 (Free → $29 → $99 → $299)
- **🔐 완전한 인증 시스템**: NextAuth.js + 이메일/Google OAuth
- **💳 구독 결제 통합**: Stripe Checkout + Billing Portal
- **📊 사용량 추적**: 토큰 기반 과금 및 할당량 관리

## 📊 매출 목표

| 플랜 | 월 요금 | 목표 사용자 | MRR |
|------|---------|-------------|-----|
| Free | $0 | 10,000명 | $0 |
| Starter | $29 | 1,000명 | $29,000 |
| Pro | $99 | 800명 | $79,200 |
| Enterprise | $299 | 150명 | $44,850 |
| **총계** | - | **11,950명** | **$153,050** |

## 🏗️ 프로젝트 상태

### ✅ 완료된 기능

- [x] **5개 플랫폼 기본 구조**
  - [x] AI Contents Studio (포트 3001)
  - [x] AI Video Generator (포트 3002)
  - [x] AI Copywriter (포트 3003)
  - [x] AI Content Curator (포트 3004)
  - [x] AI Localization Hub (포트 3005)

- [x] **인증 시스템** (@repo/auth)
  - [x] NextAuth.js 통합
  - [x] 이메일/비밀번호 인증
  - [x] Google OAuth 2.0
  - [x] JWT 세션 관리
  - [x] 회원가입/로그인 페이지
  - [x] 온보딩 플로우

- [x] **결제 시스템** (@repo/payments)
  - [x] Stripe 구독 결제
  - [x] 4단계 요금제
  - [x] Checkout 세션
  - [x] Billing Portal
  - [x] 웹훅 처리
  - [x] 요금제 페이지

- [x] **사용량 추적**
  - [x] 토큰 기반 과금
  - [x] 월별 사용량 집계
  - [x] 플랜별 할당량 관리
  - [x] 초과 사용 방지

- [x] **백엔드 API**
  - [x] FastAPI 게이트웨이
  - [x] 9개 엔드포인트
  - [x] Anthropic Claude 통합
  - [x] CORS 설정

- [x] **공유 패키지**
  - [x] @repo/ai-client - Claude API
  - [x] @repo/database - Prisma
  - [x] @repo/auth - 인증
  - [x] @repo/payments - 결제
  - [x] @repo/ui - UI 컴포넌트
  - [x] @repo/shared - 유틸리티

- [x] **문서화**
  - [x] 완벽 가이드 (한글)
  - [x] 인증 가이드 (한글)
  - [x] 결제 가이드 (한글)
  - [x] 빠른 시작 (한글)
  - [x] API 레퍼런스
  - [x] 테스트 리포트

### 🔄 진행 중

- [ ] 모든 앱에 인증 시스템 복제
- [ ] AI 엔드포인트에 사용량 추적 통합
- [ ] 업그레이드 프롬프트 UI
- [ ] 이메일 알림 시스템

### 📅 예정된 기능

- [ ] 팀 멤버 초대
- [ ] API 키 발급
- [ ] 관리자 대시보드
- [ ] 고급 분석
- [ ] 리퍼럴 프로그램

---

## 프로젝트 구성

### 🎨 앱 (Apps)

1. **AI Contents Studio** - 올인원 콘텐츠 생성 플랫폼
   - 텍스트, 이미지, 오디오, 비디오 통합 생성
   - 브랜드 보이스 학습 및 일관성 유지
   - 멀티플랫폼 최적화

2. **AI Video Generator** - 자동 비디오 생성
   - 스크립트에서 비디오 자동 생성
   - 유튜브, 틱톡, 릴스 최적화
   - AI 아바타, 음성, 자막

3. **AI Copywriter** - 마케팅 카피 자동화
   - 광고 카피, 이메일, 제품 설명
   - 검증된 카피라이팅 프레임워크
   - A/B 테스트 변형 생성

4. **AI Content Curator** - 콘텐츠 큐레이션
   - 웹 콘텐츠 자동 수집 및 분석
   - AI 요약 및 인사이트 추출
   - 뉴스레터 자동 생성

5. **AI Localization Hub** - 다국어 현지화
   - 컨텍스트 인식 번역
   - 문화적 적응 및 민감성 검사
   - 번역 메모리 및 용어집

### 📦 패키지 (Packages)

- **@repo/ai-client** - Anthropic Claude API 클라이언트
- **@repo/database** - PostgreSQL + Prisma
- **@repo/auth** - NextAuth.js 인증 시스템 (이메일/비밀번호, Google OAuth)
- **@repo/payments** - Stripe 결제 및 구독 관리
- **@repo/ui** - 공유 UI 컴포넌트 (React)
- **@repo/shared** - 공통 유틸리티

### 🔧 서비스 (Services)

- **api-gateway** - API 게이트웨이
- **queue-worker** - 백그라운드 작업 처리

## 기술 스택

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion

### Backend
- Python (FastAPI)
- Node.js (NestJS)
- PostgreSQL
- Redis
- Celery + RabbitMQ

### AI/ML
- Anthropic Claude API (Sonnet 4)
- Stable Diffusion XL (이미지)
- ElevenLabs (음성)
- Whisper (음성 인식)

### Infrastructure
- Docker
- AWS S3
- Cloudflare (CDN)

## 🚀 빠른 시작

### 5분 안에 실행하기

```bash
# 1. 저장소 클론
git clone https://github.com/your-org/money-ai-content.git
cd money-ai-content

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일에서 ANTHROPIC_API_KEY 설정 필수!

# 4. 데이터베이스 실행 (Docker)
docker run -d --name ai-content-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_content_db \
  -p 5432:5432 postgres:15

# 5. 데이터베이스 초기화
cd packages/database
pnpm db:generate && pnpm db:push
cd ../..

# 6. 개발 서버 시작 (모든 앱 동시 실행)
pnpm dev
```

### 접속 확인

- 🎨 **AI Contents Studio**: http://localhost:3001
- 🎬 **AI Video Generator**: http://localhost:3002
- ✍️ **AI Copywriter**: http://localhost:3003
- 📰 **AI Content Curator**: http://localhost:3004
- 🌍 **AI Localization Hub**: http://localhost:3005
- 📡 **API Docs (Swagger)**: http://localhost:8000/docs

### 필수 요구사항

| 항목 | 버전 | 설치 링크 |
|------|------|-----------|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.11+ | https://python.org |
| pnpm | 8+ | `npm install -g pnpm` |
| PostgreSQL | 15+ | https://postgresql.org |
| Docker | 24+ (선택) | https://docker.com |

### 환경 변수 설정

**필수 변수**:
```bash
# .env
ANTHROPIC_API_KEY=sk-ant-your-key-here  # https://console.anthropic.com
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_content_db
NEXTAUTH_SECRET=your-secret-32-chars-minimum
NEXTAUTH_URL=http://localhost:3001
```

**선택 변수** (결제 기능 사용 시):
```bash
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com  # OAuth 사용 시
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
```

### 환경 변수

```env
# Anthropic
ANTHROPIC_API_KEY=your_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_content

# Redis
REDIS_URL=redis://localhost:6379

# AWS
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket

# Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 개발

```bash
# 모든 앱 개발 모드 실행
pnpm dev

# 특정 앱만 실행
pnpm dev --filter=@apps/contents-studio

# 빌드
pnpm build

# 린트
pnpm lint

# 테스트
pnpm test
```

## 프로젝트 구조

```
money-ai-content/
├── apps/
│   ├── contents-studio/     # Port 3001
│   ├── video-generator/     # Port 3002
│   ├── copywriter/          # Port 3003
│   ├── content-curator/     # Port 3004
│   └── localization-hub/    # Port 3005
├── packages/
│   ├── ai-client/
│   ├── database/
│   ├── auth/
│   ├── ui/
│   └── shared/
├── services/
│   ├── api-gateway/         # Port 8000
│   └── queue-worker/
└── infrastructure/
    ├── docker/
    └── k8s/
```

## 수익 모델

각 플랫폼은 독립적인 구독 모델:
- Free Tier
- Starter ($19-29/월)
- Pro ($49-79/월)
- Business ($149-199/월)
- Enterprise (커스텀)

**예상 목표**: $150,000+ MRR (12개월)

## 라이센스

Proprietary - All Rights Reserved

## 개발 로드맵

### Phase 1 (5-6주) - 기반 인프라
- ✅ 모노레포 설정
- ⏳ 공통 패키지 개발
- ⏳ 인증 시스템
- ⏳ 데이터베이스 스키마

### Phase 2 (6-8주) - AI Contents Studio
- ⏳ 브랜드 보이스 엔진
- ⏳ 멀티모달 생성기
- ⏳ 콘텐츠 캘린더

### Phase 3 (4-5주) - AI Copywriter
- ⏳ 카피 생성 엔진
- ⏳ 프레임워크 시스템
- ⏳ SEO 최적화

### Phase 4 (6-8주) - AI Video Generator
- ⏳ 스크립트 투 비디오
- ⏳ 비디오 에디터
- ⏳ 템플릿 시스템

### Phase 5 (3-4주) - AI Content Curator
- ⏳ 콘텐츠 수집 엔진
- ⏳ 트렌드 모니터링
- ⏳ 뉴스레터 생성

### Phase 6 (3-4주) - AI Localization Hub
- ⏳ 번역 엔진
- ⏳ 문화적 적응
- ⏳ 번역 메모리

### Phase 7 (2-3주) - 통합 및 런칭
- ⏳ 결제 시스템
- ⏳ 성능 최적화
- ⏳ 배포 및 모니터링

---

## 📚 문서 (한글)

### 시작하기
- **[빠른 시작 가이드](./docs/QUICKSTART_KR.md)** - 5분 안에 실행하기
- **[완벽 가이드](./docs/GUIDE_KR.md)** - 전체 시스템 설명 및 개발 가이드

### 핵심 기능
- **[인증 시스템 가이드](./docs/AUTHENTICATION_KR.md)** - NextAuth.js 설정 및 사용법
- **[결제 시스템 가이드](./docs/PAYMENTS_KR.md)** - Stripe 통합 및 MRR 전략

### 기술 문서
- **[API 레퍼런스](./docs/API.md)** - 백엔드 API 명세
- **[기능 명세](./docs/FEATURES.md)** - 각 플랫폼 기능 설명
- **[설치 가이드](./docs/SETUP.md)** - 상세 설치 절차

### 참고 자료
- **[테스트 리포트](./TEST_REPORT.md)** - 전체 시스템 테스트 결과
- **[변경 로그](./CHANGELOG.md)** - 최신 업데이트 내역

---

## 💡 사용 예시

### 1. 첫 번째 콘텐츠 생성

```bash
# Contents Studio 접속
open http://localhost:3001

# 회원가입 → 온보딩 → 대시보드 → "+ New Content"
```

**또는 API로 직접 호출**:

```bash
curl -X POST http://localhost:8000/api/v1/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "social_post",
    "topic": "AI 마케팅 자동화",
    "platform": "instagram",
    "tone": "professional"
  }'
```

### 2. 브랜드 보이스 학습

```typescript
import { ClaudeClient } from '@repo/ai-client';

const claude = new ClaudeClient();

const brandProfile = await claude.learnBrandVoice(
  ['기존 블로그 포스트 1', '기존 블로그 포스트 2'],
  '우리는 친근하고 전문적인 톤을 사용합니다',
  ['혁신', '효율성', '고객 중심']
);
```

### 3. 번역 (11개 언어 지원)

```bash
# Localization Hub 접속
open http://localhost:3005/translate

# 원문 입력 → 대상 언어 선택 → 번역
```

---

## 🛠️ 주요 명령어

### 개발

```bash
pnpm dev              # 모든 앱 실행
pnpm build            # 프로덕션 빌드
pnpm lint             # 코드 린트
pnpm type-check       # TypeScript 타입 체크
```

### 데이터베이스

```bash
cd packages/database
pnpm db:generate      # Prisma Client 생성
pnpm db:push          # 스키마 푸시
pnpm db:studio        # Prisma Studio (GUI)
pnpm db:seed          # 샘플 데이터 생성
pnpm db:reset         # 데이터베이스 리셋
```

### Docker

```bash
# 전체 스택 실행
docker-compose -f infrastructure/docker/docker-compose.yml up

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down
```

---

## 🤝 기여하기

1. Fork 저장소
2. Feature 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가/수정
chore: 빌드 프로세스 수정
```

---

## 📞 지원 및 문의

- **📧 이메일**: support@aicontents.com
- **💬 Discord**: https://discord.gg/aicontents
- **🐛 이슈 제보**: https://github.com/your-org/money-ai-content/issues
- **📖 문서 사이트**: https://docs.aicontents.com

---

## 📜 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## ⭐ 특별 감사

- [Anthropic](https://www.anthropic.com) - Claude AI API 제공
- [Stripe](https://stripe.com) - 결제 인프라
- [Vercel](https://vercel.com) - Next.js 및 호스팅
- [Prisma](https://www.prisma.io) - 데이터베이스 ORM

---

<div align="center">

**AI Contents Platform**

*콘텐츠 생성의 미래를 만들어갑니다* 🚀

Made with ❤️ by AI Contents Platform Team

[웹사이트](https://aicontents.com) · [문서](https://docs.aicontents.com) · [Discord](https://discord.gg/aicontents)

</div>
