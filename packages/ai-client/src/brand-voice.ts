import { ClaudeClient } from './claude-client';
import type { BrandProfile } from './types';

export class BrandVoiceEngine {
  private client: ClaudeClient;

  constructor(client: ClaudeClient) {
    this.client = client;
  }

  /**
   * Learn brand voice from sample content
   */
  async learnBrandVoice(
    sampleContents: string[],
    brandGuidelines: string,
    toneKeywords: string[]
  ): Promise<BrandProfile> {
    const prompt = `Analyze the following brand content samples to create a comprehensive brand voice profile.

Sample Contents:
${sampleContents.map((content, i) => `${i + 1}. ${content.substring(0, 500)}...`).join('\n\n')}

Brand Guidelines:
${brandGuidelines}

Tone Keywords: ${toneKeywords.join(', ')}

Create a detailed brand voice profile with the following structure:
{
  "name": "Brand Name",
  "writingStyle": {
    "sentenceLength": "short|medium|long",
    "complexity": 0-10,
    "vocabularyLevel": "simple|moderate|advanced"
  },
  "toneAttributes": {
    "formal": 0-10,
    "serious": 0-10,
    "playful": 0-10,
    "empathetic": 0-10,
    "authoritative": 0-10
  },
  "vocabularyPatterns": {
    "preferredTerms": ["commonly used words/phrases"],
    "avoidedTerms": ["terms to avoid"],
    "brandTerms": ["brand-specific terminology"]
  },
  "ctaStyle": "description of CTA style",
  "hashtagStyle": "description of hashtag usage",
  "emojiUsage": {
    "frequency": "never|rare|moderate|frequent",
    "types": ["types of emojis used"]
  }
}`;

    const profile = await this.client.generateJSON<Omit<BrandProfile, 'id'>>(prompt);

    return {
      id: this.generateId(),
      ...profile,
    };
  }

  /**
   * Generate content with brand voice
   */
  async generateWithBrandVoice(
    brandProfile: BrandProfile,
    contentType: string,
    topic: string,
    additionalContext?: string
  ): Promise<string> {
    const prompt = `Generate ${contentType} content following this exact brand voice profile:

Brand Profile:
${JSON.stringify(brandProfile, null, 2)}

Topic: ${topic}

${additionalContext ? `Additional Context:\n${additionalContext}\n` : ''}

Requirements:
1. Match the writing style (sentence length, complexity, vocabulary level)
2. Reflect the tone attributes accurately
3. Use preferred terms and avoid blacklisted terms
4. Follow brand-specific terminology
5. Apply the CTA style
6. Use hashtags according to the brand's style
7. Include emojis as specified in the profile

Generate natural, engaging content that perfectly embodies this brand voice.`;

    const response = await this.client.generate(prompt);
    return response.content;
  }

  /**
   * Check content consistency with brand voice
   */
  async checkConsistency(
    content: string,
    brandProfile: BrandProfile
  ): Promise<{
    toneMatch: number;
    vocabularyCompliance: number;
    styleConsistency: number;
    issues: string[];
    suggestions: string[];
  }> {
    const prompt = `Analyze how well this content matches the brand voice profile:

Content:
${content}

Brand Profile:
${JSON.stringify(brandProfile, null, 2)}

Evaluate:
1. Tone Match (0-100): How well does the tone match the brand's tone attributes?
2. Vocabulary Compliance (0-100): Does it use preferred terms and avoid blacklisted terms?
3. Style Consistency (0-100): Does it match writing style (sentence length, complexity)?

Provide:
{
  "toneMatch": 0-100,
  "vocabularyCompliance": 0-100,
  "styleConsistency": 0-100,
  "issues": ["list of specific issues found"],
  "suggestions": ["specific improvement suggestions"]
}`;

    return this.client.generateJSON(prompt);
  }

  /**
   * Generate multiple brand voice variations
   */
  async generateVariations(
    brandProfile: BrandProfile,
    content: string,
    count: number = 3
  ): Promise<string[]> {
    const prompt = `Create ${count} variations of this content, all following the brand voice profile:

Original Content:
${content}

Brand Profile:
${JSON.stringify(brandProfile, null, 2)}

Requirements:
- Each variation must maintain the brand voice
- Variations should differ in approach/angle but keep the same message
- All must follow the brand's style guidelines

Return as JSON array:
["variation 1", "variation 2", "variation 3"]`;

    return this.client.generateJSON<string[]>(prompt);
  }

  private generateId(): string {
    return `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
