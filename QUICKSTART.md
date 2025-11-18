# Quick Start Guide

Get started with the AI Contents Platform in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- Anthropic API key

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/money-ai-content.git
cd money-ai-content

# 2. Install pnpm
npm install -g pnpm@8.12.0

# 3. Install all dependencies
pnpm install

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

## Running the Platform

### Start All Frontend Apps

```bash
# Start all 5 Next.js apps simultaneously
pnpm dev
```

This will start:
- **AI Contents Studio**: http://localhost:3001
- **AI Video Generator**: http://localhost:3002
- **AI Copywriter**: http://localhost:3003
- **AI Content Curator**: http://localhost:3004
- **AI Localization Hub**: http://localhost:3005

### Start Backend API

```bash
# In a new terminal
cd services/api-gateway

# Create virtual environment
python -m venv venv

# Activate (Mac/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start API server
python main.py
```

API will be available at: http://localhost:8000

## Try It Out

### 1. AI Contents Studio
1. Go to http://localhost:3001/dashboard
2. Click "+ New Content"
3. Fill in the form:
   - Topic: "Benefits of AI in content marketing"
   - Platform: Instagram
   - Tone: Professional
4. Click "Generate Content"

### 2. AI Video Generator
1. Go to http://localhost:3002/create
2. Enter a script:
   ```
   Welcome to our channel! Today I'll show you 5 amazing tips to boost your productivity.
   First, start your day with a clear plan. Second, use time-blocking techniques...
   ```
3. Select format: YouTube
4. Click "Generate Video"

### 3. AI Copywriter
1. Go to http://localhost:3003/create
2. Fill in product details:
   - Product Name: "AI Content Generator"
   - Category: "Software"
   - Features: "Fast, Easy, Powerful"
   - USP: "Generate content 10x faster"
3. Click "Generate Copy"

### 4. AI Content Curator
1. Go to http://localhost:3004/curate
2. Enter a URL: "https://techcrunch.com/some-article"
3. Click "Summarize Content"

### 5. AI Localization Hub
1. Go to http://localhost:3005/translate
2. Enter text to translate
3. Select source language: English
4. Select target language: Spanish
5. Click "Translate"

## Database Setup (Optional)

For persistent data storage:

```bash
cd packages/database

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed with sample data
pnpm db:seed
```

**Note:** You'll need PostgreSQL running. Update `DATABASE_URL` in `.env`.

## Docker Deployment (Optional)

Run everything with Docker:

```bash
cd infrastructure/docker
docker-compose up -d
```

## Troubleshooting

### Port Already in Use

If ports 3001-3005 or 8000 are already in use:
- Kill existing processes: `lsof -ti:3001 | xargs kill`
- Or change ports in `package.json` (for Next.js) or `main.py` (for FastAPI)

### API Connection Error

- Ensure FastAPI server is running on port 8000
- Check `http://localhost:8000/health` returns `{"status": "healthy"}`
- Verify CORS settings allow localhost origins

### Missing ANTHROPIC_API_KEY

- Get API key from https://console.anthropic.com/
- Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-your-key-here`
- Restart backend server

## Next Steps

- 📖 Read [Full Documentation](./docs/SETUP.md)
- 🔧 Explore [API Reference](./docs/API.md)
- 🎯 Check [Feature List](./docs/FEATURES.md)
- 💡 Review [Architecture](./README.md#architecture)

## Support

- GitHub Issues: [Report bugs](https://github.com/your-org/money-ai-content/issues)
- Documentation: `./docs/`
- Email: support@example.com

---

**Happy Creating! 🚀**
