/**
 * Security validation utilities
 */
/**
 * Check if input contains potential SQL injection
 */
export declare const hasSqlInjection: (input: string) => boolean;
/**
 * Check if input contains potential XSS
 */
export declare const hasXss: (input: string) => boolean;
/**
 * Validate password strength
 */
export declare const isStrongPassword: (password: string) => boolean;
/**
 * Validate email format
 */
export declare const isValidEmail: (email: string) => boolean;
/**
 * Validate URL format
 */
export declare const isValidUrl: (url: string) => boolean;
/**
 * Check if input is safe for file operations
 */
export declare const isSafeFilename: (filename: string) => boolean;
