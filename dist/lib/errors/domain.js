import { BaseError, ValidationError } from './base.js';
/**
 * Business logic validation error
 */
export class BusinessRuleError extends BaseError {
    rule;
    ruleParams;
    constructor(message, rule, ruleParams, context) {
        super(message, 'BUSINESS_RULE_ERROR', 422, context);
        this.rule = rule;
        this.ruleParams = ruleParams;
    }
    isRetryable() {
        return false;
    }
    getSeverity() {
        return 'medium';
    }
    toJSON() {
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
    expectedVersion;
    actualVersion;
    constructor(message, expectedVersion, actualVersion, context) {
        super(message, 'CONCURRENCY_ERROR', 409, context);
        this.expectedVersion = expectedVersion;
        this.actualVersion = actualVersion;
    }
    isRetryable() {
        return true;
    }
    getSeverity() {
        return 'medium';
    }
    toJSON() {
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
    entityType;
    constructor(message, entityType, issues = [], context) {
        super(message, issues, context);
        this.entityType = entityType;
    }
    toJSON() {
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
    invariant;
    aggregateId;
    aggregateType;
    constructor(message, invariant, aggregateId, aggregateType, context) {
        super(message, 'INVARIANT_VIOLATION', 422, context);
        this.invariant = invariant;
        this.aggregateId = aggregateId;
        this.aggregateType = aggregateType;
    }
    isRetryable() {
        return false;
    }
    getSeverity() {
        return 'high';
    }
    toJSON() {
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
    resource;
    limit;
    current;
    constructor(message, resource, limit, current, context) {
        super(message, 'RESOURCE_EXHAUSTED', 429, context);
        this.resource = resource;
        this.limit = limit;
        this.current = current;
    }
    isRetryable() {
        return true;
    }
    getSeverity() {
        return 'medium';
    }
    toJSON() {
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
    operation;
    timeoutMs;
    constructor(message, operation, timeoutMs, context) {
        super(message, 'TIMEOUT_ERROR', 408, context);
        this.operation = operation;
        this.timeoutMs = timeoutMs;
    }
    isRetryable() {
        return true;
    }
    getSeverity() {
        return 'medium';
    }
    toJSON() {
        return {
            ...super.toJSON(),
            operation: this.operation,
            timeoutMs: this.timeoutMs,
        };
    }
}
