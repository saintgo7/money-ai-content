# 빠른 시작 가이드

> 5분 안에 AI Contents Platform 실행하기

## 전체 개요

이 가이드를 따라하면 다음을 완료할 수 있습니다:
- ✅ 로컬 개발 환경 설정
- ✅ 5개 플랫폼 모두 실행
- ✅ 첫 번째 AI 콘텐츠 생성
- ✅ 회원가입 및 로그인 테스트

**예상 소요 시간**: 5-10분

---

## 사전 요구사항

### 필수 설치

```bash
# Node.js 버전 확인 (18 이상 필요)
node --version  # v18.0.0 이상

# pnpm 설치 (없다면)
npm install -g pnpm

# Python 버전 확인 (3.11 이상 필요)
python3 --version  # 3.11 이상

# PostgreSQL 설치 확인
which psql

# Docker 설치 (선택사항, 권장)
docker --version
```

### 옵션 A: Docker 사용 (추천)
- Docker Desktop 설치: https://www.docker.com/products/docker-desktop

### 옵션 B: 직접 설치
- PostgreSQL 15: https://www.postgresql.org/download/
- Redis 7 (선택): https://redis.io/download/

---

## 5분 퀵스타트

### 1단계: 저장소 클론 (30초)

```bash
# 저장소 클론
git clone https://github.com/your-org/money-ai-content.git
cd money-ai-content

# 브랜치 확인
git branch
```

### 2단계: 의존성 설치 (2분)

```bash
# Node.js 패키지 설치 (모든 앱 + 패키지)
pnpm install

# Python 패키지 설치 (API Gateway)
cd services/api-gateway
pip3 install -r requirements.txt
cd ../..
```

**설치 완료 확인**:
```bash
# 설치된 패키지 확인
pnpm list --depth=0

# Python 패키지 확인
pip3 list | grep -E "fastapi|anthropic"
```

### 3단계: 환경 변수 설정 (1분)

```bash
# .env 파일 생성
cp .env.example .env

# Anthropic API 키 발급
# https://console.anthropic.com 접속
# → API Keys → Create Key
# → 복사

# .env 파일 편집
nano .env  # 또는 code .env
```

**.env 파일 최소 설정**:
```bash
# Anthropic (필수)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Database (Docker 사용 시 그대로 사용 가능)
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_content_db

# NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3001
```

**API 키 저장 후**:
```bash
# 환경 변수 확인
cat .env | grep ANTHROPIC_API_KEY
```

### 4단계: 데이터베이스 실행 (1분)

#### 옵션 A: Docker 사용 (추천)

```bash
# PostgreSQL 컨테이너 실행
docker run -d \
  --name ai-content-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_content_db \
  -p 5432:5432 \
  postgres:15-alpine

# 실행 확인
docker ps | grep postgres
```

#### 옵션 B: 직접 설치한 PostgreSQL 사용

```bash
# PostgreSQL 서비스 시작
sudo systemctl start postgresql  # Linux
brew services start postgresql@15  # macOS

# 데이터베이스 생성
createdb ai_content_db
```

### 5단계: 데이터베이스 초기화 (30초)

```bash
# Prisma 클라이언트 생성 및 스키마 푸시
cd packages/database
pnpm db:generate
pnpm db:push

# 샘플 데이터 생성 (선택사항)
pnpm db:seed

cd ../..
```

**데이터베이스 확인**:
```bash
# psql로 접속
psql postgresql://postgres:password@localhost:5432/ai_content_db

# 테이블 확인
\dt

# 종료
\q
```

### 6단계: 개발 서버 실행 (30초)

#### 옵션 A: Turborepo로 모든 앱 동시 실행 (추천)

```bash
# 루트 디렉토리에서
pnpm dev
```

이 명령어는 다음을 모두 실행합니다:
- 🎨 AI Contents Studio (3001)
- 🎬 AI Video Generator (3002)
- ✍️ AI Copywriter (3003)
- 📰 AI Content Curator (3004)
- 🌍 AI Localization Hub (3005)

#### 옵션 B: 개별 실행

**터미널 1 - API Gateway (백엔드)**:
```bash
cd services/api-gateway
python3 main.py
# → http://localhost:8000
```

**터미널 2 - Contents Studio (프론트엔드)**:
```bash
cd apps/contents-studio
pnpm dev
# → http://localhost:3001
```

**나머지 앱들도 동일하게...**

### 7단계: 접속 확인 ✅

브라우저에서 다음 URL 접속:

#### 프론트엔드 앱들
- 🎨 **AI Contents Studio**: http://localhost:3001
- 🎬 **AI Video Generator**: http://localhost:3002
- ✍️ **AI Copywriter**: http://localhost:3003
- 📰 **AI Content Curator**: http://localhost:3004
- 🌍 **AI Localization Hub**: http://localhost:3005

