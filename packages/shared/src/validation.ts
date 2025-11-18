import { z } from 'zod';

// ============================================
// Common Validation Schemas
// ============================================

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const urlSchema = z.string().url('Invalid URL');

// ============================================
// Content Validation
// ============================================

export const contentTypeSchema = z.enum([
  'TEXT',
  'IMAGE',
  'AUDIO',
  'VIDEO',
  'SOCIAL_POST',
  'BLOG_POST',
  'EMAIL',
  'AD_COPY',
  'PRODUCT_DESCRIPTION',
  'NEWSLETTER',
  'TRANSLATION',
]);

export const platformSchema = z.enum([
  'INSTAGRAM',
  'TWITTER',
  'LINKEDIN',
  'FACEBOOK',
  'TIKTOK',
  'YOUTUBE',
  'BLOG',
  'EMAIL',
  'WEBSITE',
]);

export const contentStatusSchema = z.enum([
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
]);

// ============================================
// Content Generation Schemas
// ============================================

export const generateContentSchema = z.object({
  type: contentTypeSchema,
  topic: z.string().min(1, 'Topic is required'),
  platform: platformSchema.optional(),
  brandProfileId: z.string().optional(),
  targetAudience: z
    .object({
      ageRange: z.string().optional(),
      interests: z.array(z.string()).optional(),
      painPoints: z.array(z.string()).optional(),
    })
    .optional(),
  tone: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  keywords: z.array(z.string()).optional(),
});

export const optimizeForPlatformSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  platform: platformSchema,
  brandProfileId: z.string().optional(),
});

// ============================================
// Brand Profile Schemas
// ============================================

export const createBrandProfileSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  sampleContents: z.array(z.string()).min(1, 'At least one sample content is required'),
  guidelines: z.string().optional(),
  toneKeywords: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  fonts: z.array(z.string()).optional(),
  logoUrl: z.string().url().optional(),
});

// ============================================
// Translation Schemas
// ============================================

export const translateSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  sourceLang: z.string().length(2, 'Source language must be a 2-letter code'),
  targetLang: z.string().length(2, 'Target language must be a 2-letter code'),
  contentType: z.string().optional(),
  context: z.record(z.any()).optional(),
});

// ============================================
// Curation Schemas
// ============================================

export const addCurationSourceSchema = z.object({
  type: z.enum(['RSS', 'API', 'WEBSITE']),
  url: urlSchema,
  name: z.string().min(1, 'Source name is required'),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
});

export const collectContentSchema = z.object({
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
  sources: z.array(z.string()).optional(),
  timeRange: z.string().default('24h'),
  limit: z.number().int().positive().default(100),
});

// ============================================
// Video Generation Schemas
// ============================================

export const generateVideoSchema = z.object({
  script: z.string().min(1, 'Script is required'),
  style: z.string().default('professional'),
  format: z.enum(['youtube', 'tiktok', 'reels', 'shorts']),
  voice: z.string().default('alloy'),
  musicStyle: z.string().optional(),
});

// ============================================
// Copywriting Schemas
// ============================================

export const generateCopySchema = z.object({
  copyType: z.string().min(1, 'Copy type is required'),
  productInfo: z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    features: z.array(z.string()).min(1),
    usp: z.string().min(1),
    price: z.string().optional(),
  }),
  targetAudience: z.object({
    ageRange: z.string(),
    gender: z.string().optional(),
    interests: z.array(z.string()),
    painPoints: z.array(z.string()),
    desiredOutcome: z.string(),
  }),
  tone: z.string(),
  framework: z.string().optional(),
  variations: z.number().int().positive().default(3),
});

// ============================================
// API Response Schemas
// ============================================

export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GenerateContentInput = z.infer<typeof generateContentSchema>;
export type OptimizeForPlatformInput = z.infer<typeof optimizeForPlatformSchema>;
export type CreateBrandProfileInput = z.infer<typeof createBrandProfileSchema>;
export type TranslateInput = z.infer<typeof translateSchema>;
export type CollectContentInput = z.infer<typeof collectContentSchema>;
export type GenerateVideoInput = z.infer<typeof generateVideoSchema>;
export type GenerateCopyInput = z.infer<typeof generateCopySchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
