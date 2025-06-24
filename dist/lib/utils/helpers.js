import { nanoid } from 'nanoid';
import { createEntityId, createUserId, createTenantId, createTraceId } from '../types.js';
/**
 * Generate a unique entity ID
 */
export const generateId = () => {
    return createEntityId(nanoid());
};
/**
 * Generate a unique user ID
 */
export const generateUserId = () => {
    return createUserId(nanoid());
};
/**
 * Generate a unique tenant ID
 */
export const generateTenantId = () => {
    return createTenantId(nanoid());
};
/**
 * Generate a unique trace ID
 */
export const generateTraceId = () => {
    return createTraceId(nanoid());
};
/**
 * Check if a value is null or undefined
 */
export const isNullOrUndefined = (value) => {
    return value === null || value === undefined;
};
/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value) => {
    if (isNullOrUndefined(value))
        return true;
    if (typeof value === 'string')
        return value.trim().length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
};
/**
 * Deep clone an object (serverless-safe implementation)
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object')
        return obj;
    if (obj instanceof Date)
        return new Date(obj.getTime());
    if (Array.isArray(obj))
        return obj.map(deepClone);
    const cloned = {};
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
export const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};
/**
 * Pick properties from an object
 */
export const pick = (obj, keys) => {
    const result = {};
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
export const toCamelCase = (str) => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};
/**
 * Convert string to snake_case
 */
export const toSnakeCase = (str) => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};
/**
 * Debounce function (serverless-safe)
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return ((...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    });
};
/**
 * Throttle function (serverless-safe)
 */
export const throttle = (func, delay) => {
    let lastCall = 0;
    return ((...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func(...args);
        }
        return undefined;
    });
};
/**
 * Retry function with exponential backoff
 */
export const retry = async (fn, options = {}) => {
    const { maxAttempts = 3, delay = 1000, backoffFactor = 2, shouldRetry = () => true } = options;
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
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
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
/**
 * Format date to ISO string
 */
export const formatDate = (date) => {
    return date.toISOString();
};
/**
 * Parse date from string
 */
export const parseDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`);
    }
    return date;
};
/**
 * Get current timestamp
 */
export const getCurrentTimestamp = () => {
    return new Date();
};
/**
 * Calculate pagination offset
 */
export const calculateOffset = (page, limit) => {
    return (page - 1) * limit;
};
/**
 * Calculate total pages
 */
export const calculateTotalPages = (total, limit) => {
    return Math.ceil(total / limit);
};
