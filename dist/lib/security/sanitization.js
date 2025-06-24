/**
 * Basic input sanitization utilities
 */
/**
 * Sanitize HTML by removing script tags and dangerous attributes
 */
export const sanitizeHtml = (input) => {
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
};
/**
 * Sanitize SQL input by escaping single quotes
 */
export const sanitizeSql = (input) => {
    return input.replace(/'/g, "''");
};
/**
 * Remove null bytes from input
 */
export const removeNullBytes = (input) => {
    return input.replace(/\0/g, '');
};
/**
 * Sanitize file path to prevent directory traversal
 */
export const sanitizeFilePath = (input) => {
    return input.replace(/\.\./g, '').replace(/[/\\]/g, '');
};
/**
 * Basic XSS protection
 */
export const sanitizeXss = (input) => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};
/**
 * Sanitize email address
 */
export const sanitizeEmail = (input) => {
    return input.trim().toLowerCase();
};
/**
 * Sanitize URL
 */
export const sanitizeUrl = (input) => {
    const url = input.trim();
    if (url.startsWith('javascript:') || url.startsWith('data:')) {
        return '';
    }
    return url;
};
/**
 * General input sanitizer
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return '';
    }
    return removeNullBytes(sanitizeXss(input.trim()));
};
