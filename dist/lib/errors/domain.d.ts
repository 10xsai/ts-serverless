import type { ErrorContext } from '../types.js';
import { BaseError, ValidationError } from './base.js';
/**
 * Business logic validation error
 */
export declare class BusinessRuleError extends BaseError {
    readonly rule: string;
    readonly ruleParams?: Record<string, unknown>;
    constructor(message: string, rule: string, ruleParams?: Record<string, unknown>, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Concurrency control error (optimistic locking)
 */
export declare class ConcurrencyError extends BaseError {
    readonly expectedVersion: number;
    readonly actualVersion: number;
    constructor(message: string, expectedVersion: number, actualVersion: number, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Domain entity validation error
 */
export declare class DomainValidationError extends ValidationError {
    readonly entityType: string;
    constructor(message: string, entityType: string, issues?: Array<{
        field: string;
        message: string;
        code: string;
        value?: unknown;
    }>, context?: ErrorContext);
    toJSON(): Record<string, unknown>;
}
/**
 * Aggregate root invariant violation error
 */
export declare class InvariantViolationError extends BaseError {
    readonly invariant: string;
    readonly aggregateId: string;
    readonly aggregateType: string;
    constructor(message: string, invariant: string, aggregateId: string, aggregateType: string, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Resource exhausted error (e.g., quota exceeded)
 */
export declare class ResourceExhaustedError extends BaseError {
    readonly resource: string;
    readonly limit: number;
    readonly current: number;
    constructor(message: string, resource: string, limit: number, current: number, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
/**
 * Operation timeout error
 */
export declare class TimeoutError extends BaseError {
    readonly operation: string;
    readonly timeoutMs: number;
    constructor(message: string, operation: string, timeoutMs: number, context?: ErrorContext);
    isRetryable(): boolean;
    getSeverity(): 'low' | 'medium' | 'high' | 'critical';
    toJSON(): Record<string, unknown>;
}
