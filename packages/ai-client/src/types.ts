export interface AIClientConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerationOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  stream?: boolean;
}

export interface BrandProfile {
  id: string;
  name: string;
  writingStyle: {
    sentenceLength: 'short' | 'medium' | 'long';
    complexity: number; // 0-10
    vocabularyLevel: 'simple' | 'moderate' | 'advanced';
  };
  toneAttributes: {
    formal: number; // 0-10
    serious: number;
    playful: number;
    empathetic: number;
    authoritative: number;
  };
  vocabularyPatterns: {
    preferredTerms: string[];
    avoidedTerms: string[];
    brandTerms: string[];
  };
  ctaStyle: string;
  hashtagStyle: string;
  emojiUsage: {
    frequency: 'never' | 'rare' | 'moderate' | 'frequent';
    types: string[];
  };
}

export interface ContentGenerationRequest {
  type: 'text' | 'image' | 'audio' | 'video';
  prompt: string;
  context?: Record<string, any>;
  brandProfile?: BrandProfile;
  platform?: string;
  options?: GenerationOptions;
}

export interface ContentGenerationResponse {
  content: string;
  metadata: {
    model: string;
    tokensUsed: number;
    generationTime: number;
  };
  alternatives?: string[];
  qualityScore?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