#### 백엔드 API
- 📡 **API Gateway (Swagger)**: http://localhost:8000/docs
- 🔍 **Health Check**: http://localhost:8000/health

**성공 화면**:
- 각 앱의 랜딩 페이지가 표시되어야 함
- API Gateway는 Swagger UI가 표시됨

---

## 첫 번째 테스트

### 1. 회원가입 테스트

```bash
# Contents Studio 접속
open http://localhost:3001

# 또는
# 브라우저에서 http://localhost:3001 접속
```

1. **"Sign Up" 버튼 클릭**
2. **정보 입력**:
   ```
   이름: 홍길동
   이메일: test@example.com
   비밀번호: test1234
   회사명: (선택사항)
   ```
3. **"Create Account" 클릭**
4. **온보딩 페이지로 자동 이동**

### 2. 온보딩 완료

1. **업종 선택**: 예) E-commerce
2. **타겟 오디언스**: 예) 20-30대 여성
3. **콘텐츠 목표**: 예) 브랜드 인지도 향상
4. **플랫폼 선택**: Instagram, Facebook, Blog 체크
5. **"Get Started" 클릭**

### 3. 첫 번째 콘텐츠 생성

#### AI Contents Studio에서 생성

1. **대시보드에서 "+ New Content" 클릭**
2. **콘텐츠 타입 선택**: Social Post
3. **정보 입력**:
   ```
   주제: AI 기반 마케팅 자동화의 장점
   플랫폼: Instagram
   톤앤매너: Professional
   길이: Short
   키워드: AI, 마케팅, 자동화, 효율성
   ```
4. **"Generate Content" 클릭**
5. **결과 확인** (약 3-5초 소요)

**예상 결과**:
```
📱 Instagram Post

🤖 AI 마케팅 자동화가 비즈니스를 바꿉니다

✨ 24/7 자동 콘텐츠 생성
⚡ 80% 시간 절약
🎯 정확한 타겟팅
📈 전환율 3배 증가

지금 바로 시작하세요!

#AI #마케팅자동화 #효율성 #디지털마케팅
```

#### API로 직접 호출 (선택사항)

```bash
# curl로 API 테스트
curl -X POST http://localhost:8000/api/v1/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "social_post",
    "topic": "AI 기반 마케팅",
    "platform": "instagram",
    "tone": "professional",
    "length": "short",
    "keywords": ["AI", "마케팅"]
  }'
```

### 4. 다른 플랫폼 테스트

#### AI Video Generator (3002)

```bash
open http://localhost:3002/create
```

1. **비디오 주제 입력**: "AI 도구 소개"
2. **타겟 플랫폼**: YouTube Shorts
3. **비디오 길이**: 60초
4. **"Generate Video Script" 클릭**

**결과**: 장면별 스크립트 + 영상 구성안

#### AI Copywriter (3003)

```bash
open http://localhost:3003/create
```

1. **카피 타입**: Email Campaign
2. **제품/서비스**: AI 콘텐츠 생성 도구
3. **프레임워크**: AIDA (Attention, Interest, Desire, Action)
4. **"Generate Copy" 클릭**

**결과**: 이메일 제목 + 본문 + CTA

#### AI Content Curator (3004)

```bash
open http://localhost:3004/curate
```

1. **URL 입력**: https://example.com/article
2. **큐레이션 타입**: Summary
3. **"Analyze Content" 클릭**

**결과**: 주요 내용 요약 + 인사이트

#### AI Localization Hub (3005)

```bash
open http://localhost:3005/translate
```

1. **원문 입력**: "AI Contents Platform은 최고의 도구입니다"
2. **원본 언어**: 한국어
3. **번역 언어**: 영어
4. **"Translate" 클릭**

**결과**: "AI Contents Platform is the best tool"

---

## 다음 단계

### Phase 1: 기본 기능 숙지 (1-2일)

