import { ClaudeClient } from './claude-client';
import type { BrandProfile } from './types';

export interface ContentGenerationParams {
  contentType: string;
  topic: string;
  platform?: string;
  targetAudience?: {
    ageRange?: string;
    interests?: string[];
    painPoints?: string[];
  };
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
  brandProfile?: BrandProfile;
}

export interface PlatformOptimizationParams {
  platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok' | 'youtube' | 'blog';
  content: string;
  brandProfile?: BrandProfile;
}

export class ContentGenerator {
  private client: ClaudeClient;

  constructor(client: ClaudeClient) {
    this.client = client;
  }

  /**
   * Generate content with comprehensive parameters
   */
  async generate(params: ContentGenerationParams): Promise<{
    content: string;
    metadata: {
      wordCount: number;
      estimatedReadTime: number;
      seoScore?: number;
    };
  }> {
    const lengthGuide = {
      short: '100-200 words',
      medium: '300-500 words',
      long: '800-1200 words',
    };

    let prompt = `Generate ${params.contentType} content about: ${params.topic}\n\n`;

    if (params.platform) {
      prompt += `Platform: ${params.platform}\n`;
    }

    if (params.targetAudience) {
      prompt += `Target Audience:\n`;
      if (params.targetAudience.ageRange) {
        prompt += `- Age: ${params.targetAudience.ageRange}\n`;
      }
      if (params.targetAudience.interests?.length) {
        prompt += `- Interests: ${params.targetAudience.interests.join(', ')}\n`;
      }
      if (params.targetAudience.painPoints?.length) {
        prompt += `- Pain Points: ${params.targetAudience.painPoints.join(', ')}\n`;
      }
    }

    if (params.tone) {
      prompt += `Tone: ${params.tone}\n`;
    }

    if (params.length) {
      prompt += `Length: ${lengthGuide[params.length]}\n`;
    }

    if (params.keywords?.length) {
      prompt += `SEO Keywords (naturally incorporate): ${params.keywords.join(', ')}\n`;
    }

    if (params.brandProfile) {
      prompt += `\nBrand Voice Profile:\n${JSON.stringify(params.brandProfile, null, 2)}\n`;
    }

    prompt += `\nCreate engaging, high-quality content that resonates with the target audience.`;

    const response = await this.client.generate(prompt);
    const content = response.content;

    const wordCount = content.split(/\s+/).length;
    const estimatedReadTime = Math.ceil(wordCount / 200); // 200 words per minute

    return {
      content,
      metadata: {
        wordCount,
        estimatedReadTime,
      },
    };
  }

  /**
   * Optimize content for specific platform
   */
  async optimizeForPlatform(params: PlatformOptimizationParams): Promise<string> {
    const platformSpecs: Record<string, any> = {
      instagram: {
        maxLength: 2200,
        hashtagCount: 15,
        tone: 'visual, engaging',
        cta: 'link in bio',
      },
      twitter: {
        maxLength: 280,
        hashtagCount: 3,
        tone: 'concise, punchy',
        cta: 'direct link',
      },
      linkedin: {
        maxLength: 3000,
        hashtagCount: 5,
        tone: 'professional, insightful',
        cta: 'comment/share',
      },
      facebook: {
        maxLength: 500,
        hashtagCount: 3,
        tone: 'friendly, conversational',
        cta: 'engagement',
      },
      tiktok: {
        maxLength: 150,
        hashtagCount: 5,
        tone: 'trendy, fun',
        cta: 'follow for more',
      },
      youtube: {
        maxLength: 5000,
        hashtagCount: 3,
        tone: 'detailed, educational',
        cta: 'subscribe',
      },
      blog: {
        maxLength: 2000,
        hashtagCount: 0,
        tone: 'informative, SEO-friendly',
        cta: 'newsletter signup',
      },
    };

    const spec = platformSpecs[params.platform];

    const prompt = `Optimize this content for ${params.platform}:

Original Content:
${params.content}

Platform Requirements:
- Max Length: ${spec.maxLength} characters
- Hashtags: ${spec.hashtagCount}
- Tone: ${spec.tone}
- CTA Style: ${spec.cta}

${params.brandProfile ? `Brand Voice:\n${JSON.stringify(params.brandProfile, null, 2)}\n` : ''}

Create platform-optimized content that:
1. Fits the platform's algorithm and user behavior
2. Maintains the core message
3. Includes appropriate hashtags
4. Has a strong CTA
5. Uses platform-appropriate formatting and style`;

    const response = await this.client.generate(prompt);
    return response.content;
  }

  /**
   * Generate content variations for A/B testing
   */
  async generateVariations(
    content: string,
    variationType: 'headline' | 'cta' | 'opening' | 'full',
    count: number = 3
  ): Promise<string[]> {
    const prompt = `Create ${count} variations of this content, focusing on different ${variationType}s:

Original Content:
${content}

Requirements:
- Each variation should test a different approach
- Maintain the core message
- Variations should be meaningfully different
- All should be high quality

Return as JSON array: ["variation 1", "variation 2", ...]`;

    return this.client.generateJSON<string[]>(prompt);
  }

  /**
   * Generate content calendar
   */
  async generateContentCalendar(params: {
    month: number;
    year: number;
    contentPillars: string[];
    platforms: string[];
    postingFrequency: Record<string, number>;
  }): Promise<Array<{
    date: string;
    time: string;
    platform: string;
    pillar: string;
    topic: string;
    contentType: string;
    brief: string;
  }>> {
    const prompt = `Create a content calendar for ${params.month}/${params.year}:

Content Pillars (themes):
${params.contentPillars.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Platforms: ${params.platforms.join(', ')}

Posting Frequency (per week):
${Object.entries(params.postingFrequency).map(([p, f]) => `- ${p}: ${f} posts`).join('\n')}

Requirements:
1. Balance content pillars evenly
2. Consider optimal posting times for each platform
3. Include seasonal events/holidays
4. Create content series where appropriate
5. Ensure cross-platform synergy

For each content piece, provide:
- date (YYYY-MM-DD)
- time (HH:MM)
- platform
- pillar (content theme)
- topic
- contentType (post, video, carousel, etc.)
- brief (2-3 sentence description)

Return as JSON array.`;

    return this.client.generateJSON(prompt);
  }

  /**
   * Enhance existing content
   */
  async enhance(
    content: string,
    enhancements: Array<'seo' | 'engagement' | 'clarity' | 'persuasion'>
  ): Promise<string> {
    const enhancementDescriptions = {
      seo: 'Optimize for search engines (keywords, structure, meta-friendly)',
      engagement: 'Increase engagement (hooks, questions, calls-to-action)',
      clarity: 'Improve clarity and readability',
      persuasion: 'Enhance persuasiveness and conversion potential',
    };

    const prompt = `Enhance this content with the following improvements:

${enhancements.map(e => `- ${enhancementDescriptions[e]}`).join('\n')}

Original Content:
${content}

Maintain the core message while applying these enhancements. Return only the enhanced content.`;

    const response = await this.client.generate(prompt);
    return response.content;
  }
}
