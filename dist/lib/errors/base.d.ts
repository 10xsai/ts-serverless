import type { ErrorContext, TraceId } from '../types.js';
/**
 * Base error class for all framework errors
 */
export declare abstract class BaseError extends Error {
    readonly name: string;
    readonly code: string;
    readonly traceId: TraceId;
    readonly context?: ErrorContext;
    readonly statusCode: number;
    readonly timestamp: Date;
    constructor(message: string, code: string, statusCode?: number, context?: ErrorContext);
    /**
     * Convert error to plain object for serialization
     */
    toJSON(): Record<string, unknown>;
    /**
     * Check if error is retryable
     */
    abstract isRetryable(): boolean;
    /**
     * Get error severity level
     */
    abstract getSeverity(): 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Validation error - 400 status code
 */
export declare class ValidationError extends BaseError {
    readonly issues: Array<{
        field: string;
        message: string;
        code: string;
        value?: unknown;
    }>;
    constructor(message: string, issues?: Array<{
        field: string;
        message: string;
        code: string;
        value?: unknown;
    }>, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Not found error - 404 status code
 */
export declare class NotFoundError extends BaseError {
    readonly resource: string;
    readonly identifier?: string;
    constructor(resource: string, identifier?: string, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Conflict error - 409 status code
 */
export declare class ConflictError extends BaseError {
    readonly conflictType: string;
    readonly conflictingValue?: unknown;
    constructor(message: string, conflictType?: string, conflictingValue?: unknown, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Unauthorized error - 401 status code
 */
export declare class UnauthorizedError extends BaseError {
    constructor(message?: string, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Forbidden error - 403 status code
 */
export declare class ForbiddenError extends BaseError {
    constructor(message?: string, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Rate limit error - 429 status code
 */
export declare class RateLimitError extends BaseError {
    readonly retryAfter?: number;
    constructor(message?: string, retryAfter?: number, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Internal server error - 500 status code
 */
export declare class InternalServerError extends BaseError {
    constructor(message?: string, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Database error - 500 status code
 */
export declare class DatabaseError extends BaseError {
    readonly operation: string;
    readonly query?: string;
    constructor(message: string, operation: string, query?: string, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Network error - 503 status code
 */
export declare class NetworkError extends BaseError {
    readonly endpoint?: string;
    readonly method?: string;
    constructor(message: string, endpoint?: string, method?: string, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
