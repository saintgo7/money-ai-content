// ============================================
// Platform Specifications
// ============================================

export const PLATFORM_SPECS = {
  instagram: {
    name: 'Instagram',
    maxTextLength: 2200,
    maxHashtags: 30,
    recommendedHashtags: 11,
    imageSizes: {
      square: { width: 1080, height: 1080 },
      portrait: { width: 1080, height: 1350 },
      landscape: { width: 1080, height: 566 },
      story: { width: 1080, height: 1920 },
    },
    videoSpecs: {
      maxDuration: 60,
      aspectRatios: ['1:1', '4:5', '16:9'],
      formats: ['MP4', 'MOV'],
    },
  },
  twitter: {
    name: 'Twitter / X',
    maxTextLength: 280,
    maxHashtags: 3,
    imageSizes: {
      standard: { width: 1200, height: 675 },
    },
    videoSpecs: {
      maxDuration: 140,
      aspectRatios: ['16:9', '1:1'],
      formats: ['MP4', 'MOV'],
    },
  },
  linkedin: {
    name: 'LinkedIn',
    maxTextLength: 3000,
    maxHashtags: 5,
    imageSizes: {
      post: { width: 1200, height: 627 },
    },
    videoSpecs: {
      maxDuration: 600,
      aspectRatios: ['16:9', '1:1', '4:5'],
      formats: ['MP4'],
    },
  },
  facebook: {
    name: 'Facebook',
    maxTextLength: 63206,
    recommendedTextLength: 500,
    maxHashtags: 10,
    recommendedHashtags: 3,
    imageSizes: {
      post: { width: 1200, height: 630 },
    },
    videoSpecs: {
      maxDuration: 240,
      aspectRatios: ['16:9', '1:1', '4:5', '9:16'],
      formats: ['MP4', 'MOV'],
    },
  },
  tiktok: {
    name: 'TikTok',
    maxTextLength: 150,
    maxHashtags: 10,
    recommendedHashtags: 5,
    videoSpecs: {
      maxDuration: 180,
      aspectRatio: '9:16',
      resolution: { width: 1080, height: 1920 },
      formats: ['MP4', 'MOV'],
    },
  },
  youtube: {
    name: 'YouTube',
    titleMaxLength: 100,
    descriptionMaxLength: 5000,
    maxHashtags: 15,
    thumbnailSize: { width: 1280, height: 720 },
    videoSpecs: {
      aspectRatio: '16:9',
      formats: ['MP4', 'MOV', 'AVI'],
    },
  },
} as const;

// ============================================
// Content Types
// ============================================

export const CONTENT_TYPES = {
  TEXT: 'Text',
  IMAGE: 'Image',
  AUDIO: 'Audio',
  VIDEO: 'Video',
  SOCIAL_POST: 'Social Media Post',
  BLOG_POST: 'Blog Post',
  EMAIL: 'Email',
  AD_COPY: 'Ad Copy',
  PRODUCT_DESCRIPTION: 'Product Description',
  NEWSLETTER: 'Newsletter',
  TRANSLATION: 'Translation',
} as const;

// ============================================
// Copywriting Frameworks
// ============================================

export const COPYWRITING_FRAMEWORKS = {
  AIDA: {
    name: 'AIDA',
    description: 'Attention → Interest → Desire → Action',
    bestFor: ['ads', 'landing pages', 'email'],
  },
  PAS: {
    name: 'PAS',
    description: 'Problem → Agitate → Solve',
    bestFor: ['sales', 'email', 'landing pages'],
  },
  BAB: {
    name: 'BAB',
    description: 'Before → After → Bridge',
    bestFor: ['transformation', 'coaching', 'software'],
  },
  '4Ps': {
    name: '4Ps',
    description: 'Promise → Picture → Proof → Push',
    bestFor: ['sales letters', 'webinars'],
  },
  FAB: {
    name: 'FAB',
    description: 'Features → Advantages → Benefits',
    bestFor: ['product descriptions', 'B2B sales'],
  },
  QUEST: {
    name: 'QUEST',
    description: 'Qualify → Understand → Educate → Stimulate → Transition',
    bestFor: ['consultative selling', 'B2B'],
  },
} as const;

// ============================================
// Subscription Plans
// ============================================

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: {
      contentGeneration: 10,
      brandProfiles: 1,
      projects: 1,
      teamMembers: 1,
      storage: 1, // GB
      apiAccess: false,
    },
  },
  STARTER: {
    name: 'Starter',
    price: 29,
    features: {
      contentGeneration: 100,
      brandProfiles: 3,
      projects: 5,
      teamMembers: 3,
      storage: 10,
      apiAccess: false,
    },
  },
  PRO: {
    name: 'Pro',
    price: 79,
    features: {
      contentGeneration: 500,
      brandProfiles: 10,
      projects: -1, // unlimited
      teamMembers: 10,
      storage: 100,
      apiAccess: true,
    },
  },
  BUSINESS: {
    name: 'Business',
    price: 199,
    features: {
      contentGeneration: -1,
      brandProfiles: -1,
      projects: -1,
      teamMembers: -1,
      storage: 500,
      apiAccess: true,
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: null, // custom
    features: {
      contentGeneration: -1,
      brandProfiles: -1,
      projects: -1,
      teamMembers: -1,
      storage: -1,
      apiAccess: true,
    },
  },
} as const;

// ============================================
// Language Codes
// ============================================

export const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese (Simplified)',
  ar: 'Arabic',
  hi: 'Hindi',
  nl: 'Dutch',
  sv: 'Swedish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  pl: 'Polish',
  tr: 'Turkish',
  th: 'Thai',
  vi: 'Vietnamese',
  id: 'Indonesian',
} as const;

// ============================================
// AI Models
// ============================================

export const AI_MODELS = {
  CLAUDE_SONNET: 'claude-sonnet-4-20250514',
  CLAUDE_OPUS: 'claude-opus-4-20250514',
  CLAUDE_HAIKU: 'claude-haiku-4-20250514',
} as const;

// ============================================
// File Upload Limits
// ============================================

export const UPLOAD_LIMITS = {
  IMAGE: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  VIDEO: {
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  },
  AUDIO: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  },
  DOCUMENT: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['application/pdf', 'text/plain', 'application/msword'],
  },
} as const;

// ============================================
// Rate Limits
// ============================================

export const RATE_LIMITS = {
  FREE: {
    requestsPerMinute: 10,
    requestsPerDay: 100,
  },
  STARTER: {
    requestsPerMinute: 30,
    requestsPerDay: 1000,
  },
  PRO: {
    requestsPerMinute: 100,
    requestsPerDay: 10000,
  },
  BUSINESS: {
    requestsPerMinute: 500,
    requestsPerDay: 50000,
  },
  ENTERPRISE: {
    requestsPerMinute: -1,
    requestsPerDay: -1,
  },
} as const;

// ============================================
// Error Codes
// ============================================

export const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resources
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',

  // Limits
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  STORAGE_LIMIT_EXCEEDED: 'STORAGE_LIMIT_EXCEEDED',

  // AI/Generation
  AI_GENERATION_FAILED: 'AI_GENERATION_FAILED',
  AI_TIMEOUT: 'AI_TIMEOUT',
  AI_INVALID_RESPONSE: 'AI_INVALID_RESPONSE',

  // Server
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;
