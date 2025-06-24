import { nanoid } from 'nanoid';
import type { EntityId, UserId, TenantId, TraceId } from '../types.js';
import { createEntityId, createUserId, createTenantId, createTraceId } from '../types.js';

/**
 * Generate a unique entity ID
 */
export const generateId = (): EntityId => {
    return createEntityId(nanoid());
};

/**
 * Generate a unique user ID
 */
export const generateUserId = (): UserId => {
    return createUserId(nanoid());
};

/**
 * Generate a unique tenant ID
 */
export const generateTenantId = (): TenantId => {
    return createTenantId(nanoid());
};

/**
 * Generate a unique trace ID
 */
export const generateTraceId = (): TraceId => {
    return createTraceId(nanoid());
};

/**
 * Check if a value is null or undefined
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined => {
    return value === null || value === undefined;
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: unknown): boolean => {
    if (isNullOrUndefined(value)) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value as object).length === 0;
    return false;
};

/**
 * Deep clone an object (serverless-safe implementation)
 */
export const deepClone = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;

    const cloned = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
};

/**
 * Omit properties from an object
 */
export const omit = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};

/**
 * Pick properties from an object
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};

/**
 * Convert string to camelCase
 */
export const toCamelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convert string to snake_case
 */
export const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Debounce function (serverless-safe)
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
): T => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return ((...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    }) as T;
};

/**
 * Throttle function (serverless-safe)
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number
): T => {
    let lastCall = 0;

    return ((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func(...args);
        }
        return undefined;
    }) as T;
};

/**
 * Retry function with exponential backoff
 */
export const retry = async <T>(
    fn: () => Promise<T>,
    options: {
        maxAttempts?: number;
        delay?: number;
        backoffFactor?: number;
        shouldRetry?: (error: unknown) => boolean;
    } = {}
): Promise<T> => {
    const {
        maxAttempts = 3,
        delay = 1000,
        backoffFactor = 2,
        shouldRetry = () => true
    } = options;

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt === maxAttempts || !shouldRetry(error)) {
                throw error;
            }

            const waitTime = delay * Math.pow(backoffFactor, attempt - 1);
            await sleep(waitTime);
        }
    }

    throw lastError;
};

/**
 * Sleep function
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Format date to ISO string
 */
export const formatDate = (date: Date): string => {
    return date.toISOString();
};

/**
 * Parse date from string
 */
export const parseDate = (dateString: string): Date => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`);
    }
    return date;
};

/**
 * Get current timestamp
 */
export const getCurrentTimestamp = (): Date => {
    return new Date();
};

/**
 * Calculate pagination offset
 */
export const calculateOffset = (page: number, limit: number): number => {
    return (page - 1) * limit;
};

/**
 * Calculate total pages
 */
export const calculateTotalPages = (total: number, limit: number): number => {
    return Math.ceil(total / limit);
}; 