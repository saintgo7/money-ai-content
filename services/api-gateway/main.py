from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from anthropic import Anthropic

app = FastAPI(
    title="AI Content Platform API",
    description="API Gateway for AI Content Generation Platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Anthropic client
anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# ============================================
# Models
# ============================================

class GenerateContentRequest(BaseModel):
    type: str
    topic: str
    platform: Optional[str] = None
    brandProfileId: Optional[str] = None
    tone: Optional[str] = None
    length: Optional[str] = "medium"
    keywords: Optional[List[str]] = []

class GenerateContentResponse(BaseModel):
    content: str
    metadata: dict

class TranslateRequest(BaseModel):
    text: str
    sourceLang: str
    targetLang: str
    contentType: Optional[str] = None

class GenerateCopyRequest(BaseModel):
    copyType: str
    productInfo: dict
    targetAudience: dict
    tone: str
    framework: Optional[str] = None
    variations: int = 3

class GenerateVideoRequest(BaseModel):
    script: str
    style: str = "professional"
    format: str = "youtube"
    voice: str = "alloy"
    musicStyle: Optional[str] = None

# ============================================
# Health Check
# ============================================

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "api-gateway"}

# ============================================
# Content Generation Endpoints
# ============================================

@app.post("/api/v1/content/generate", response_model=GenerateContentResponse)
async def generate_content(request: GenerateContentRequest):
    """Generate content using AI"""
    try:
        length_guide = {
            "short": "100-200 words",
            "medium": "300-500 words",
            "long": "800-1200 words",
        }

        prompt = f"""Generate {request.type} content about: {request.topic}

Platform: {request.platform or 'general'}
Tone: {request.tone or 'professional'}
Length: {length_guide.get(request.length, '300-500 words')}
Keywords: {', '.join(request.keywords) if request.keywords else 'None'}

Create engaging, high-quality content that resonates with the target audience."""

        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )

        content = response.content[0].text

        return GenerateContentResponse(
            content=content,
            metadata={
                "model": response.model,
                "tokens": response.usage.input_tokens + response.usage.output_tokens,
                "type": request.type,
                "platform": request.platform,
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/content/optimize-platform")
async def optimize_for_platform(content: str, platform: str):
    """Optimize content for specific platform"""
    try:
        platform_specs = {
            "instagram": {"maxLength": 2200, "hashtags": 15},
            "twitter": {"maxLength": 280, "hashtags": 3},
            "linkedin": {"maxLength": 3000, "hashtags": 5},
        }

        spec = platform_specs.get(platform, {"maxLength": 1000, "hashtags": 5})

        prompt = f"""Optimize this content for {platform}:

{content}

Requirements:
- Max length: {spec['maxLength']} characters
- Include {spec['hashtags']} relevant hashtags
- Platform-appropriate tone and format

Return only the optimized content."""

        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )

        return {"optimized_content": response.content[0].text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Brand Voice Endpoints
# ============================================

@app.post("/api/v1/brand/learn")
async def learn_brand_voice(
    name: str,
    sampleContents: List[str],
    guidelines: Optional[str] = None,
    toneKeywords: Optional[List[str]] = []
):
    """Learn brand voice from samples"""
    try:
        prompt = f"""Analyze these brand content samples to create a brand voice profile:

Brand: {name}

Samples:
{chr(10).join([f'{i+1}. {s[:300]}...' for i, s in enumerate(sampleContents)])}

Guidelines: {guidelines or 'None provided'}
Tone Keywords: {', '.join(toneKeywords) if toneKeywords else 'None'}

Create a JSON brand voice profile with:
{{
  "writingStyle": {{"sentenceLength": "short/medium/long", "complexity": 0-10, "vocabularyLevel": "simple/moderate/advanced"}},
  "toneAttributes": {{"formal": 0-10, "playful": 0-10, "empathetic": 0-10}},
  "vocabularyPatterns": {{"preferredTerms": [], "avoidedTerms": [], "brandTerms": []}},
  "ctaStyle": "description",
  "emojiUsage": {{"frequency": "never/rare/moderate/frequent", "types": []}}
}}"""

        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )

        # Parse JSON from response
        import json
        content = response.content[0].text
        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content.replace("```json\n", "").replace("\n```", "")
        elif content.startswith("```"):
            content = content.replace("```\n", "").replace("\n```", "")

        brand_profile = json.loads(content)
        brand_profile["name"] = name

        return brand_profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Translation Endpoints
# ============================================

@app.post("/api/v1/translate")
async def translate(request: TranslateRequest):
    """Translate content with context awareness"""
    try:
        prompt = f"""Translate the following text from {request.sourceLang} to {request.targetLang}:

{request.text}

Content Type: {request.contentType or 'general'}

Requirements:
- Natural, idiomatic translation (not literal)
- Preserve tone and intent
- Adapt cultural references if needed
- Maintain formatting

Provide only the translation."""

        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )

        return {
            "translation": response.content[0].text,
            "sourceLang": request.sourceLang,
            "targetLang": request.targetLang,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Copywriting Endpoints
# ============================================

@app.post("/api/v1/copy/generate")
async def generate_copy(request: GenerateCopyRequest):
    """Generate marketing copy"""
    try:
        prompt = f"""Generate {request.variations} variations of {request.copyType} copy:

Product Information:
{request.productInfo}

Target Audience:
{request.targetAudience}

Tone: {request.tone}
Framework: {request.framework or 'PAS (Problem-Agitate-Solve)'}

For each variation provide:
- headline
- subheadline (if applicable)
- body
- cta
- angle (approach used)

Return as JSON array."""

        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )

        import json
        content = response.content[0].text
        if content.startswith("```json"):
            content = content.replace("```json\n", "").replace("\n```", "")
        elif content.startswith("```"):
            content = content.replace("```\n", "").replace("\n```", "")

        variations = json.loads(content)

        return {"variations": variations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Video Generation Endpoints
# ============================================

@app.post("/api/v1/video/generate")
async def generate_video(request: GenerateVideoRequest):
    """Generate video from script"""
    try:
        # Step 1: Analyze script and create scenes
        prompt = f"""Analyze this video script and break it into scenes:

{request.script}

Format: {request.format}
Style: {request.style}

For each scene provide:
- text (narration)
- duration (seconds)
- visual_description (what to show)
- visual_type (image/video/text)
- camera_movement (zoom_in/pan/static)
- transition (to next scene)

Return as JSON array."""

        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            messages=[{"role": "user", "content": prompt}]
        )

        import json
        content = response.content[0].text
        if content.startswith("```json"):
            content = content.replace("```json\n", "").replace("\n```", "")
        elif content.startswith("```"):
            content = content.replace("```\n", "").replace("\n```", "")

        scenes = json.loads(content)

        return {
            "scenes": scenes,
            "format": request.format,
            "status": "scenes_generated",
            "message": "Video scenes created. Processing will continue in background."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Content Curation Endpoints
# ============================================

@app.post("/api/v1/curate/collect")
async def collect_content(topics: List[str], limit: int = 50):
    """Collect and curate content on topics"""
    try:
        # This would integrate with RSS feeds, APIs, etc.
        # For now, return mock response
        return {
            "message": "Content collection initiated",
            "topics": topics,
            "limit": limit,
            "status": "processing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/curate/summarize")
async def summarize_content(title: str, url: str, content: str):
    """Summarize curated content"""
    try:
        prompt = f"""Summarize this content:

Title: {title}
URL: {url}

Content:
{content[:2000]}

Provide:
- one_liner: One sentence summary (50 chars max)
- key_points: 3-5 bullet points
- summary: 2-3 sentence summary
- takeaway: Main insight
- tags: 5 relevant tags

Return as JSON."""

        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )

        import json
        content_result = response.content[0].text
        if content_result.startswith("```json"):
            content_result = content_result.replace("```json\n", "").replace("\n```", "")

        summary = json.loads(content_result)

        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
