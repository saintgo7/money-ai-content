# Setup Guide

Complete setup guide for the AI Contents Platform.

## Prerequisites

- Node.js 18+ and pnpm 8+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker (optional, for containerized deployment)

## Quick Start

### 1. Install Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm@8.12.0

# Install all dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
# Required: ANTHROPIC_API_KEY
```

### 3. Database Setup

```bash
# Generate Prisma client
cd packages/database
pnpm db:generate

# Run migrations
pnpm db:push

# Seed database with sample data
pnpm db:seed
```

### 4. Start Development Servers

```bash
# Start all applications
pnpm dev

# Or start individual apps:
# Contents Studio: http://localhost:3001
# Video Generator: http://localhost:3002
# Copywriter: http://localhost:3003
# Content Curator: http://localhost:3004
# Localization Hub: http://localhost:3005
```

### 5. Start API Gateway (Python)

```bash
# In a new terminal
cd services/api-gateway

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start API server
python main.py
# API will run on http://localhost:8000
```

## Docker Deployment

### Using Docker Compose

```bash
cd infrastructure/docker

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Docker Builds

```bash
# Build API Gateway
cd services/api-gateway
docker build -t ai-content-api .

# Build Next.js apps (example: Contents Studio)
cd apps/contents-studio
docker build -t ai-content-studio .
```

## Configuration

### API Keys Required

1. **Anthropic Claude API** (Required)
   - Get from: https://console.anthropic.com/
   - Set as: `ANTHROPIC_API_KEY`

2. **AWS S3** (Optional, for media storage)
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET`

3. **Stripe** (Optional, for payments)
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`

### Database Configuration

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_content_db
REDIS_URL=redis://localhost:6379
```

## Development Workflow

### Running Tests

```bash
pnpm test
```

### Building for Production

```bash
pnpm build
```

### Code Linting

```bash
pnpm lint
```

## Troubleshooting

### Port Already in Use

If ports 3001-3005 or 8000 are in use, you can change them in:
- Next.js apps: `package.json` scripts
- API Gateway: `main.py` (uvicorn.run port parameter)

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Check DATABASE_URL in .env
3. Run migrations: `pnpm db:push`

### API Key Issues

- Verify ANTHROPIC_API_KEY is set correctly
- Check API key has sufficient credits
- Ensure no leading/trailing spaces in .env

## Production Deployment

### Environment Variables

Set production environment variables:
- `NODE_ENV=production`
- Update DATABASE_URL to production database
- Configure CDN for static assets
- Set secure NEXTAUTH_SECRET

### Database Migrations

```bash
cd packages/database
pnpm db:migrate
```

### Scaling Considerations

- Use load balancer for API Gateway
- Set up Redis cluster for caching
- Configure CDN for media assets
- Implement queue workers for background jobs

## Support

For issues and questions:
- GitHub Issues: [Repository URL]
- Documentation: `/docs`
- Email: support@example.com
