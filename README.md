# AI Contents Platform - 종합 콘텐츠 생성 플랫폼

5개의 AI 기반 SaaS 제품을 통합한 콘텐츠 생성 및 관리 플랫폼

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

## 시작하기

### 필수 요구사항

- Node.js 18+
- Python 3.11+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+

### 설치

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집 (API 키 등)

# 데이터베이스 설정
pnpm db:setup

# 개발 서버 시작
pnpm dev
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