- [ ] 각 플랫폼에서 콘텐츠 생성해보기
- [ ] 다양한 톤앤매너 테스트
- [ ] 브랜드 보이스 학습 기능 사용
- [ ] API 문서 읽어보기 (http://localhost:8000/docs)

### Phase 2: 인증 및 결제 테스트 (1일)

- [ ] 회원가입/로그인 플로우 테스트
- [ ] 대시보드에서 사용량 확인
- [ ] 요금제 페이지 (/pricing) 확인
- [ ] Stripe 테스트 모드로 결제 테스트

### Phase 3: 커스터마이징 (2-3일)

- [ ] 브랜드 컬러 변경
- [ ] 프롬프트 템플릿 수정
- [ ] 새로운 콘텐츠 타입 추가
- [ ] UI 컴포넌트 커스터마이징

### Phase 4: 배포 준비 (1주일)

- [ ] 프로덕션 환경 변수 설정
- [ ] Vercel에 프론트엔드 배포
- [ ] Railway에 백엔드 배포
- [ ] 도메인 연결
- [ ] HTTPS 설정

---

## 문제 해결

### "포트가 이미 사용 중입니다"

```bash
# 포트 사용 프로세스 찾기
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# 프로세스 종료
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### "Anthropic API 키가 유효하지 않습니다"

1. https://console.anthropic.com 접속
2. API Keys 확인
3. 새 키 생성
4. `.env` 파일 업데이트
5. 서버 재시작

### "데이터베이스 연결 실패"

```bash
# PostgreSQL 실행 확인
docker ps | grep postgres  # Docker 사용 시
pg_isready  # 직접 설치 시

# 데이터베이스 재시작
docker restart ai-content-postgres  # Docker
sudo systemctl restart postgresql  # Linux
brew services restart postgresql@15  # macOS
```

### "pnpm install 실패"

```bash
# pnpm 캐시 초기화
pnpm store prune

# node_modules 삭제 후 재설치
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### "Python 패키지 설치 실패"

```bash
# pip 업그레이드
pip3 install --upgrade pip

# 가상환경 사용 (권장)
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate  # Windows

# 재설치
pip3 install -r services/api-gateway/requirements.txt
```

---

## 유용한 명령어

### 개발 중

```bash
# 모든 앱 동시 실행
pnpm dev

# 특정 앱만 실행
cd apps/contents-studio && pnpm dev

# 빌드 (프로덕션)
pnpm build

# 린트 체크
pnpm lint

# 타입 체크
pnpm type-check

# 테스트 (예정)
pnpm test
```

### 데이터베이스

```bash
cd packages/database

# Prisma Studio (GUI)
pnpm db:studio
# → http://localhost:5555

# 스키마 변경 후 마이그레이션
pnpm db:migrate

# 스키마 푸시 (개발 중)
pnpm db:push

# 데이터베이스 리셋 (주의!)
pnpm db:reset

# 시드 데이터 재생성
pnpm db:seed
```

### Docker

```bash
# 전체 스택 실행 (Docker Compose)
docker-compose -f infrastructure/docker/docker-compose.yml up

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down

# 볼륨까지 삭제
docker-compose down -v
```

### Git

```bash
# 현재 브랜치 확인
git branch

# 새 기능 브랜치 생성
git checkout -b feature/my-feature

# 변경사항 확인
git status
git diff

# 커밋
git add .
git commit -m "Add new feature"

# 푸시
git push origin feature/my-feature
```

---

## 추가 리소스

### 문서
- 📚 [완벽 가이드](./GUIDE_KR.md) - 전체 시스템 설명
- 🔐 [인증 가이드](./AUTHENTICATION_KR.md) - NextAuth 설정
- 💳 [결제 가이드](./PAYMENTS_KR.md) - Stripe 통합
- 🔧 [API 레퍼런스](./API.md) - API 명세

### 외부 리소스
- Anthropic Claude: https://console.anthropic.com
- Next.js 문서: https://nextjs.org/docs
- Prisma 문서: https://www.prisma.io/docs
- Stripe 문서: https://stripe.com/docs
- FastAPI 문서: https://fastapi.tiangolo.com

### 커뮤니티
- Discord: https://discord.gg/aicontents
- GitHub Issues: https://github.com/your-org/money-ai-content/issues
- 이메일 지원: support@aicontents.com

---

## 성공 체크리스트

완료한 항목에 체크하세요:

- [ ] ✅ 저장소 클론 완료
- [ ] ✅ 의존성 설치 완료
- [ ] ✅ 환경 변수 설정 완료
- [ ] ✅ 데이터베이스 실행 완료
- [ ] ✅ 개발 서버 실행 완료
- [ ] ✅ 5개 앱 모두 접속 확인
- [ ] ✅ 회원가입 테스트 완료
- [ ] ✅ 첫 번째 콘텐츠 생성 완료
- [ ] ✅ API 호출 테스트 완료

**모두 완료했다면, 축하합니다! 🎉**

이제 본격적으로 개발을 시작하세요.

---

**도움이 필요하신가요?**
- 📧 이메일: dev@aicontents.com
- 💬 Discord: https://discord.gg/aicontents
- 📖 전체 문서: [GUIDE_KR.md](./GUIDE_KR.md)

---

**작성자**: AI Contents Platform Team
**최종 업데이트**: 2024-11-18
**예상 소요 시간**: 5-10분
