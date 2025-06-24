import type { ErrorContext, TraceId } from '../types.js';
import { generateTraceId } from '../utils/helpers.js';

/**
 * Base error class for all framework errors
 */
export abstract class BaseError extends Error {
    public override readonly name: string;
    public readonly code: string;
    public readonly traceId: TraceId;
    public readonly context?: ErrorContext;
    public readonly statusCode: number;
    public readonly timestamp: Date;

    constructor(
        message: string,
        code: string,
        statusCode = 500,
        context?: ErrorContext
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.traceId = context?.traceId || generateTraceId();
        this.context = context;
        this.timestamp = new Date();

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, this.constructor);
        }

        // Set the prototype explicitly to ensure instanceof works correctly
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * Convert error to plain object for serialization
     */
    public toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            statusCode: this.statusCode,
            traceId: this.traceId,
            timestamp: this.timestamp,
            context: this.context,
            stack: this.stack,
        };
    }

    /**
     * Check if error is retryable
     */
    public abstract isRetryable(): boolean;

    /**
     * Get error severity level
     */
    public abstract getSeverity(): 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Validation error - 400 status code
 */
export class ValidationError extends BaseError {
    public readonly issues: Array<{
        field: string;
        message: string;
        code: string;
        value?: unknown;
    }>;

    constructor(
        message: string,
        issues: Array<{
            field: string;
            message: string;
            code: string;
            value?: unknown;
        }> = [],
        context?: ErrorContext
    ) {
        super(message, 'VALIDATION_ERROR', 400, context);
        this.issues = issues;
    }

    public isRetryable(): boolean {
        return false;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'low';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            issues: this.issues,
        };
    }
}

/**
 * Not found error - 404 status code
 */
export class NotFoundError extends BaseError {
    public readonly resource: string;
    public readonly identifier?: string;

    constructor(
        resource: string,
        identifier?: string,
        context?: ErrorContext
    ) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;

        super(message, 'NOT_FOUND', 404, context);
        this.resource = resource;
        this.identifier = identifier;
    }

    public isRetryable(): boolean {
        return false;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'low';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            resource: this.resource,
            identifier: this.identifier,
        };
    }
}

/**
 * Conflict error - 409 status code
 */
export class ConflictError extends BaseError {
    public readonly conflictType: string;
    public readonly conflictingValue?: unknown;

    constructor(
        message: string,
        conflictType = 'RESOURCE_CONFLICT',
        conflictingValue?: unknown,
        context?: ErrorContext
    ) {
        super(message, 'CONFLICT', 409, context);
        this.conflictType = conflictType;
        this.conflictingValue = conflictingValue;
    }

    public isRetryable(): boolean {
        return false;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'medium';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            conflictType: this.conflictType,
            conflictingValue: this.conflictingValue,
        };
    }
}

/**
 * Unauthorized error - 401 status code
 */
export class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized', context?: ErrorContext) {
        super(message, 'UNAUTHORIZED', 401, context);
    }

    public isRetryable(): boolean {
        return false;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'medium';
    }
}

/**
 * Forbidden error - 403 status code
 */
export class ForbiddenError extends BaseError {
    constructor(message = 'Forbidden', context?: ErrorContext) {
        super(message, 'FORBIDDEN', 403, context);
    }

    public isRetryable(): boolean {
        return false;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'medium';
    }
}

/**
 * Rate limit error - 429 status code
 */
export class RateLimitError extends BaseError {
    public readonly retryAfter?: number;

    constructor(
        message = 'Rate limit exceeded',
        retryAfter?: number,
        context?: ErrorContext
    ) {
        super(message, 'RATE_LIMIT_EXCEEDED', 429, context);
        this.retryAfter = retryAfter;
    }

    public isRetryable(): boolean {
        return true;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'medium';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            retryAfter: this.retryAfter,
        };
    }
}

/**
 * Internal server error - 500 status code
 */
export class InternalServerError extends BaseError {
    constructor(message = 'Internal server error', context?: ErrorContext) {
        super(message, 'INTERNAL_SERVER_ERROR', 500, context);
    }

    public isRetryable(): boolean {
        return true;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'high';
    }
}

/**
 * Database error - 500 status code
 */
export class DatabaseError extends BaseError {
    public readonly operation: string;
    public readonly query?: string;

    constructor(
        message: string,
        operation: string,
        query?: string,
        context?: ErrorContext
    ) {
        super(message, 'DATABASE_ERROR', 500, context);
        this.operation = operation;
        this.query = query;
    }

    public isRetryable(): boolean {
        return true;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'high';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            operation: this.operation,
            query: this.query,
        };
    }
}

/**
 * Network error - 503 status code
 */
export class NetworkError extends BaseError {
    public readonly endpoint?: string;
    public readonly method?: string;

    constructor(
        message: string,
        endpoint?: string,
        method?: string,
        context?: ErrorContext
    ) {
        super(message, 'NETWORK_ERROR', 503, context);
        this.endpoint = endpoint;
        this.method = method;
    }

    public isRetryable(): boolean {
        return true;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'high';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            endpoint: this.endpoint,
            method: this.method,
        };
    }
} 