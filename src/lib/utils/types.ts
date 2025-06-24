/**
 * Retry configuration options
 */
export interface RetryOptions {
    maxAttempts?: number;
    delay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: unknown) => boolean;
}

/**
 * HTTP response options
 */
export interface ResponseOptions {
    status?: number;
    headers?: Record<string, string>;
}

/**
 * CORS configuration
 */
export interface CorsConfig {
    allowedOrigins?: string[];
    allowedMethods?: string[];
    allowedHeaders?: string[];
    maxAge?: number;
}

/**
 * Pagination helpers
 */
export interface PaginationHelpers {
    calculateOffset: (page: number, limit: number) => number;
    calculateTotalPages: (total: number, limit: number) => number;
}

/**
 * String transformation utilities
 */
export interface StringTransformers {
    toCamelCase: (str: string) => string;
    toSnakeCase: (str: string) => string;
}

/**
 * Object utilities
 */
export interface ObjectUtils {
    omit: <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>;
    pick: <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>;
    deepClone: <T>(obj: T) => T;
}

/**
 * Date utilities
 */
export interface DateUtils {
    formatDate: (date: Date) => string;
    parseDate: (dateString: string) => Date;
    getCurrentTimestamp: () => Date;
}

/**
 * Validation utilities
 */
export interface ValidationUtils {
    isNullOrUndefined: (value: unknown) => value is null | undefined;
    isEmpty: (value: unknown) => boolean;
}

/**
 * Function utilities
 */
export interface FunctionUtils {
    debounce: <T extends (...args: unknown[]) => unknown>(func: T, delay: number) => T;
    throttle: <T extends (...args: unknown[]) => unknown>(func: T, delay: number) => T;
    retry: <T>(fn: () => Promise<T>, options?: RetryOptions) => Promise<T>;
    sleep: (ms: number) => Promise<void>;
} 