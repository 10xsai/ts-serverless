import type { ErrorContext } from '../types.js';
import { BaseError, ValidationError } from './base.js';

/**
 * Business logic validation error
 */
export class BusinessRuleError extends BaseError {
    public readonly rule: string;
    public readonly ruleParams?: Record<string, unknown>;

    constructor(
        message: string,
        rule: string,
        ruleParams?: Record<string, unknown>,
        context?: ErrorContext
    ) {
        super(message, 'BUSINESS_RULE_ERROR', 422, context);
        this.rule = rule;
        this.ruleParams = ruleParams;
    }

    public isRetryable(): boolean {
        return false;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'medium';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            rule: this.rule,
            ruleParams: this.ruleParams,
        };
    }
}

/**
 * Concurrency control error (optimistic locking)
 */
export class ConcurrencyError extends BaseError {
    public readonly expectedVersion: number;
    public readonly actualVersion: number;

    constructor(
        message: string,
        expectedVersion: number,
        actualVersion: number,
        context?: ErrorContext
    ) {
        super(message, 'CONCURRENCY_ERROR', 409, context);
        this.expectedVersion = expectedVersion;
        this.actualVersion = actualVersion;
    }

    public isRetryable(): boolean {
        return true;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'medium';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            expectedVersion: this.expectedVersion,
            actualVersion: this.actualVersion,
        };
    }
}

/**
 * Domain entity validation error
 */
export class DomainValidationError extends ValidationError {
    public readonly entityType: string;

    constructor(
        message: string,
        entityType: string,
        issues: Array<{
            field: string;
            message: string;
            code: string;
            value?: unknown;
        }> = [],
        context?: ErrorContext
    ) {
        super(message, issues, context);
        this.entityType = entityType;
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            entityType: this.entityType,
        };
    }
}

/**
 * Aggregate root invariant violation error
 */
export class InvariantViolationError extends BaseError {
    public readonly invariant: string;
    public readonly aggregateId: string;
    public readonly aggregateType: string;

    constructor(
        message: string,
        invariant: string,
        aggregateId: string,
        aggregateType: string,
        context?: ErrorContext
    ) {
        super(message, 'INVARIANT_VIOLATION', 422, context);
        this.invariant = invariant;
        this.aggregateId = aggregateId;
        this.aggregateType = aggregateType;
    }

    public isRetryable(): boolean {
        return false;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'high';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            invariant: this.invariant,
            aggregateId: this.aggregateId,
            aggregateType: this.aggregateType,
        };
    }
}

/**
 * Resource exhausted error (e.g., quota exceeded)
 */
export class ResourceExhaustedError extends BaseError {
    public readonly resource: string;
    public readonly limit: number;
    public readonly current: number;

    constructor(
        message: string,
        resource: string,
        limit: number,
        current: number,
        context?: ErrorContext
    ) {
        super(message, 'RESOURCE_EXHAUSTED', 429, context);
        this.resource = resource;
        this.limit = limit;
        this.current = current;
    }

    public isRetryable(): boolean {
        return true;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'medium';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            resource: this.resource,
            limit: this.limit,
            current: this.current,
        };
    }
}

/**
 * Operation timeout error
 */
export class TimeoutError extends BaseError {
    public readonly operation: string;
    public readonly timeoutMs: number;

    constructor(
        message: string,
        operation: string,
        timeoutMs: number,
        context?: ErrorContext
    ) {
        super(message, 'TIMEOUT_ERROR', 408, context);
        this.operation = operation;
        this.timeoutMs = timeoutMs;
    }

    public isRetryable(): boolean {
        return true;
    }

    public getSeverity(): 'low' | 'medium' | 'high' | 'critical' {
        return 'medium';
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            operation: this.operation,
            timeoutMs: this.timeoutMs,
        };
    }
} 