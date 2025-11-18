# API Documentation

Complete API reference for the AI Contents Platform.

## Base URL

```
Development: http://localhost:8000
Production: https://api.yourapp.com
```

## Authentication

Most endpoints require authentication via API key or JWT token.

```bash
# API Key (header)
Authorization: Bearer YOUR_API_KEY

# JWT Token
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Content Generation

### Generate Content

Generate AI content based on parameters.

**Endpoint:** `POST /api/v1/content/generate`

**Request Body:**
```json
{
  "type": "SOCIAL_POST",
  "topic": "AI content generation benefits",
  "platform": "instagram",
  "tone": "professional",
  "length": "medium",
  "keywords": ["AI", "automation", "productivity"]
}
```

**Response:**
```json
{
  "content": "Generated content here...",
  "metadata": {
    "model": "claude-sonnet-4-20250514",
    "tokens": 450,
    "type": "SOCIAL_POST",
    "platform": "instagram"
  }
}
```

### Optimize for Platform

Optimize existing content for a specific platform.

**Endpoint:** `POST /api/v1/content/optimize-platform`

**Request Body:**
```json
{
  "content": "Your content here...",
  "platform": "twitter"
}
```

---

## Brand Voice

### Learn Brand Voice

Train AI on your brand voice from content samples.

**Endpoint:** `POST /api/v1/brand/learn`

**Request Body:**
```json
{
  "name": "My Brand",
  "sampleContents": [
    "Sample content 1...",
    "Sample content 2...",
    "Sample content 3..."
  ],
  "guidelines": "Professional yet friendly tone",
  "toneKeywords": ["innovative", "trustworthy", "approachable"]
}
```

**Response:**
```json
{
  "name": "My Brand",
  "writingStyle": {
    "sentenceLength": "medium",
    "complexity": 6,
    "vocabularyLevel": "moderate"
  },
  "toneAttributes": {
    "formal": 5,
    "playful": 6,
    "empathetic": 7
  },
  "vocabularyPatterns": {
    "preferredTerms": ["innovative", "cutting-edge"],
    "avoidedTerms": ["cheap", "basic"],
    "brandTerms": ["AI-powered", "next-gen"]
  }
}
```

---

## Translation

### Translate Content

Translate content with cultural adaptation.

**Endpoint:** `POST /api/v1/translate`

**Request Body:**
```json
{
  "text": "Hello, welcome to our platform!",
  "sourceLang": "en",
  "targetLang": "es",
  "contentType": "marketing"
}
```

**Response:**
```json
{
  "translation": "¡Hola, bienvenido a nuestra plataforma!",
  "sourceLang": "en",
  "targetLang": "es"
}
```

---

## Copywriting

### Generate Marketing Copy

Generate high-converting marketing copy.

**Endpoint:** `POST /api/v1/copy/generate`

**Request Body:**
```json
{
  "copyType": "ad_copy",
  "productInfo": {
    "name": "AI Content Generator",
    "category": "Software",
    "features": ["Fast generation", "Multi-platform", "Brand voice"],
    "usp": "Generate content 10x faster with AI"
  },
  "targetAudience": {
    "ageRange": "25-45",
    "interests": ["marketing", "automation"],
    "painPoints": ["time-consuming content creation"],
    "desiredOutcome": "More content in less time"
  },
  "tone": "professional",
  "variations": 3
}
```

**Response:**
```json
{
  "variations": [
    {
      "headline": "Create Content 10x Faster with AI",
      "body": "Stop wasting hours on content creation...",
      "cta": "Start Your Free Trial",
      "angle": "Time-saving benefit"
    },
    {
      "headline": "Never Run Out of Content Ideas Again",
      "body": "AI-powered content generation...",
      "cta": "See How It Works",
      "angle": "Problem-solution"
    }
  ]
}
```

---

## Video Generation

### Generate Video

Create video from script.

**Endpoint:** `POST /api/v1/video/generate`

**Request Body:**
```json
{
  "script": "Welcome to our platform. Today I'll show you how to create amazing content with AI...",
  "style": "professional",
  "format": "youtube",
  "voice": "alloy",
  "musicStyle": "upbeat"
}
```

**Response:**
```json
{
  "scenes": [
    {
      "text": "Welcome to our platform",
      "duration": 3,
      "visual_description": "Modern office setting with laptop",
      "visual_type": "image",
      "camera_movement": "zoom_in",
      "transition": "fade"
    }
  ],
  "format": "youtube",
  "status": "scenes_generated"
}
```

---

## Content Curation

### Collect Content

Collect and analyze content on specific topics.

**Endpoint:** `POST /api/v1/curate/collect`

**Request Body:**
```json
{
  "topics": ["AI", "content marketing", "automation"],
  "limit": 50
}
```

### Summarize Content

Get AI summary of curated content.

**Endpoint:** `POST /api/v1/curate/summarize`

**Request Body:**
```json
{
  "title": "Article Title",
  "url": "https://example.com/article",
  "content": "Full article content..."
}
```

**Response:**
```json
{
  "one_liner": "AI transforms content creation landscape",
  "key_points": [
    "AI adoption growing 300% year-over-year",
    "Content teams saving 10+ hours per week",
    "Quality remains high with human oversight"
  ],
  "summary": "Recent developments in AI content generation...",
  "takeaway": "AI is becoming essential for modern content teams",
  "tags": ["AI", "content", "automation", "productivity", "marketing"]
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input parameters",
  "details": {}
}
```

### 401 Unauthorized
```json
{
  "error": "AUTH_UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

### 429 Rate Limit Exceeded
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limits

Rate limits vary by subscription tier:

| Tier | Requests/Minute | Requests/Day |
|------|----------------|--------------|
| Free | 10 | 100 |
| Starter | 30 | 1,000 |
| Pro | 100 | 10,000 |
| Business | 500 | 50,000 |
| Enterprise | Unlimited | Unlimited |

---

## Webhooks

Configure webhooks to receive real-time notifications.

### Events

- `content.generated` - Content generation completed
- `video.completed` - Video generation finished
- `translation.completed` - Translation finished
- `job.failed` - Background job failed

### Webhook Payload

```json
{
  "event": "content.generated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "contentId": "content_123",
    "type": "SOCIAL_POST",
    "status": "completed"
  }
}
```

---

## SDKs

Official SDKs available:

- **JavaScript/TypeScript**: `npm install @ai-content/sdk`
- **Python**: `pip install ai-content-sdk`
- **Ruby**: `gem install ai_content`

Example usage:

```typescript
import { AIContentClient } from '@ai-content/sdk';

const client = new AIContentClient({ apiKey: 'YOUR_API_KEY' });

const content = await client.content.generate({
  type: 'SOCIAL_POST',
  topic: 'AI benefits',
  platform: 'instagram',
});
```
