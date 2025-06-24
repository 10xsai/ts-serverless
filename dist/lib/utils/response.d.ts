import type { ApiResponse, ApiError, TraceId, HealthCheck } from '../types.js';
/**
 * Create a successful API response
 */
export declare const createSuccessResponse: <T>(data: T, message?: string, traceId?: TraceId) => ApiResponse<T>;
/**
 * Create an error API response
 */
export declare const createErrorResponse: (error: string | ApiError, message?: string, traceId?: TraceId) => ApiResponse<never>;
/**
 * Create a paginated response
 */
export declare const createPaginatedResponse: <T>(data: T[], total: number, page: number, limit: number, traceId?: TraceId) => ApiResponse<{
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}>;
/**
 * Create a validation error response
 */
export declare const createValidationErrorResponse: (issues: Array<{
    field: string;
    message: string;
    code?: string;
}>, traceId?: TraceId) => ApiResponse<never>;
/**
 * Create a not found error response
 */
export declare const createNotFoundResponse: (resource: string, identifier?: string, traceId?: TraceId) => ApiResponse<never>;
/**
 * Create an unauthorized error response
 */
export declare const createUnauthorizedResponse: (message?: string, traceId?: TraceId) => ApiResponse<never>;
/**
 * Create a forbidden error response
 */
export declare const createForbiddenResponse: (message?: string, traceId?: TraceId) => ApiResponse<never>;
/**
 * Create a conflict error response
 */
export declare const createConflictResponse: (message?: string, traceId?: TraceId) => ApiResponse<never>;
/**
 * Create a rate limit error response
 */
export declare const createRateLimitResponse: (message?: string, retryAfter?: number, traceId?: TraceId) => ApiResponse<never>;
/**
 * Create a server error response
 */
export declare const createServerErrorResponse: (message?: string, traceId?: TraceId) => ApiResponse<never>;
/**
 * Create a health check response
 */
export declare const createHealthCheckResponse: (status: HealthCheck["status"], services?: Record<string, "healthy" | "unhealthy">, version?: string) => HealthCheck;
/**
 * Convert Response to JSON (Cloudflare Workers compatible)
 */
export declare const toJsonResponse: (data: unknown, status?: number, headers?: Record<string, string>) => Response;
/**
 * Convert API response to HTTP response
 */
export declare const toHttpResponse: (apiResponse: ApiResponse<unknown>, statusCode?: number) => Response;
/**
 * Handle CORS preflight requests
 */
export declare const createCorsResponse: (allowedMethods?: string[], allowedHeaders?: string[]) => Response;
