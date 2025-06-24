import type { ApiResponse, ApiError, TraceId, HealthCheck } from '../types.js';
import { generateTraceId, getCurrentTimestamp } from './helpers.js';

/**
 * Create a successful API response
 */
export const createSuccessResponse = <T>(
    data: T,
    message?: string,
    traceId?: TraceId
): ApiResponse<T> => {
    return {
        success: true,
        data,
        message,
        timestamp: getCurrentTimestamp(),
        traceId: traceId || generateTraceId(),
    };
};

/**
 * Create an error API response
 */
export const createErrorResponse = (
    error: string | ApiError,
    message?: string,
    traceId?: TraceId
): ApiResponse<never> => {
    const errorDetails = typeof error === 'string'
        ? { code: 'UNKNOWN_ERROR', message: error, traceId: traceId || generateTraceId() }
        : error;

    return {
        success: false,
        error: errorDetails.message,
        message: message || errorDetails.message,
        timestamp: getCurrentTimestamp(),
        traceId: errorDetails.traceId,
    };
};

/**
 * Create a paginated response
 */
export const createPaginatedResponse = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    traceId?: TraceId
): ApiResponse<{
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}> => {
    const totalPages = Math.ceil(total / limit);

    return createSuccessResponse({
        items: data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    }, undefined, traceId);
};

/**
 * Create a validation error response
 */
export const createValidationErrorResponse = (
    issues: Array<{
        field: string;
        message: string;
        code?: string;
    }>,
    traceId?: TraceId
): ApiResponse<never> => {
    return createErrorResponse({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: { issues },
        traceId: traceId || generateTraceId(),
    }, 'Validation failed', traceId);
};

/**
 * Create a not found error response
 */
export const createNotFoundResponse = (
    resource: string,
    identifier?: string,
    traceId?: TraceId
): ApiResponse<never> => {
    const message = identifier
        ? `${resource} with identifier '${identifier}' not found`
        : `${resource} not found`;

    return createErrorResponse({
        code: 'NOT_FOUND',
        message,
        traceId: traceId || generateTraceId(),
    }, message, traceId);
};

/**
 * Create an unauthorized error response
 */
export const createUnauthorizedResponse = (
    message = 'Unauthorized',
    traceId?: TraceId
): ApiResponse<never> => {
    return createErrorResponse({
        code: 'UNAUTHORIZED',
        message,
        traceId: traceId || generateTraceId(),
    }, message, traceId);
};

/**
 * Create a forbidden error response
 */
export const createForbiddenResponse = (
    message = 'Forbidden',
    traceId?: TraceId
): ApiResponse<never> => {
    return createErrorResponse({
        code: 'FORBIDDEN',
        message,
        traceId: traceId || generateTraceId(),
    }, message, traceId);
};

/**
 * Create a conflict error response
 */
export const createConflictResponse = (
    message = 'Resource conflict',
    traceId?: TraceId
): ApiResponse<never> => {
    return createErrorResponse({
        code: 'CONFLICT',
        message,
        traceId: traceId || generateTraceId(),
    }, message, traceId);
};

/**
 * Create a rate limit error response
 */
export const createRateLimitResponse = (
    message = 'Rate limit exceeded',
    retryAfter?: number,
    traceId?: TraceId
): ApiResponse<never> => {
    return createErrorResponse({
        code: 'RATE_LIMIT_EXCEEDED',
        message,
        details: retryAfter ? { retryAfter } : undefined,
        traceId: traceId || generateTraceId(),
    }, message, traceId);
};

/**
 * Create a server error response
 */
export const createServerErrorResponse = (
    message = 'Internal server error',
    traceId?: TraceId
): ApiResponse<never> => {
    return createErrorResponse({
        code: 'INTERNAL_SERVER_ERROR',
        message,
        traceId: traceId || generateTraceId(),
    }, message, traceId);
};

/**
 * Create a health check response
 */
export const createHealthCheckResponse = (
    status: HealthCheck['status'],
    services?: Record<string, 'healthy' | 'unhealthy'>,
    version?: string
): HealthCheck => {
    return {
        status,
        timestamp: getCurrentTimestamp(),
        services,
        version,
    };
};

/**
 * Convert Response to JSON (Cloudflare Workers compatible)
 */
export const toJsonResponse = (
    data: unknown,
    status = 200,
    headers: Record<string, string> = {}
): Response => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        ...headers,
    };

    return new Response(JSON.stringify(data), {
        status,
        headers: defaultHeaders,
    });
};

/**
 * Convert API response to HTTP response
 */
export const toHttpResponse = (
    apiResponse: ApiResponse<unknown>,
    statusCode?: number
): Response => {
    const status = statusCode || (apiResponse.success ? 200 : 400);
    return toJsonResponse(apiResponse, status);
};

/**
 * Handle CORS preflight requests
 */
export const createCorsResponse = (
    allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: string[] = ['Content-Type', 'Authorization']
): Response => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': allowedMethods.join(', '),
            'Access-Control-Allow-Headers': allowedHeaders.join(', '),
            'Access-Control-Max-Age': '86400',
        },
    });
}; 