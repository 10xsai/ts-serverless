import { generateTraceId } from '../utils/helpers.js';
/**
 * Base error class for all framework errors
 */
export class BaseError extends Error {
    name;
    code;
    traceId;
    context;
    statusCode;
    timestamp;
    constructor(message, code, statusCode = 500, context) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.traceId = context?.traceId || generateTraceId();
        this.context = context;
        this.timestamp = new Date();
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        // Set the prototype explicitly to ensure instanceof works correctly
        Object.setPrototypeOf(this, new.target.prototype);
    }
    /**
     * Convert error to plain object for serialization
     */
    toJSON() {
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
}
/**
 * Validation error - 400 status code
 */
export class ValidationError extends BaseError {
    issues;
    constructor(message, issues = [], context) {
        super(message, 'VALIDATION_ERROR', 400, context);
        this.issues = issues;
    }
    isRetryable() {
        return false;
    }
    getSeverity() {
        return 'low';
    }
    toJSON() {
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
    resource;
    identifier;
    constructor(resource, identifier, context) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, 'NOT_FOUND', 404, context);
        this.resource = resource;
        this.identifier = identifier;
    }
    isRetryable() {
        return false;
    }
    getSeverity() {
        return 'low';
    }
    toJSON() {
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
    conflictType;
    conflictingValue;
    constructor(message, conflictType = 'RESOURCE_CONFLICT', conflictingValue, context) {
        super(message, 'CONFLICT', 409, context);
        this.conflictType = conflictType;
        this.conflictingValue = conflictingValue;
    }
    isRetryable() {
        return false;
    }
    getSeverity() {
        return 'medium';
    }
    toJSON() {
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
    constructor(message = 'Unauthorized', context) {
        super(message, 'UNAUTHORIZED', 401, context);
    }
    isRetryable() {
        return false;
    }
    getSeverity() {
        return 'medium';
    }
}
/**
 * Forbidden error - 403 status code
 */
export class ForbiddenError extends BaseError {
    constructor(message = 'Forbidden', context) {
        super(message, 'FORBIDDEN', 403, context);
    }
    isRetryable() {
        return false;
    }
    getSeverity() {
        return 'medium';
    }
}
/**
 * Rate limit error - 429 status code
 */
export class RateLimitError extends BaseError {
    retryAfter;
    constructor(message = 'Rate limit exceeded', retryAfter, context) {
        super(message, 'RATE_LIMIT_EXCEEDED', 429, context);
        this.retryAfter = retryAfter;
    }
    isRetryable() {
        return true;
    }
    getSeverity() {
        return 'medium';
    }
    toJSON() {
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
    constructor(message = 'Internal server error', context) {
        super(message, 'INTERNAL_SERVER_ERROR', 500, context);
    }
    isRetryable() {
        return true;
    }
    getSeverity() {
        return 'high';
    }
}
/**
 * Database error - 500 status code
 */
export class DatabaseError extends BaseError {
    operation;
    query;
    constructor(message, operation, query, context) {
        super(message, 'DATABASE_ERROR', 500, context);
        this.operation = operation;
        this.query = query;
    }
    isRetryable() {
        return true;
    }
    getSeverity() {
        return 'high';
    }
    toJSON() {
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
    endpoint;
    method;
    constructor(message, endpoint, method, context) {
        super(message, 'NETWORK_ERROR', 503, context);
        this.endpoint = endpoint;
        this.method = method;
    }
    isRetryable() {
        return true;
    }
    getSeverity() {
        return 'high';
    }
    toJSON() {
        return {
            ...super.toJSON(),
            endpoint: this.endpoint,
            method: this.method,
        };
    }
}
