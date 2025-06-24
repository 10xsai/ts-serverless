/**
 * Security validation utilities
 */
/**
 * Check if input contains potential SQL injection
 */
export const hasSqlInjection = (input) => {
    const sqlKeywords = /\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/i;
    return sqlKeywords.test(input);
};
/**
 * Check if input contains potential XSS
 */
export const hasXss = (input) => {
    const xssPatterns = /<script|javascript:|on\w+\s*=/i;
    return xssPatterns.test(input);
};
/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
    if (password.length < 8)
        return false;
    if (!/[a-z]/.test(password))
        return false;
    if (!/[A-Z]/.test(password))
        return false;
    if (!/\d/.test(password))
        return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        return false;
    return true;
};
/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
/**
 * Check if input is safe for file operations
 */
export const isSafeFilename = (filename) => {
    const dangerousChars = /[<>:"/\\|?*]/;
    const reservedNames = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
    return !dangerousChars.test(filename) && !reservedNames.test(filename);
};
