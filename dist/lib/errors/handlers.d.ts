import type { ErrorContext, TraceId, ApiResponse } from '../types.js';
import { BaseError } from './base.js';
/**
 * Handle error and convert to API response
 */
export declare const handleError: (error: unknown, context?: ErrorContext) => Promise<ApiResponse<never>>;
/**
 * Handle error and convert to HTTP response
 */
export declare const handleErrorAsHttpResponse: (error: unknown, context?: ErrorContext) => Promise<Response>;
/**
 * Transform unknown error to BaseError
 */
export declare const transformToBaseError: (error: unknown, context?: ErrorContext) => BaseError;
/**
 * Convert BaseError to API response
 */
export declare const errorToResponse: (error: BaseError) => ApiResponse<never>;
/**
 * Determine if error message should be exposed to client
 */
export declare const shouldExposeMessage: (error: BaseError) => boolean;
/**
 * Log error (Cloudflare Workers compatible)
 */
export declare const logError: (error: BaseError, context?: ErrorContext) => Promise<void>;
/**
 * Convert severity to log level
 */
export declare const getSeverityLevel: (severity: "low" | "medium" | "high" | "critical") => string;
/**
 * Create error context
 */
export declare const createErrorContext: (operation?: string, entityType?: string, traceId?: TraceId) => ErrorContext;
