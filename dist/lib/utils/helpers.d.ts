import type { EntityId, UserId, TenantId, TraceId } from '../types.js';
/**
 * Generate a unique entity ID
 */
export declare const generateId: () => EntityId;
/**
 * Generate a unique user ID
 */
export declare const generateUserId: () => UserId;
/**
 * Generate a unique tenant ID
 */
export declare const generateTenantId: () => TenantId;
/**
 * Generate a unique trace ID
 */
export declare const generateTraceId: () => TraceId;
/**
 * Check if a value is null or undefined
 */
export declare const isNullOrUndefined: (value: unknown) => value is null | undefined;
/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export declare const isEmpty: (value: unknown) => boolean;
/**
 * Deep clone an object (serverless-safe implementation)
 */
export declare const deepClone: <T>(obj: T) => T;
/**
 * Omit properties from an object
 */
export declare const omit: <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) => Omit<T, K>;
/**
 * Pick properties from an object
 */
export declare const pick: <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) => Pick<T, K>;
/**
 * Convert string to camelCase
 */
export declare const toCamelCase: (str: string) => string;
/**
 * Convert string to snake_case
 */
export declare const toSnakeCase: (str: string) => string;
/**
 * Debounce function (serverless-safe)
 */
export declare const debounce: <T extends (...args: unknown[]) => unknown>(func: T, delay: number) => T;
/**
 * Throttle function (serverless-safe)
 */
export declare const throttle: <T extends (...args: unknown[]) => unknown>(func: T, delay: number) => T;
/**
 * Retry function with exponential backoff
 */
export declare const retry: <T>(fn: () => Promise<T>, options?: {
    maxAttempts?: number;
    delay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: unknown) => boolean;
}) => Promise<T>;
/**
 * Sleep function
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * Format date to ISO string
 */
export declare const formatDate: (date: Date) => string;
/**
 * Parse date from string
 */
export declare const parseDate: (dateString: string) => Date;
/**
 * Get current timestamp
 */
export declare const getCurrentTimestamp: () => Date;
/**
 * Calculate pagination offset
 */
export declare const calculateOffset: (page: number, limit: number) => number;
/**
 * Calculate total pages
 */
export declare const calculateTotalPages: (total: number, limit: number) => number;
