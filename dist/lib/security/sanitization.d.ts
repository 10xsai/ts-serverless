/**
 * Basic input sanitization utilities
 */
/**
 * Sanitize HTML by removing script tags and dangerous attributes
 */
export declare const sanitizeHtml: (input: string) => string;
/**
 * Sanitize SQL input by escaping single quotes
 */
export declare const sanitizeSql: (input: string) => string;
/**
 * Remove null bytes from input
 */
export declare const removeNullBytes: (input: string) => string;
/**
 * Sanitize file path to prevent directory traversal
 */
export declare const sanitizeFilePath: (input: string) => string;
/**
 * Basic XSS protection
 */
export declare const sanitizeXss: (input: string) => string;
/**
 * Sanitize email address
 */
export declare const sanitizeEmail: (input: string) => string;
/**
 * Sanitize URL
 */
export declare const sanitizeUrl: (input: string) => string;
/**
 * General input sanitizer
 */
export declare const sanitizeInput: (input: unknown) => string;
