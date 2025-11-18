import { ERROR_CODES } from './constants';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication Errors
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', details?: any) {
    super(ERROR_CODES.AUTH_UNAUTHORIZED, message, 401, details);
    this.name = 'AuthenticationError';
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = 'Invalid credentials', details?: any) {
    super(ERROR_CODES.AUTH_INVALID_CREDENTIALS, message, 401, details);
    this.name = 'InvalidCredentialsError';
  }
}

export class TokenExpiredError extends AppError {
  constructor(message = 'Token has expired', details?: any) {
    super(ERROR_CODES.AUTH_TOKEN_EXPIRED, message, 401, details);
    this.name = 'TokenExpiredError';
  }
}

// Validation Errors
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: any) {
    super(ERROR_CODES.VALIDATION_ERROR, message, 400, details);
    this.name = 'ValidationError';
  }
}

export class InvalidInputError extends AppError {
  constructor(message = 'Invalid input', details?: any) {
    super(ERROR_CODES.INVALID_INPUT, message, 400, details);
    this.name = 'InvalidInputError';
  }
}

// Resource Errors
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', details?: any) {
    super(
      ERROR_CODES.RESOURCE_NOT_FOUND,
      `${resource} not found`,
      404,
      details
    );
    this.name = 'NotFoundError';
  }
}

export class AlreadyExistsError extends AppError {
  constructor(resource = 'Resource', details?: any) {
    super(
      ERROR_CODES.RESOURCE_ALREADY_EXISTS,
      `${resource} already exists`,
      409,
      details
    );
    this.name = 'AlreadyExistsError';
  }
}

// Limit Errors
export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', details?: any) {
    super(ERROR_CODES.RATE_LIMIT_EXCEEDED, message, 429, details);
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends AppError {
  constructor(message = 'Quota exceeded', details?: any) {
    super(ERROR_CODES.QUOTA_EXCEEDED, message, 429, details);
    this.name = 'QuotaExceededError';
  }
}

export class StorageLimitError extends AppError {
  constructor(message = 'Storage limit exceeded', details?: any) {
    super(ERROR_CODES.STORAGE_LIMIT_EXCEEDED, message, 413, details);
    this.name = 'StorageLimitError';
  }
}

// AI/Generation Errors
export class AIGenerationError extends AppError {
  constructor(message = 'AI generation failed', details?: any) {
    super(ERROR_CODES.AI_GENERATION_FAILED, message, 500, details);
    this.name = 'AIGenerationError';
  }
}

export class AITimeoutError extends AppError {
  constructor(message = 'AI generation timeout', details?: any) {
    super(ERROR_CODES.AI_TIMEOUT, message, 504, details);
    this.name = 'AITimeoutError';
  }
}

export class AIInvalidResponseError extends AppError {
  constructor(message = 'Invalid AI response', details?: any) {
    super(ERROR_CODES.AI_INVALID_RESPONSE, message, 500, details);
    this.name = 'AIInvalidResponseError';
  }
}

// Server Errors
export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details?: any) {
    super(ERROR_CODES.INTERNAL_SERVER_ERROR, message, 500, details);
    this.name = 'InternalServerError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable', details?: any) {
    super(ERROR_CODES.SERVICE_UNAVAILABLE, message, 503, details);
    this.name = 'ServiceUnavailableError';
  }
}
