/**
 * Security-related type definitions
 */
/**
 * Security validation result
 */
export interface SecurityValidationResult {
    isValid: boolean;
    issues: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
}
/**
 * Input sanitization options
 */
export interface SanitizationOptions {
    allowHtml?: boolean;
    allowScripts?: boolean;
    stripTags?: boolean;
    maxLength?: number;
}
/**
 * Security policy configuration
 */
export interface SecurityPolicy {
    maxInputLength: number;
    allowedFileTypes: string[];
    blockedPatterns: RegExp[];
    requireStrongPasswords: boolean;
    enableXssProtection: boolean;
    enableSqlInjectionProtection: boolean;
}
/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
/**
 * Authentication token
 */
export interface AuthToken {
    type: 'bearer' | 'basic' | 'api-key';
    value: string;
    expiresAt?: Date;
    scopes?: string[];
}
/**
 * Permission check result
 */
export interface PermissionResult {
    allowed: boolean;
    reason?: string;
    requiredPermissions?: string[];
}
/**
 * Security context
 */
export interface SecurityContext {
    userId?: string;
    tenantId?: string;
    permissions: string[];
    roles: string[];
    ipAddress?: string;
    userAgent?: string;
}
