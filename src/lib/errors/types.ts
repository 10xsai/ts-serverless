import type { ErrorContext, TraceId } from '../types.js';

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error log levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Error handler function signature
 */
export type ErrorHandler = (error: unknown, context?: ErrorContext) => Promise<void>;

/**
 * Error transformer function signature
 */
export type ErrorTransformer = (error: unknown) => Error;

/**
 * Error handling configuration
 */
export interface ErrorHandlingConfig {
    logErrors?: boolean;
    includeStackTrace?: boolean;
    transformUnknownErrors?: boolean;
    logLevel?: LogLevel;
}

/**
 * Error log entry structure
 */
export interface ErrorLogEntry {
    timestamp: string;
    level: LogLevel;
    error: {
        name: string;
        code: string;
        message: string;
        statusCode: number;
        traceId: TraceId;
        stack?: string;
    };
    context?: ErrorContext;
}

/**
 * Error reporting interface
 */
export interface ErrorReporter {
    report(error: Error, context?: ErrorContext): Promise<void>;
}

/**
 * Error recovery strategy
 */
export interface ErrorRecoveryStrategy {
    canRecover(error: Error): boolean;
    recover(error: Error, context?: ErrorContext): Promise<unknown>;
}

/**
 * Error metrics interface
 */
export interface ErrorMetrics {
    increment(errorType: string, severity: ErrorSeverity): void;
    recordLatency(operation: string, duration: number): void;
    recordError(error: Error, context?: ErrorContext): void;
}

/**
 * Error pattern matching
 */
export interface ErrorPattern {
    pattern: string | RegExp;
    handler: ErrorHandler;
    transformer?: ErrorTransformer;
}

/**
 * Error boundary configuration
 */
export interface ErrorBoundaryConfig {
    fallback?: (error: Error) => unknown;
    onError?: ErrorHandler;
    isolate?: boolean;
}

/**
 * Validation error issue
 */
export interface ValidationIssue {
    field: string;
    message: string;
    code: string;
    value?: unknown;
    path?: string[];
}

/**
 * Error context builder
 */
export interface ErrorContextBuilder {
    withOperation(operation: string): ErrorContextBuilder;
    withEntity(entityType: string, entityId?: string): ErrorContextBuilder;
    withUser(userId: string): ErrorContextBuilder;
    withTenant(tenantId: string): ErrorContextBuilder;
    withMetadata(key: string, value: unknown): ErrorContextBuilder;
    withTraceId(traceId: TraceId): ErrorContextBuilder;
    build(): ErrorContext;
} 