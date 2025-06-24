import type { ErrorContext, TraceId, ApiResponse } from '../types.js';
import { BaseError, ValidationError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError, RateLimitError, InternalServerError } from './base.js';
import { generateTraceId } from '../utils/helpers.js';
import {
    createValidationErrorResponse,
    createNotFoundResponse,
    createUnauthorizedResponse,
    createForbiddenResponse,
    createConflictResponse,
    createRateLimitResponse,
    createServerErrorResponse,
    toHttpResponse
} from '../utils/response.js';

/**
 * Handle error and convert to API response
 */
export const handleError = async (
    error: unknown,
    context?: ErrorContext
): Promise<ApiResponse<never>> => {
    const processedError = transformToBaseError(error, context);
    await logError(processedError, context);
    return errorToResponse(processedError);
};

/**
 * Handle error and convert to HTTP response
 */
export const handleErrorAsHttpResponse = async (
    error: unknown,
    context?: ErrorContext
): Promise<Response> => {
    const apiResponse = await handleError(error, context);
    return toHttpResponse(apiResponse);
};

/**
 * Transform unknown error to BaseError
 */
export const transformToBaseError = (error: unknown, context?: ErrorContext): BaseError => {
    if (error instanceof BaseError) {
        return error;
    }

    if (error instanceof Error) {
        return new InternalServerError(error.message, context);
    }

    if (typeof error === 'string') {
        return new InternalServerError(error, context);
    }

    return new InternalServerError('An unknown error occurred', context);
};

/**
 * Convert BaseError to API response
 */
export const errorToResponse = (error: BaseError): ApiResponse<never> => {
    const traceId = error.traceId;

    if (error instanceof ValidationError) {
        return createValidationErrorResponse(error.issues, traceId);
    }

    if (error instanceof NotFoundError) {
        return createNotFoundResponse(error.resource, error.identifier, traceId);
    }

    if (error instanceof UnauthorizedError) {
        return createUnauthorizedResponse(error.message, traceId);
    }

    if (error instanceof ForbiddenError) {
        return createForbiddenResponse(error.message, traceId);
    }

    if (error instanceof ConflictError) {
        return createConflictResponse(error.message, traceId);
    }

    if (error instanceof RateLimitError) {
        return createRateLimitResponse(error.message, error.retryAfter, traceId);
    }

    // Default to server error
    const message = shouldExposeMessage(error) ? error.message : 'Internal server error';
    return createServerErrorResponse(message, traceId);
};

/**
 * Determine if error message should be exposed to client
 */
export const shouldExposeMessage = (error: BaseError): boolean => {
    return error.statusCode >= 400 && error.statusCode < 500;
};

/**
 * Log error (Cloudflare Workers compatible)
 */
export const logError = async (error: BaseError, context?: ErrorContext): Promise<void> => {
    const logData = {
        timestamp: new Date().toISOString(),
        level: getSeverityLevel(error.getSeverity()),
        error: {
            name: error.name,
            code: error.code,
            message: error.message,
            statusCode: error.statusCode,
            traceId: error.traceId,
        },
        context,
    };

    console.error(JSON.stringify(logData));
};

/**
 * Convert severity to log level
 */
export const getSeverityLevel = (severity: 'low' | 'medium' | 'high' | 'critical'): string => {
    switch (severity) {
        case 'low': return 'warn';
        case 'medium': return 'error';
        case 'high': return 'error';
        case 'critical': return 'fatal';
        default: return 'error';
    }
};

/**
 * Create error context
 */
export const createErrorContext = (
    operation?: string,
    entityType?: string,
    traceId?: TraceId
): ErrorContext => {
    return {
        operation,
        entityType,
        traceId: traceId || generateTraceId(),
    };
}; 